import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

type ExportFile = {
  label: string;
  rel: string;
  hint: string;
};

function readSafe(rel: string) {
  const p = path.join(process.cwd(), rel);
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

export default function ExportsPage() {
  const files: ExportFile[] = [
    { label: "registry.ts", rel: "exports/registry.ts", hint: "Canonical module registry export" },
    { label: "modules.json", rel: "exports/modules.json", hint: "Serialized module list" },
    { label: "sitemap.json", rel: "exports/sitemap.json", hint: "Routes + sitemap structure" },
    { label: "underlayer.index.md", rel: "exports/underlayer.index.md", hint: "Human-readable export index" },
  ];

  const indexMd = readSafe("exports/underlayer.index.md");

  return (
    <Container>
      <div className="text-xs tracking-wide text-neutral-500">UNDERLAYER · EXPORT PACK</div>
      <div className="mt-2 text-3xl">Exports</div>
      <div className="mt-2 text-sm text-neutral-400">
        Machine-readable outputs. Audit-ready. Versionable.
      </div>

      <RuleLine />

      <div className="flex flex-wrap gap-3 text-xs">
        <Link
          className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50"
          href="/modules"
        >
          Modules →
        </Link>
        <Link
          className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50"
          href="/underlayer"
        >
          Internal Standard →
        </Link>
      </div>

      <RuleLine />

      <div className="space-y-2">
        {files.map((f) => (
          <div
            key={f.rel}
            className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-sm text-neutral-200">
                <span className="font-mono">{f.label}</span>
              </div>

              <div className="flex gap-3 text-xs">
                <Link
                  className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50"
                  href={`/${f.rel}`}
                  target="_blank"
                >
                  Raw →
                </Link>
                <Link
                  className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50"
                  href={`/exports/view?file=${encodeURIComponent(f.rel)}`}
                >
                  View →
                </Link>
              </div>
            </div>

            <div className="mt-1 text-xs text-neutral-500">{f.hint}</div>
            <div className="mt-2 text-[11px] text-neutral-600">{f.rel}</div>
          </div>
        ))}
      </div>

      <RuleLine />

      <div className="text-xs text-neutral-500">Index preview</div>
      <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        {indexMd ? (
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-200">
            {indexMd}
          </pre>
        ) : (
          <div className="text-xs text-neutral-500">
            Missing <span className="font-mono">exports/underlayer.index.md</span>. Run{" "}
            <span className="font-mono">pnpm run underlayer:export</span>.
          </div>
        )}
      </div>

      <RuleLine />

      <div className="text-xs text-neutral-600">
        Export Pack is deterministic: regen, diff, commit, ship.
      </div>
    </Container>
  );
}