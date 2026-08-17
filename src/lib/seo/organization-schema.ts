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
        name: "AMG International Logistics",
        legalName: "AMG International Logistics",
        alternateName: ["AMG International", "AMG"],
        description: zh
          ? "中国至乌干达寻源、货运代理与清关，办公室位于广州与坎帕拉。"
          : "China-to-Uganda sourcing, freight forwarding, and customs clearance. Offices in Guangzhou, China and Kampala, Uganda.",
        url: base,
        logo: {
          "@type": "ImageObject",
          url: logo,
        },
        areaServed: [
          { "@type": "Country", name: "Uganda" },
          { "@type": "Country", name: "China" },
        ],
        address: [
          {
            "@type": "PostalAddress",
            streetAddress: "Gyagenda Plaza, Room 007, Bweyogerere, Kyobe Rd",
            addressLocality: "Kampala",
            addressCountry: "UG",
          },
          {
            "@type": "PostalAddress",
            streetAddress:
              "Room 321, C3 building, Wanda Office Area, Baiyun District",
            addressLocality: "Guangzhou",
            addressCountry: "CN",
          },
        ],
        sameAs: socialSameAs(),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: "AMG International Logistics",
        alternateName: "AMG",
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
