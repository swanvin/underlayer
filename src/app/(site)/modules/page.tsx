import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import Link from "next/link";
import { listModules } from "@/lib/modules/registry";

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

      <div className="space-y-2">
        {mods.map((m: any) => (
          <Link
            key={m.slug}
            href={`/modules/${m.slug}`}
            className="block rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04]"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-sm text-neutral-200">
                <span className="text-neutral-500">MODULE </span>
                <span className="font-mono">{m.id}</span>
                <span className="mx-2 text-neutral-700">·</span>
                <span className="text-neutral-100">{m.name}</span>
              </div>
              <div className="text-xs text-neutral-500">{m.status}</div>
            </div>

            <div className="mt-1 text-xs text-neutral-500">
              {m.law?.title ? m.law.title : "—"}
            </div>
          </Link>
        ))}
      </div>

      <RuleLine />

      <div className="text-xs text-neutral-600">
        SPEC = defined · LIVE = executable · COMING = visible, sealed
      </div>
    </Container>
  );
}
