import { getSiteUrl } from "@/lib/site-url";

const SITELINKS = [
  { path: "/track", nameEn: "Track your shipment", nameZh: "追踪您的货物" },
  { path: "/quote", nameEn: "Get a quote", nameZh: "获取报价" },
  { path: "/calculate", nameEn: "Calculate import cost", nameZh: "计算进口成本" },
  { path: "/contact", nameEn: "Contact us", nameZh: "联系我们" },
] as const;

function socialSameAs(): string[] {
  return [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/amginternationallogistics",
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
      "https://www.facebook.com/amginternationallogistics",
    process.env.NEXT_PUBLIC_X_URL ||
      "https://x.com/amginternationallogistics",
    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
      "https://www.linkedin.com/company/amg-international-logistics",
    process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  ].filter(Boolean);
}

export function buildOrganizationWebsiteJsonLd(locale: string) {
  const base = getSiteUrl();
  const home = `${base}/${locale}`;
  const logo = `${base}/icon.png`;
  const zh = locale === "zh";

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
        sameAs: socialSameAs(),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: "AMG",
        alternateName: "AMG International Logistics",
        url: base,
        inLanguage: zh ? "zh" : "en",
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
      {
        "@type": "ItemList",
        "@id": `${home}/#sitelinks`,
        name: zh ? "快捷入口" : "Quick links",
        itemListElement: SITELINKS.map((item, index) => ({
          "@type": "SiteNavigationElement",
          position: index + 1,
          name: zh ? item.nameZh : item.nameEn,
          url: `${home}${item.path}`,
        })),
      },
    ],
  };
}
