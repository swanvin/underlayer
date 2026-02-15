/**
 * tools/release.mjs
 * Underlayer Auto-Release (Windows-safe)
 *
 * Usage:
 *   node tools/release.mjs patch
 *   node tools/release.mjs minor
 *   node tools/release.mjs major
 *
 * What it does:
 *   - requires fully clean repo (no staged/unstaged) before starting
 *   - runs pnpm run underlayer:gate
 *   - bumps package.json version
 *   - writes package.json as UTF-8 (no BOM) with LF newlines
 *   - stages package.json (+ pnpm-lock.yaml if changed)
 *   - runs gate again
 *   - stages any generated changes (exports, etc.)
 *   - commits, tags underlayer-vX.Y.Z, force-moves underlayer-stable, pushes
 */

import fs from "node:fs";
import { execSync } from "node:child_process";

function sh(cmd) {
  execSync(cmd, { stdio: "inherit" });
}
function out(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}
function die(msg) {
  console.error(msg);
  process.exit(1);
}

function statusPorcelain(path = "") {
  const cmd = path ? `git status --porcelain ${path}` : "git status --porcelain";
  return out(cmd);
}

function requireFullyClean(label = "Working tree not clean") {
  const s = statusPorcelain();
  if (s) die(`⛔ ${label}:\n${s}`);
}

function requireNoUnstaged(label = "Unstaged changes remain") {
  // exit code 1 if there are unstaged changes
  try {
    execSync("git diff --quiet", { stdio: "ignore" });
  } catch {
    const s = statusPorcelain();
    die(`⛔ ${label}:\n${s}`);
  }
}

function bumpVersion(oldVer, bump) {
  const parts = String(oldVer ?? "0.0.0").split(".");
  const maj = parseInt(parts[0] ?? "0", 10) || 0;
  const min = parseInt(parts[1] ?? "0", 10) || 0;
  const pat = parseInt(parts[2] ?? "0", 10) || 0;

  let M = maj, m = min, p = pat;
  if (bump === "patch") p += 1;
  if (bump === "minor") { m += 1; p = 0; }
  if (bump === "major") { M += 1; m = 0; p = 0; }

  return `${M}.${m}.${p}`;
}

function writeJsonLfNoBom(path, obj) {
  const json = JSON.stringify(obj, null, 2).replace(/\r\n/g, "\n") + "\n";
  fs.writeFileSync(path, json, { encoding: "utf8" }); // UTF-8 no BOM
}

const bump = process.argv[2] ?? "patch"; // patch|minor|major
if (!["patch", "minor", "major"].includes(bump)) {
  die("Usage: node tools/release.mjs [patch|minor|major]");
}

requireFullyClean();

console.log("🔒 Gate (pre-bump)...");
sh("pnpm run underlayer:gate");
requireFullyClean("Dirty after pre-bump gate (exports or tooling changed)");

const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const oldVer = String(pkg.version ?? "0.0.0");
const newVer = bumpVersion(oldVer, bump);
pkg.version = newVer;

writeJsonLfNoBom(pkgPath, pkg);
console.log(`✅ version -> ${newVer}`);

// Stage version bump (+ lockfile if changed)
sh("git add package.json");
const lockStatus = statusPorcelain("pnpm-lock.yaml");
if (lockStatus) sh("git add pnpm-lock.yaml");

console.log("🔒 Gate (post-bump)...");
sh("pnpm run underlayer:gate");

// Stage any generated changes (exports, etc.)
const post = statusPorcelain();
if (post) sh("git add -A");

// IMPORTANT: allow staged changes, but no *unstaged* changes
requireNoUnstaged("Unstaged changes remain after staging (unexpected)");

// Commit
const msg = `chore(release): v${newVer}`;
sh(`git commit -m "${msg}"`);

// Tag + stable pointer
const tagVer = `underlayer-v${newVer}`;
console.log(`🏷️  Tagging ${tagVer} + moving underlayer-stable...`);
sh(`git tag ${tagVer}`);
sh(`git tag -f underlayer-stable`);

console.log("🚀 Pushing main + tags...");
sh("git push origin main");
sh(`git push origin ${tagVer}`);
sh("git push -f origin underlayer-stable");

console.log(`✅ Released ${tagVer} (stable moved)`);
