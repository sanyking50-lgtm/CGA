/* ── JSON-LD Structured Data Schemas ──────────────────────────────── */

const SITE_URL = "https://creategrowthagency.com";

/* ── Breadcrumb List ────────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/* ── Organization ───────────────────────────────────────────────── */

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Create Growth Agency",
    alternateName: "CGA",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "BD's #1 YouTube Growth Agency — professional video editing, thumbnail design, script writing, and channel management to scale your YouTube channel fast.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${SITE_URL}/contact`,
    },
    sameAs: [
      "https://www.youtube.com/@vishprotadevofficialAgency",
      "https://www.facebook.com/vishprotadevofficial",
      "https://www.instagram.com/vishprotadevofficial",
      "https://twitter.com/vishprotadev",
    ],
  };
}

/* ── Service ────────────────────────────────────────────────────── */

export interface ServiceSchemaInput {
  name: string;
  description: string;
  slug: string;
}

export function getServiceSchema(service: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Create Growth Agency",
      url: SITE_URL,
    },
    url: `${SITE_URL}/services/${service.slug}`,
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    serviceType: "YouTube Growth Services",
  };
}

/* ── FAQ ────────────────────────────────────────────────────────── */

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}