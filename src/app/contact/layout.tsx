import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Us | Dayal Constructions & Co.",
  description: "Get in touch with Dayal Constructions & Co. in Siliguri, West Bengal. Request a free consultation, quote or site visit for your residential, commercial or industrial construction project.",
  alternates: { canonical: "https://dayalconstructions.in/contact" },
  openGraph: { url: "https://dayalconstructions.in/contact", title: "Contact Us | Dayal Constructions & Co." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
