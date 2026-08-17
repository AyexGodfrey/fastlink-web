import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** Canonical + hreflang for a locale-prefixed path (`""` or `"/track"`). */
export function pageMetadata(opts: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const base = getSiteUrl();
  const trimmed = (opts.path || "").replace(/^\/+|\/+$/g, "");
  const suffix = trimmed ? `/${trimmed}` : "";
  const canonical = `${base}/${opts.locale}${suffix}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical,
      languages: {
        en: `${base}/en${suffix}`,
        zh: `${base}/zh${suffix}`,
        "x-default": `${base}/en${suffix}`,
      },
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      siteName: "AMG International Logistics",
      locale: opts.locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
  };
}
