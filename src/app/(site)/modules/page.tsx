import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import Link from "next/link";
import { listModules } from "@/lib/modules/registry";

function StatusPill({ status }: { status: string }) {
  const s = String(status || "SPEC").toUpperCase();

  const cls =
    s === "LIVE"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : s === "COMING"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : "border-white/10 bg-white/[0.03] text-neutral-300";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {s}
    </span>
  );
}

export default function ModulesIndex() {
  const mods = listModules();

  return (
    <Container>
      <div className="text-xs text-neutral-500">UNDERLAYER · MODULE INDEX</div>
      <div className="mt-2 text-3xl">Modules</div>
      <div className="mt-2 text-sm text-neutral-400">
        Definitions first. Tools later.
      </div>

      <RuleLine />

      <div className="grid gap-3">
        {mods.map((m: any) => {
          const isLive = String(m.status).toUpperCase() === "LIVE";
          const hasRoute = !!m.route && String(m.route).trim().length > 0;

          return (
            <div
              key={m.slug}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-neutral-500">MODULE</span>
                    <span className="font-mono text-xs text-neutral-300">{m.id}</span>
                    <span className="text-neutral-700">·</span>
                    <Link
                      href={`/modules/${m.slug}`}
                      className="truncate text-sm text-neutral-100 underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
                    >
                      {m.name}
                    </Link>
                  </div>

                  <div className="mt-1 text-xs text-neutral-500">
                    {m.law?.title ? m.law.title : "—"}
                  </div>

                  {m.summary ? (
                    <div className="mt-2 text-sm text-neutral-300">
                      {m.summary}
                    </div>
                  ) : null}
                </div>

                <StatusPill status={m.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link
                  href={`/modules/${m.slug}`}
                  className="text-xs text-neutral-300 underline underline-offset-4 decoration-white/15 hover:decoration-white/50"
                >
                  Open definition
                </Link>

                {isLive && hasRoute ? (
                  <Link
                    href={m.route}
                    className="text-xs text-emerald-200 underline underline-offset-4 decoration-emerald-400/30 hover:decoration-emerald-400/70"
                  >
                    Open tool →
                  </Link>
                ) : (
                  <span className="text-xs text-neutral-600">Definition only</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RuleLine />

      <div className="text-xs text-neutral-600">
        SPEC = defined · LIVE = executable · COMING = visible, sealed
      </div>
    </Container>
  );
}