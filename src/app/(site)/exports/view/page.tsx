import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

function isAllowed(p: string) {
  const clean = String(p ?? "").replaceAll("\\", "/").replace(/^\/+/, "");
  return clean.startsWith("exports/") && !clean.includes("..");
}

export default async function ExportView(props: {
  searchParams?: Promise<{ file?: string }> | { file?: string };
}) {
  const sp = await Promise.resolve(props.searchParams ?? {});
  const file = sp.file ?? "";
  if (!file || !isAllowed(file)) return notFound();

  const abs = path.join(process.cwd(), file);
  if (!fs.existsSync(abs)) return notFound();

  const content = fs.readFileSync(abs, "utf8");

  return (
    <Container>
      <div className="text-xs tracking-wide text-neutral-500">UNDERLAYER · EXPORT VIEW</div>
      <div className="mt-2 text-2xl font-mono">{file}</div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <Link
          className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50"
          href="/exports"
        >
          Back to Exports →
        </Link>
      </div>

      <RuleLine />

      <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-neutral-200">
        {content}
      </pre>
    </Container>
  );
}