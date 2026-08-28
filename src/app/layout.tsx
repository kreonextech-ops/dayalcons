import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://dayalconstructions.in"),
  title: {
    default: "Dayal Constructions & Co. | Premium Construction Company in Siliguri",
    template: "%s | Dayal Constructions & Co.",
  },
  description:
    "Dayal Constructions & Co. is a trusted construction company in Siliguri, West Bengal offering residential, commercial and industrial construction, BIM design, structural engineering, interior design, and turnkey projects.",
  keywords: [
    "construction company Siliguri",
    "Dayal Constructions",
    "residential construction Siliguri",
    "commercial construction West Bengal",
    "industrial construction North Bengal",
    "BIM design Siliguri",
    "structural design Siliguri",
    "interior design Siliguri",
    "building plan approval West Bengal",
    "turnkey construction Siliguri",
    "3D elevation design",
    "soil testing Siliguri",
    "vastu consultation",
    "construction company West Bengal",
    "contractor Siliguri",
  ],
  authors: [{ name: "Dayal Constructions & Co.", url: "https://dayalconstructions.in" }],
  creator: "Dayal Constructions & Co.",
  publisher: "Dayal Constructions & Co.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dayalconstructions.in",
    siteName: "Dayal Constructions & Co.",
    title: "Dayal Constructions & Co. | Premium Construction Company in Siliguri",
    description:
      "Dayal Constructions & Co. delivers premium residential, commercial and industrial construction with precision, transparency and uncompromising quality across West Bengal and India.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dayal Constructions & Co. - Born To Build",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dayal Constructions & Co. | Premium Construction Company in Siliguri",
    description:
      "Trusted construction company in Siliguri, West Bengal. Residential, commercial & industrial projects delivered with precision and transparency.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://dayalconstructions.in",
  },
  category: "construction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Hanken+Grotesk:wght@400;700&family=Inter:wght@400;600&family=Montserrat:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@700&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <JsonLd />
      </head>
      <body className="antialiased overflow-x-hidden relative text-body-lg">
        <SmoothScroll>
          <Header />
          <div className="relative z-10">
            {children}
          </div>
          <Footer />
        </SmoothScroll>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
