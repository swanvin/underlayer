import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import Link from "next/link";

export default function SiteHome() {
  return (
    <Container>
      <div className="text-xs text-neutral-500">UNDERLAYER</div>
      <div className="mt-2 text-3xl">Tools Beneath Reality.</div>
      <div className="mt-2 text-sm text-neutral-400">
        Definitions first. Tools later.
      </div>

      <RuleLine />

      <div className="flex flex-wrap gap-3 text-xs">
        <Link className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50" href="/modules">
          Modules →
        </Link>
        <Link className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50" href="/underlayer">
          Internal Standard →
        </Link>
        <Link className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50" href="/exports">
          Exports →
        </Link>
      </div>

      <RuleLine />

      <div className="text-xs text-neutral-600">
        SPEC = defined · LIVE = executable · COMING = visible, sealed
      </div>
    </Container>
  );
}