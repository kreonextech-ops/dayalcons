import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Process | Dayal Constructions & Co.",
  description: "Understand the step-by-step construction process at Dayal Constructions & Co. — from consultation and site analysis to BIM design, estimation, construction and handover.",
  alternates: { canonical: "https://dayalconstructions.in/process" },
  openGraph: { url: "https://dayalconstructions.in/process", title: "Our Process | Dayal Constructions & Co." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
