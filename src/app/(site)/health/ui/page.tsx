import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

function safeRead(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function gitHead(): string | null {
  const headPath = path.join(process.cwd(), ".git", "HEAD");
  const head = safeRead(headPath);
  if (!head) return null;

  const line = head.trim();
  if (!line.startsWith("ref:")) return line;

  const ref = line.replace("ref:", "").trim();
  const refPath = path.join(process.cwd(), ".git", ref);
  return safeRead(refPath)?.trim() ?? null;
}

export default function HealthUI() {
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkgRaw = safeRead(pkgPath);
  const pkg = pkgRaw ? JSON.parse(pkgRaw) : null;

  const buildId = safeRead(path.join(process.cwd(), ".next", "BUILD_ID"))?.trim() ?? "—";
  const commit = gitHead() ?? "—";

  const hasModulesJson = fs.existsSync(path.join(process.cwd(), "exports", "modules.json"));
  const hasSitemapJson = fs.existsSync(path.join(process.cwd(), "exports", "sitemap.json"));
  const hasIndexMd = fs.existsSync(path.join(process.cwd(), "exports", "underlayer.index.md"));

  return (
    <Container>
      <div className="text-xs text-neutral-500">UNDERLAYER · HEALTH</div>
      <div className="mt-2 text-3xl">System Status</div>
      <div className="mt-2 text-sm text-neutral-400">Deliberate · visible · deterministic</div>

      <RuleLine />

      <div className="grid gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="text-neutral-300">Core</div>
          <div className="mt-2 text-neutral-200">
            <div><span className="text-neutral-400">OK:</span> true</div>
            <div><span className="text-neutral-400">ENV:</span> {process.env.NODE_ENV ?? "unknown"}</div>
            <div><span className="text-neutral-400">Version:</span> {pkg?.version ?? "—"}</div>
            <div><span className="text-neutral-400">Commit:</span> {commit}</div>
            <div><span className="text-neutral-400">Build ID:</span> {buildId}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="text-neutral-300">Export Pack</div>
          <div className="mt-2 text-neutral-200">
            <div><span className="text-neutral-400">exports/modules.json:</span> {String(hasModulesJson)}</div>
            <div><span className="text-neutral-400">exports/sitemap.json:</span> {String(hasSitemapJson)}</div>
            <div><span className="text-neutral-400">exports/underlayer.index.md:</span> {String(hasIndexMd)}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="text-neutral-300">Endpoints</div>
          <div className="mt-2 text-neutral-200">
            <div><span className="text-neutral-400">/health:</span> JSON</div>
            <div><span className="text-neutral-400">/health/ui:</span> UI</div>
          </div>
        </div>
      </div>
    </Container>
  );
}