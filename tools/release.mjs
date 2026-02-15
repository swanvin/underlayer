// tools/release.mjs
import fs from "node:fs";
import { execSync } from "node:child_process";

function sh(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function out(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

function die(msg) {
  console.error(`⛔ ${msg}`);
  process.exit(1);
}

const bump = process.argv[2] ?? "patch"; // patch|minor|major
if (!["patch", "minor", "major"].includes(bump)) {
  die('Usage: node tools/release.mjs [patch|minor|major]');
}

// 0) Must start clean
const pre = out("git status --porcelain");
if (pre) {
  console.error("⛔ Working tree not clean:\n" + pre);
  process.exit(1);
}

const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const [maj0, min0, pat0] = String(pkg.version ?? "0.0.0")
  .split(".")
  .map((n) => parseInt(n, 10));

let next = { maj: maj0 || 0, min: min0 || 0, pat: pat0 || 0 };
if (bump === "patch") next.pat += 1;
if (bump === "minor") {
  next.min += 1;
  next.pat = 0;
}
if (bump === "major") {
  next.maj += 1;
  next.min = 0;
  next.pat = 0;
}

const newVer = `${next.maj}.${next.min}.${next.pat}`;
const tag = `underlayer-v${newVer}`;

pkg.version = newVer;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`✅ version -> ${newVer}`);

// 1) Run the full gate (export + lint + build)
sh("pnpm run underlayer:gate");

// 2) Stage all changes created by gate + version bump
// (exports pack is expected to update here)
sh("git add -A");

// 3) If still dirty, fail with details (should not happen after add -A)
const mid = out("git status --porcelain");
if (mid) {
  console.error("⛔ Still dirty after staging:\n" + mid);
  process.exit(1);
}

// 4) Commit release
sh(`git commit -m "Release: ${tag}"`);

// 5) Tag release + move stable tag
sh(`git tag -f ${tag}`);
sh(`git tag -f underlayer-stable`);

// 6) Push main and tags
sh("git push origin main");
sh(`git push -f origin ${tag}`);
sh("git push -f origin underlayer-stable");

console.log(`✅ released ${tag} (and moved underlayer-stable)`);
