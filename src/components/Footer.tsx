import { UNDERLAYER_COPY } from "@/lib/underlayer/copy";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-5xl px-5 py-8 text-xs text-neutral-500">
        {UNDERLAYER_COPY.footer}
      </div>
    </footer>
  );
}