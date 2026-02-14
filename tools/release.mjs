// tools/release.mjs
import fs from "node:fs";
import { execSync } from "node:child_process";

function sh(cmd) {
  execSync(cmd, { stdio: "inherit" });
}
function out(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

const bump = process.argv[2] ?? "patch"; // patch|minor|major
if (!["patch", "minor", "major"].includes(bump)) {
  console.error("Usage: node tools/release.mjs [patch|minor|major]");
  process.exit(1);
}

function requireCleanWorktree(where = "preflight") {
  const status = out("git status --porcelain");
  if (status) {
    console.error(`[${where}] WORKTREE_DIRTY`);
    console.error(status);
    process.exit(1);
  }
}

function parseSemver(v) {
  const [maj, min, pat] = String(v ?? "0.0.0")
    .split(".")
    .map((n) => parseInt(n, 10));
  return {
    maj: Number.isFinite(maj) ? maj : 0,
    min: Number.isFinite(min) ? min : 0,
    pat: Number.isFinite(pat) ? pat : 0,
  };
}

function bumpSemver(cur, kind) {
  const next = { ...cur };
  if (kind === "patch") next.pat += 1;
  if (kind === "minor") {
    next.min += 1;
    next.pat = 0;
  }
  if (kind === "major") {
    next.maj += 1;
    next.min = 0;
    next.pat = 0;
  }
  return next;
}

function tagExists(tag) {
  try {
    out(`git rev-parse -q --verify "refs/tags/${tag}"`);
    return true;
  } catch {
    return false;
  }
}

function currentBranch() {
  return out("git rev-parse --abbrev-ref HEAD");
}

// --- AUTHORITY PRE-FLIGHT ---
requireCleanWorktree("preflight");
const branch = currentBranch();
if (branch !== "main") {
  console.error(`[preflight] Must release from main (current: ${branch})`);
  process.exit(1);
}

// --- QUALITY GATE (must pass) ---
console.log("[gate] pnpm run underlayer:gate");
sh("pnpm run underlayer:gate");

// Ensure exports pack is generated and committed (export runs inside gate, but we guard anyway)
console.log("[guard] exports pack must be up-to-date and committed");
requireCleanWorktree("post-gate");

// --- VERSION BUMP ---
const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const cur = parseSemver(pkg.version);
const next = bumpSemver(cur, bump);
const newVer = `${next.maj}.${next.min}.${next.pat}`;

const tag = `underlayer-v${newVer}`;
if (tagExists(tag)) {
  console.error(`[version] Tag already exists: ${tag}`);
  process.exit(1);
}

pkg.version = newVer;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`[version] package.json -> ${newVer}`);

// --- COMMIT VERSION BUMP ---
sh(`git add "${pkgPath}"`);
sh(`git commit -m "Release: v${newVer}"`);

// --- TAG + PUSH ---
sh(`git tag ${tag}`);
sh(`git push origin main`);
sh(`git push origin ${tag}`);

// --- MOVE STABLE TAG (FORCE UPDATE) ---
sh(`git tag -f underlayer-stable`);
sh(`git push -f origin underlayer-stable`);

console.log(`[ok] Released ${tag} (and moved underlayer-stable)`);
