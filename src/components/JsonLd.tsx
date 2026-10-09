export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "GeneralContractor"],
        "@id": "https://dayalconstructions.in/#business",
        "name": "Dayal Constructions & Co.",
        "alternateName": ["Dayal Constructions", "Dayal Construction Siliguri"],
        "description": "Premier residential, commercial, and industrial construction company in Siliguri, West Bengal. Expert architectural design, BIM, structural engineering, building plan approvals, land mutation, and turnkey construction services.",
        "url": "https://dayalconstructions.in",
        "telephone": "+91-7083333000",
        "email": "contact@dayalconstructions.com",
        "foundingDate": "2000",
        "slogan": "Born To Build",
        "priceRange": "₹₹ - ₹₹₹₹",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dayalconstructions.in/images/logo-v2.png",
          "caption": "Dayal Constructions & Co. Logo"
        },
        "image": [
          "https://dayalconstructions.in/images/og-image.jpg"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Noukaghat Rd, opp. Uniliv Ikon, beside Makhan Prio Momo Ghor, Ward 31, More, Babupara",
          "addressLocality": "Siliguri",
          "addressRegion": "West Bengal",
          "postalCode": "734005",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 26.6983,
          "longitude": 88.4239
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:30",
            "closes": "19:00"
          }
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-7083333000",
            "contactType": "sales",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi", "Bengali"]
          },
          {
            "@type": "ContactPoint",
            "telephone": "+91-7003070035",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi", "Bengali"]
          },
          {
            "@type": "ContactPoint",
            "telephone": "+91-9749327676",
            "contactType": "technical support",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi", "Bengali"]
          }
        ],
        "areaServed": [
          { "@type": "City", "name": "Siliguri" },
          { "@type": "AdministrativeArea", "name": "Darjeeling" },
          { "@type": "AdministrativeArea", "name": "Jalpaiguri" },
          { "@type": "State", "name": "West Bengal" },
          { "@type": "Country", "name": "India" }
        ],
        "sameAs": [
          "https://www.facebook.com/dayalconstructionssiliguri/",
          "https://www.instagram.com/dayal.constructions.official/"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Construction & Engineering Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Residential Construction", "description": "High-quality home, bungalow, and duplex construction in Siliguri." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Construction", "description": "Shopping complexes, office buildings, and retail construction." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Industrial Construction", "description": "Warehouses, industrial sheds, and heavy structure development." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "BIM & 3D Architectural Design", "description": "Building Information Modeling and 2D/3D floor planning." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Structural Engineering & Design", "description": "Earthquake-resistant structural analysis, drafting, and certification." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Building Plan Approval & LUCC", "description": "Municipal and local authority drawing approvals and compliance." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Land Registration & Mutation", "description": "Land conversion, mutation, and property legal clearance support." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Interior Architecture & Design", "description": "Modern interior fit-outs and turnkey turnkey residential interiors." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Soil Testing & Geotechnical Survey", "description": "Pre-construction soil bearing capacity test and investigation." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Turnkey Construction Projects", "description": "End-to-end concept-to-handover architectural and civil contracting." } }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://dayalconstructions.in/#website",
        "url": "https://dayalconstructions.in",
        "name": "Dayal Constructions & Co.",
        "description": "Official website of Dayal Constructions & Co., Siliguri",
        "publisher": { "@id": "https://dayalconstructions.in/#business" },
        "inLanguage": "en-IN"
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
