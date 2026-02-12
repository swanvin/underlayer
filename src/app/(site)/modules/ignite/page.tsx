import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import { getModule } from "@/lib/modules/registry";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function ModuleDetail() {
  const mod = getModule("ignite");
  if (!mod) return notFound();

  return (
    <Container>
      <div className="text-xs text-neutral-500">UNDERLAYER · MODULE {mod.id}</div>
      <div className="mt-2 text-3xl">{mod.name}</div>
      <div className="mt-2 text-sm text-neutral-400">{mod.status}</div>

      <RuleLine />

      <div className="text-sm text-neutral-300">{mod.law.title}</div>
      <div className="mt-2 text-sm text-neutral-400">{mod.law.statement}</div>

      <RuleLine />

      <div className="text-sm text-neutral-300">What it measures</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-400 space-y-1">
        {mod.does.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      <RuleLine />

      <div className="text-sm text-neutral-300">What it does not do</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-400 space-y-1">
        {mod.doesNot.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      {mod.status === "LIVE" && mod.route ? (
        <>
          <RuleLine />
          <div className="text-sm text-neutral-300">Live tool</div>
          <div className="mt-2">
            <Link className="text-sm underline underline-offset-4" href={mod.route}>
              Open {mod.name}
            </Link>
          </div>
        </>
      ) : null}
    </Container>
  );
}