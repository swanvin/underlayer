import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

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
  // HEAD could be a direct SHA or a ref: refs/heads/main
  if (!line.startsWith("ref:")) return line;

  const ref = line.replace("ref:", "").trim();
  const refPath = path.join(process.cwd(), ".git", ref);
  return safeRead(refPath)?.trim() ?? null;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();

  const pkgPath = path.join(process.cwd(), "package.json");
  const pkgRaw = safeRead(pkgPath);
  const pkg = pkgRaw ? JSON.parse(pkgRaw) : null;

  const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID");
  const buildId = safeRead(buildIdPath)?.trim() ?? null;

  const commit = gitHead();

  // Core signals (keep them stable)
  const body = {
    ok: true,
    service: "underlayer",
    env: process.env.NODE_ENV ?? "unknown",
    time: now.toISOString(),
    version: pkg?.version ?? null,
    commit,
    buildId,
    exports: {
      hasModulesJson: fs.existsSync(path.join(process.cwd(), "exports", "modules.json")),
      hasSitemapJson: fs.existsSync(path.join(process.cwd(), "exports", "sitemap.json")),
      hasIndexMd: fs.existsSync(path.join(process.cwd(), "exports", "underlayer.index.md")),
    },
  };

  return NextResponse.json(body, { status: 200 });
}