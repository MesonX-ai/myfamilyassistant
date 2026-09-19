import "./globals.css";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Global metadata — applied to every page via the App Router metadata system.
// Next.js renders <title>, <meta name=description>, <meta property=og:*>,
// <meta name=twitter:*>, <link rel=canonical> etc. automatically from this
// object, so we do NOT also hand-roll a <head> (the manual <head> below only
// carries the Google Fonts preconnect/style links).
// ---------------------------------------------------------------------------

const SITE = {
  name: "MyFamilyAssistant.ai",
  url: "https://myfamilyassistant.ai",
  description:
    "MyFamilyAssistant.ai is a visual agentic workflow platform from Mesonsoft LLC " +
    "that lets families and small teams design, connect, and run AI agents on a " +
    "living canvas — no glue code required. Built by Shiva Dhanuskodi (AniShiv) " +
    "with the MesonX agent runtime.",
  keywords:
    "family AI assistant, visual agentic workflow platform, AI agents for families, " +
    "LangGraph agents, no-code AI workflows, Mesonsoft LLC, Shiva Dhanuskodi, AniShiv, MesonX",
};

export const metadata = {
  title: {
    default: `${SITE.name} — Visual Agentic Workflow Platform`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: "Shiva Dhanuskodi (AniShiv)", url: SITE.url + "/about" }],
  creator: "Shiva Dhanuskodi (AniShiv)",
  publisher: "Mesonsoft LLC",
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} — Visual Agentic Workflow Platform`,
    description: SITE.description,
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    url: SITE.url,
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "MyFamilyAssistant.ai — visual agentic workflow platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Visual Agentic Workflow Platform`,
    description: SITE.description,
    images: ["/hero.png"],
    creator: "@AniShiv",
  },
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
};

// JSON-LD structured data — tells Google explicitly WHO built this, under
// WHICH company, and WHAT the product is. This is the single highest-value
// on-page signal for the target brand/person keywords.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": SITE.url + "#organization",
      name: "Mesonsoft LLC",
      url: SITE.url,
      logo: SITE.url + "/logo.png",
      sameAs: [
        "https://www.linkedin.com/company/mesonsoft-llc",
        "https://twitter.com/mesonsoft",
        "https://www.facebook.com/mesonsoft",
      ],
      foundingDate: "2024",
      founder: {
        "@type": "Person",
        "@id": SITE.url + "#person",
        name: "Shiva Dhanuskodi",
        alternateName: "AniShiv",
        url: SITE.url + "/about",
        image: SITE.url + "/logo.png",
        jobTitle: "Founder & Lead Engineer",
        worksFor: { "@id": SITE.url + "#organization" },
        knowsAbout: [
          "AI agent workflows",
          "LangGraph",
          "visual programming",
          "family automation",
          "MesonX",
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": SITE.url + "#software",
      name: "MyFamilyAssistant.ai",
      alternateName: ["AniShiv", "MesonX Family Agent"],
      url: SITE.url,
      description:
        "A visual agentic workflow platform for families and small teams. " +
        "Design, connect, and run AI agents on a living canvas — powered by " +
        "the MesonX agent runtime from Mesonsoft LLC.",
      applicationCategory: "ProductivityApplication",
      applicationSubCategory: "AI Agent Platform",
      operatingSystem: "Web",
      softwareVersion: "1.0.0",
      provider: { "@id": SITE.url + "#organization" },
      creator: { "@id": SITE.url + "#person" },
      featureList: [
        "Visual node-and-wire agent builder",
        "No glue code required",
        "LangGraph-based agents",
        "Family-friendly by design",
        "Privacy by default",
        "24/7 reactive workflows",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "WebSite",
      "@id": SITE.url + "#website",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      publisher: { "@id": SITE.url + "#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: SITE.url + "/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": SITE.url + "#webpage",
      "@list": [SITE.url],
      name: SITE.name,
      url: SITE.url,
      about: { "@id": SITE.url + "#software" },
      isPartOf: { "@id": SITE.url + "#website" },
      publisher: { "@id": SITE.url + "#organization" },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — kept from the original layout. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD structured data — invisible to visitors, read by Google. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd, null, 2),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

