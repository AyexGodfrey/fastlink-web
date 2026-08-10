import { getSiteUrl } from "@/lib/site-url";

export function buildOrganizationWebsiteJsonLd(locale: string) {
  const base = getSiteUrl();
  const home = `${base}/${locale}`;
  const logo = `${base}/icon.png`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "AMG",
        legalName: "AMG International Logistics",
        url: base,
        logo: {
          "@type": "ImageObject",
          url: logo,
        },
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: "AMG",
        alternateName: "AMG International Logistics",
        url: base,
        inLanguage: locale === "zh" ? "zh" : "en",
        publisher: { "@id": `${base}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${home}/track?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}
