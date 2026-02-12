import fs from "node:fs";
import path from "node:path";

// IMPORTANT: this file is executed by tsx, so TS imports work.
import { MODULES } from "../src/lib/modules/registry";

const outDir = path.join(process.cwd(), "exports");
fs.mkdirSync(outDir, { recursive: true });

// 1) Copy raw registry source
const regPath = path.join(process.cwd(), "src", "lib", "modules", "registry.ts");
const regText = fs.readFileSync(regPath, "utf8");
fs.writeFileSync(path.join(outDir, "registry.ts"), regText, "utf8");

// 2) Modules JSON (truth)
const modules = [...MODULES].sort((a: any, b: any) => String(a.id).localeCompare(String(b.id)));
fs.writeFileSync(path.join(outDir, "modules.json"), JSON.stringify(modules, null, 2) + "\n", "utf8");

// 3) Sitemap
const sitemap = {
  generatedAt: new Date().toISOString(),
  routes: ["/", "/modules", ...modules.map((m: any) => `/modules/${m.slug}`)],
};
fs.writeFileSync(path.join(outDir, "sitemap.json"), JSON.stringify(sitemap, null, 2) + "\n", "utf8");

// 4) Human index
const md: string[] = [];
md.push(`# Underlayer Export Index`);
md.push(`Generated: ${sitemap.generatedAt}`);
md.push(``);
md.push(`## Modules`);
for (const m of modules) {
  md.push(`- **${m.id}** · **${m.name}** (\`${m.slug}\`) — ${m.status} · ${m.law?.title ?? ""}`);
}
md.push(``);
md.push(`## Routes`);
for (const r of sitemap.routes) md.push(`- ${r}`);
md.push(``);
fs.writeFileSync(path.join(outDir, "underlayer.index.md"), md.join("\n"), "utf8");

console.log("✅ Exported:");
console.log(" -", path.join(outDir, "registry.ts"));
console.log(" -", path.join(outDir, "modules.json"));
console.log(" -", path.join(outDir, "sitemap.json"));
console.log(" -", path.join(outDir, "underlayer.index.md"));
