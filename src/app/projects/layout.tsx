import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Projects | Dayal Constructions & Co.",
  description: "Browse Dayal Constructions & Co.'s portfolio of completed residential, commercial and industrial projects across Siliguri and West Bengal — built with precision and pride.",
  alternates: { canonical: "https://dayalconstructions.in/projects" },
  openGraph: { url: "https://dayalconstructions.in/projects", title: "Projects | Dayal Constructions & Co." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
