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
  console.error('Usage: node tools/release.mjs [patch|minor|major]');
  process.exit(1);
}

const status = out("git status --porcelain");
if (status) {
  console.error("❌ Working tree not clean. Commit or stash first.");
  process.exit(1);
}

const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const [maj, min, pat] = String(pkg.version ?? "0.0.0")
  .split(".")
  .map((n) => parseInt(n, 10));

let next = { maj, min, pat };
if (bump === "patch") next.pat += 1;
if (bump === "minor") { next.min += 1; next.pat = 0; }
if (bump === "major") { next.maj += 1; next.min = 0; next.pat = 0; }

const newVer = `${next.maj}.${next.min}.${next.pat}`;
pkg.version = newVer;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`✅ version -> ${newVer}`);

// Gate must pass before tagging stable
sh("pnpm run underlayer:gate");

// Commit version bump only (keeps releases traceable)
sh('git add package.json pnpm-lock.yaml');
sh(`git commit -m "Release: v${newVer}"`);

// Tag immutable version + move stable
const tag = `underlayer-v${newVer}`;
sh(`git tag ${tag}`);
sh("git tag -f underlayer-stable");

// Push
sh("git push origin main");
sh(`git push origin ${tag}`);
sh("git push -f origin underlayer-stable");

console.log(`✅ Released ${tag} + moved underlayer-stable`);
