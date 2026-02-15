// tools/release.mjs
import fs from "node:fs";
import { execSync } from "node:child_process";

function sh(cmd) {
  execSync(cmd, { stdio: "inherit" });
}
function out(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}
function fail(msg) {
  console.error(`⛔ ${msg}`);
  process.exit(1);
}
function ensureCleanOrFail() {
  const s = out("git status --porcelain");
  if (s) {
    console.error("⛔ Working tree not clean:");
    console.error(s);
    process.exit(1);
  }
}
function parseSemver(v) {
  const m = String(v || "").trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return { maj: Number(m[1]), min: Number(m[2]), pat: Number(m[3]) };
}
function bumpVersion(cur, bump) {
  const p = parseSemver(cur) ?? { maj: 0, min: 0, pat: 0 };
  const next = { ...p };
  if (bump === "patch") next.pat += 1;
  if (bump === "minor") { next.min += 1; next.pat = 0; }
  if (bump === "major") { next.maj += 1; next.min = 0; next.pat = 0; }
  return `${next.maj}.${next.min}.${next.pat}`;
}

// ---- main ----
const bump = process.argv[2] ?? "patch"; // patch|minor|major
if (!["patch", "minor", "major"].includes(bump)) {
  fail("Usage: node tools/release.mjs [patch|minor|major]");
}

// Deliberate authority: releases only from main
const branch = out("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") {
  fail(`Releases must be run from main. Current branch: ${branch}`);
}

// Pre-check: must start clean
ensureCleanOrFail();

// Bump version
const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const curVer = String(pkg.version ?? "0.0.0");
const newVer = bumpVersion(curVer, bump);
pkg.version = newVer;

// Write canonical JSON (LF + newline)
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log(`✅ version: ${curVer} -> ${newVer}`);

// Commit version bump
sh("git add package.json");
const staged = out("git diff --cached --name-only");
if (!staged) fail("No staged changes after version bump. Aborting.");
sh(`git commit -m "Release: v${newVer}"`);

// Gate must be deterministic; if it dirties the tree, release fails (correct behavior)
sh("pnpm run underlayer:ready");

// Tags
const vTag = `underlayer-v${newVer}`;
const stableTag = "underlayer-stable";

// Never move version tags; only stable is movable
if (out(`git tag --list "${vTag}"`)) {
  fail(`${vTag} already exists. Choose a different bump (or delete intentionally).`);
}

sh(`git tag ${vTag}`);
sh(`git tag -f ${stableTag}`);

// Push
sh("git push origin main");
sh(`git push origin ${vTag}`);
sh(`git push -f origin ${stableTag}`);

console.log(`✅ released: ${vTag} (and updated ${stableTag})`);
