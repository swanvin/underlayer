import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import Link from "next/link";

export default function SiteHome() {
  return (
    <Container>
      <div className="text-xs tracking-wide text-neutral-500">UNDERLAYER</div>

      <div className="mt-3 text-4xl leading-tight">
        Tools Beneath Reality.
      </div>

      <div className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
        Structural intelligence for financial systems. Definitions first. Optimization second.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/modules"
          className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm hover:bg-white/[0.04]"
        >
          View Modules
        </Link>

        <Link
          href="/underlayer"
          className="rounded-2xl border border-[#C7A54A]/30 bg-[#C7A54A]/[0.06] px-4 py-2 text-sm text-[#C7A54A] hover:bg-[#C7A54A]/[0.10]"
        >
          Internal Standard
        </Link>
      </div>

      <div className="mt-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C7A54A]/40 to-transparent" />
      </div>

      <div className="mt-8 text-sm text-neutral-300">The structural problem</div>
      <div className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-400">
        Consumers operate inside complex financial systems (credit, debt, reporting) without structural visibility.
        Errors, inefficiencies, and misalignments compound silently. Underlayer measures the forces that determine outcomes over time.
      </div>

      <RuleLine />

      <div className="text-sm text-neutral-300">The laws</div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {[
          { title: "Entropy", slug: "entropyshield", desc: "Without intervention, disorder increases." },
          { title: "Compounding", slug: "compound", desc: "Repeated inputs outweigh intense inputs." },
          { title: "Scarcity", slug: "scarcitylens", desc: "Constraints create price, behavior, strategy." },
          { title: "Feedback", slug: "loop", desc: "Outputs become inputs." },
          { title: "Inertia", slug: "ignite", desc: "Systems resist change until acted on." },
          { title: "Flow", slug: "flowshield", desc: "Value moves across boundaries." },
          { title: "Latency", slug: "latency", desc: "Delay converts intent into loss." },
          { title: "Alignment", slug: "align", desc: "Systems optimize what they measure." },
        ].map((x) => (
          <Link
            key={x.slug}
            href={`/modules/${x.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-neutral-100">{x.title}</div>
              <div className="text-xs text-[#C7A54A]/70 opacity-0 transition group-hover:opacity-100">
                Open →
              </div>
            </div>
            <div className="mt-2 text-xs leading-relaxed text-neutral-500">{x.desc}</div>
            <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-[#C7A54A]/20 to-transparent" />
          </Link>
        ))}
      </div>

      <RuleLine />

      <div className="text-sm text-neutral-300">Application layer</div>
      <div className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-400">
        Underlayer defines structural forces. Products apply them — stabilize first, optimize second.
      </div>

      <div className="mt-6 text-xs text-neutral-600">
        Underlayer v1.0 · Doctrine active · Gold = authority accent
      </div>
    </Container>
  );
}