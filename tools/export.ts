import fs from "node:fs";
import path from "node:path";

type ExportModule = {
  id: string;
  slug: string;
  name: string;
  status: string;
  law?: { title: string; statement: string };
  summary?: string;
  does?: string[];
  doesNot?: string[];
  route?: string;
};

const outDir = path.join(process.cwd(), "exports");
fs.mkdirSync(outDir, { recursive: true });

// 1) Copy registry.ts snapshot (source of truth)
const reg = path.join(process.cwd(), "src", "lib", "modules", "registry.ts");
const regDst = path.join(outDir, "registry.ts");
fs.copyFileSync(reg, regDst);

// 2) Best-effort parse of exports/modules.json from runtime registry snapshot already generated earlier.
// If you later want: we can generate modules.json by importing registry at build time,
// but keeping this tool "dumb + safe" avoids TS path/alias headaches.
const modulesJson = path.join(outDir, "modules.json");
if (!fs.existsSync(modulesJson)) {
  fs.writeFileSync(modulesJson, JSON.stringify({ modules: [] as ExportModule[] }, null, 2) + "\n", "utf8");
}

const sitemapJson = path.join(outDir, "sitemap.json");
if (!fs.existsSync(sitemapJson)) {
  fs.writeFileSync(sitemapJson, JSON.stringify({ routes: [] as string[] }, null, 2) + "\n", "utf8");
}

const indexMd = path.join(outDir, "underlayer.index.md");
if (!fs.existsSync(indexMd)) {
  fs.writeFileSync(indexMd, "# Underlayer Export Pack\n\n- registry.ts\n- modules.json\n- sitemap.json\n", "utf8");
}

console.log("✅ Exported:");
console.log(" - " + regDst);
console.log(" - " + modulesJson);
console.log(" - " + sitemapJson);
console.log(" - " + indexMd);
