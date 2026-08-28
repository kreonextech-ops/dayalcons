export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://dayalconstructions.in/#business",
        "name": "Dayal Constructions & Co.",
        "alternateName": "Dayal Constructions",
        "description": "Premium residential, commercial and industrial construction company in Siliguri, West Bengal. BIM design, structural engineering, interior design, turnkey projects.",
        "url": "https://dayalconstructions.in",
        "telephone": "+91-XXXXXXXXXX",
        "email": "info@dayalconstructions.in",
        "foundingDate": "2000",
        "slogan": "Born To Build",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dayalconstructions.in/images/logo-v2.png"
        },
        "image": "https://dayalconstructions.in/images/og-image.jpg",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Siliguri",
          "addressRegion": "West Bengal",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "26.7271",
          "longitude": "88.3953"
        },
        "areaServed": [
          { "@type": "City", "name": "Siliguri" },
          { "@type": "State", "name": "West Bengal" },
          { "@type": "Country", "name": "India" }
        ],
        "sameAs": [
          "https://www.facebook.com/dayalconstructionssiliguri/",
          "https://www.instagram.com/dayal.constructions.official/"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Construction Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Residential Construction" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Construction" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Industrial Construction" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "BIM Design" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Structural Design" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Interior Design" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "3D Elevation Design" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Building Plan Approval" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Soil Testing" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vastu Consultation" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Turnkey Projects" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Renovation" } }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://dayalconstructions.in/#website",
        "url": "https://dayalconstructions.in",
        "name": "Dayal Constructions & Co.",
        "publisher": { "@id": "https://dayalconstructions.in/#business" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://dayalconstructions.in/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
