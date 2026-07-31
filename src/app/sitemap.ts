import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";
import { financingTopics } from "@/lib/content/financing";
import { knowledgeArticles } from "@/lib/content/knowledge";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "zh"];
  const staticPaths = [
    "",
    "/services",
    "/industries",
    "/trade-financing",
    "/track",
    "/calculate",
    "/quote",
    "/sourcing",
    "/contact",
    "/knowledge",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const s of services) {
      entries.push({
        url: `${base}/${locale}/services/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const i of industries) {
      entries.push({
        url: `${base}/${locale}/industries/${i.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const f of financingTopics) {
      entries.push({
        url: `${base}/${locale}/trade-financing/${f.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const a of knowledgeArticles) {
      entries.push({
        url: `${base}/${locale}/knowledge/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
