import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type Block =
  | { t: "h1" | "h2" | "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "li"; text: string }
  | { t: "code"; lines: string[] }
  | { t: "hr" };

function inline(text: string) {
  // very small inline formatting: **bold**, `code`
  const parts: Array<{ k: "text" | "b" | "code"; v: string }> = [];
  let s = text;

  // split by backticks first
  const segs = s.split(/`/g);
  for (let i = 0; i < segs.length; i++) {
    if (i % 2 === 1) parts.push({ k: "code", v: segs[i] });
    else parts.push({ k: "text", v: segs[i] });
  }

  // bold inside text segments
  const out: React.ReactNode[] = [];
  let key = 0;

  for (const p of parts) {
    if (p.k === "code") {
      out.push(
        <code
          key={key++}
          className="rounded bg-white/5 px-1 py-0.5 font-mono text-[12px] text-neutral-200"
        >
          {p.v}
        </code>
      );
      continue;
    }

    const bits = p.v.split(/\*\*/g);
    for (let j = 0; j < bits.length; j++) {
      if (j % 2 === 1) out.push(<strong key={key++} className="text-neutral-100">{bits[j]}</strong>);
      else if (bits[j]) out.push(<span key={key++}>{bits[j]}</span>);
    }
  }

  return out;
}

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let inCode = false;
  let code: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    if (line.trim().startsWith("```")) {
      if (!inCode) {
        inCode = true;
        code = [];
      } else {
        inCode = false;
        blocks.push({ t: "code", lines: code });
        code = [];
      }
      continue;
    }

    if (inCode) {
      code.push(raw);
      continue;
    }

    const t = line.trim();

    if (!t) continue;
    if (t === "---" || t === "⸻") {
      blocks.push({ t: "hr" });
      continue;
    }

    if (t.startsWith("# ")) {
      blocks.push({ t: "h1", text: t.slice(2).trim() });
      continue;
    }
    if (t.startsWith("## ")) {
      blocks.push({ t: "h2", text: t.slice(3).trim() });
      continue;
    }
    if (t.startsWith("### ")) {
      blocks.push({ t: "h3", text: t.slice(4).trim() });
      continue;
    }

    if (t.startsWith("- ") || t.startsWith("• ")) {
      blocks.push({ t: "li", text: t.slice(2).trim() });
      continue;
    }

    blocks.push({ t: "p", text: t });
  }

  // if file ended while in code fence
  if (inCode && code.length) blocks.push({ t: "code", lines: code });

  return blocks;
}

export default function UnderlayerPage() {
  const p = path.join(process.cwd(), "underlayer", "INTERNAL_STANDARD_v1_0.md");
  const md = fs.readFileSync(p, "utf8");

  const blocks = parse(md);

  return (
    <Container>
      <div className="text-xs text-neutral-500">UNDERLAYER · INTERNAL STANDARD</div>
      <div className="mt-2 text-3xl">Underlayer v1.0</div>
      <div className="mt-2 text-sm text-neutral-400">
        Internal doctrine. Definitions first. Tools later.
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <Link className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50" href="/modules">
          View Modules →
        </Link>
        <Link className="underline underline-offset-4 text-neutral-300 decoration-white/15 hover:decoration-white/50" href="/">
          Home →
        </Link>
      </div>

      <RuleLine />

      <article className="space-y-3">
        {blocks.map((b, i) => {
          if (b.t === "hr") return <RuleLine key={i} />;

          if (b.t === "h1")
            return <h1 key={i} className="text-xl text-neutral-100">{b.text}</h1>;
          if (b.t === "h2")
            return <h2 key={i} className="text-lg text-neutral-100">{b.text}</h2>;
          if (b.t === "h3")
            return <h3 key={i} className="text-base text-neutral-100">{b.text}</h3>;

          if (b.t === "li")
            return (
              <div key={i} className="flex gap-3 text-sm text-neutral-300">
                <div className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/25" />
                <div className="min-w-0">{inline(b.text)}</div>
              </div>
            );

          if (b.t === "code")
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-neutral-200"
              >
                <code className="font-mono">{b.lines.join("\n")}</code>
              </pre>
            );

          return (
            <p key={i} className="text-sm leading-relaxed text-neutral-300">
              {inline(b.text)}
            </p>
          );
        })}
      </article>

      <RuleLine />

      <div className="text-xs text-neutral-600">
        Tip: If you update the standard, re-run <span className="font-mono">pnpm run underlayer:export</span> to refresh the export pack.
      </div>
    </Container>
  );
}