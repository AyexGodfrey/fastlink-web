"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

const featured = [
  {
    slug: "air-freight",
    title: "Air Freight",
    titleZh: "空运",
    blurb: "Fast lanes for samples, urgent cargo, and high-value parcels.",
    blurbZh: "样品、紧急货物与高价值包裹的快速空运通道。",
  },
  {
    slug: "sea-freight",
    title: "Sea Freight",
    titleZh: "海运",
    blurb: "Cost-effective FCL and LCL consolidation from China to East Africa.",
    blurbZh: "中国至东非经济高效的整柜与拼箱海运。",
  },
  {
    slug: "product-sourcing",
    title: "Sourcing",
    titleZh: "采购寻源",
    blurb: "Verified suppliers, negotiation, and factory-ready procurement.",
    blurbZh: "核验供应商、议价与可落地的工厂采购。",
  },
] as const;

export function TrustStrip() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();
  const zh = locale === "zh";

  return (
    <section className="relative -mt-6 pb-8">
      <div className="container-site">
        <Reveal>
          <div className="rounded-xl bg-white px-5 py-8 shadow-[0_20px_60px_rgba(15,45,74,0.08)] md:px-8 md:py-10">
            <div className="mb-6 max-w-2xl md:mb-8">
              <h2 className="section-title text-[1.75rem] md:text-[2rem]">
                {t("featuredTitle")}
              </h2>
              <p className="section-sub">
                {t.rich("featuredBody", {
                  bold: (chunks) => (
                    <strong className="font-semibold text-[color:var(--navy)]">
                      {chunks}
                    </strong>
                  ),
                })}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[color:var(--line)]">
              {featured.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="group block px-1 py-3 transition-colors md:px-6 md:py-2 first:md:pl-0 last:md:pr-0"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                    AMG
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-[color:var(--navy)] group-hover:text-[color:var(--navy-light)]">
                    {zh ? item.titleZh : item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                    {zh ? item.blurbZh : item.blurb}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-[color:var(--navy-light)]">
                    {tc("learnMore")} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
