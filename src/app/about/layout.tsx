import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Us | Dayal Constructions & Co.",
  description: "Learn about Dayal Constructions & Co. — over two decades of trusted construction in Siliguri. Meet our team, our story, and our mission to deliver engineering excellence across West Bengal.",
  alternates: { canonical: "https://dayalconstructions.in/about" },
  openGraph: { url: "https://dayalconstructions.in/about", title: "About Us | Dayal Constructions & Co." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
