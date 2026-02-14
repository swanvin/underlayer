import type { ReactNode } from "react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "UNDERLAYER",
  description: "Tools beneath reality.",
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}