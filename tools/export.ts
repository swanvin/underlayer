import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "exports");
fs.mkdirSync(outDir, { recursive: true });

const regPath = path.join(process.cwd(), "src", "lib", "modules", "registry.ts");
const regText = fs.readFileSync(regPath, "utf8");

// 1) Always export raw registry source (source of truth)
const regDst = path.join(outDir, "registry.ts");
fs.writeFileSync(regDst, regText, "utf8");

// 2) Best-effort parse of module objects (works for your current simple registry shape)
function extractModules(ts: string) {
  // captures blocks like: { id: "001", slug: "interestshield", ... },
  const blocks = ts.match(/\{\s*id:\s*"[\s\S]*?\}\s*,/g) || [];
  const mods: any[] = [];

  for (const b of blocks) {
    const id = (b.match(/id:\s*"(\d{3})"/) || [])[1];
    const slug = (b.match(/slug:\s*"([^"]+)"/) || [])[1];
    const name = (b.match(/name:\s*"([^"]+)"/) || [])[1];
    const status = (b.match(/status:\s*"([^"]+)"/) || [])[1];

    const lawTitle = (b.match(/law:\s*\{\s*title:\s*"([^"]+)"/) || [])[1];
    const lawStatement = (b.match(/statement:\s*"([^"]+)"/) || [])[1];

    if (!id || !slug) continue;

    mods.push({
      id,
      slug,
      name: name || slug,
      status: status || "SPEC",
      law: { title: lawTitle || "", statement: lawStatement || "" },
      route: `/modules/${slug}`,
    });
  }

  // stable ordering
  mods.sort((a, b) => Number(a.id) - Number(b.id));
  return mods;
}

const modules = extractModules(regText);

// 3) Write JSON artifacts
const modulesJsonPath = path.join(outDir, "modules.json");
fs.writeFileSync(modulesJsonPath, JSON.stringify(modules, null, 2) + "\n", "utf8");

const sitemap = {
  generatedAt: new Date().toISOString(),
  routes: [
    "/",
    "/modules",
    ...modules.map((m) => `/modules/${m.slug}`),
  ],
};

const sitemapPath = path.join(outDir, "sitemap.json");
fs.writeFileSync(sitemapPath, JSON.stringify(sitemap, null, 2) + "\n", "utf8");

// 4) Human-readable index
const mdLines: string[] = [];
mdLines.push(`# Underlayer Export Index`);
mdLines.push(`Generated: ${sitemap.generatedAt}`);
mdLines.push(``);
mdLines.push(`## Modules`);
mdLines.push(
  ...modules.map(
    (m) =>
      `- **${m.id}** · **${m.name}** (\`${m.slug}\`) — ${m.status}${m.law?.title ? ` · ${m.law.title}` : ""}`
  )
);
mdLines.push(``);
mdLines.push(`## Routes`);
mdLines.push(...sitemap.routes.map((r) => `- ${r}`));
mdLines.push(``);

const mdPath = path.join(outDir, "underlayer.index.md");
fs.writeFileSync(mdPath, mdLines.join("\n"), "utf8");

console.log("✅ Exported:");
console.log(" -", regDst);
console.log(" -", modulesJsonPath);
console.log(" -", sitemapPath);
console.log(" -", mdPath);
