import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Services | Dayal Constructions & Co.",
  description: "Explore Dayal Constructions & Co.'s full range of services: residential & commercial construction, BIM design, structural engineering, interior design, 3D elevation, soil testing, vastu consultation and turnkey projects in Siliguri, West Bengal.",
  alternates: { canonical: "https://dayalconstructions.in/services" },
  openGraph: { url: "https://dayalconstructions.in/services", title: "Our Services | Dayal Constructions & Co." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
