import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { financingTopics } from "@/lib/content/financing";
import { pageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "financing" });
  return pageMetadata({
    locale,
    path: "/trade-financing",
    title: t("title"),
    description: t("subtitle"),
  });
}

const icons: Record<string, ReactNode> = {
  "import-po-financing": (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M4 7h12l4 4v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M16 7v4h4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="17.5" r="1.25" fill="currentColor" />
      <circle cx="16.5" cy="17.5" r="1.25" fill="currentColor" />
    </svg>
  ),
  "supplier-payment-management": (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "escrow-services": (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M12 3 4.5 6.5V11c0 5 3.2 8.6 7.5 10 4.3-1.4 7.5-5 7.5-10V6.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.8 1.8L15 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "trade-assurance-risk-mitigation": (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M12 4a5 5 0 0 1 5 5c0 3.5-5 9-5 9s-5-5.5-5-9a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" />
    </svg>
  ),
};

export default async function TradeFinancingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("financing");
  const tn = await getTranslations("nav");
  const zh = locale === "zh";

  return (
    <div className="container-site py-14 md:py-20">
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-sub">{t("subtitle")}</p>

      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
          {financingTopics.map((topic, i) => (
            <Reveal key={topic.slug} delay={i * 0.05}>
              <Link
                href={`/trade-financing/${topic.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(15,45,74,0.07)] ring-1 ring-[color:var(--line)] transition duration-300 hover:-translate-y-0.5 hover:ring-[color:var(--gold)] md:p-7"
              >
                <div className="text-[color:var(--gold)]">
                  {icons[topic.slug]}
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-[color:var(--navy)] md:text-xl">
                  {zh ? topic.titleZh : topic.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--muted)]">
                  {zh ? topic.summaryZh : topic.summary}
                </p>
                <span className="mt-5 text-sm font-semibold text-[color:var(--navy-light)] transition-colors group-hover:text-[color:var(--gold)]">
                  {t("learnMore")} →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl lg:h-full lg:min-h-full lg:rounded-l-2xl lg:rounded-r-none">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(/images/services/trade-financing-support.jpg)",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,31,53,0.05)_0%,rgba(10,31,53,0.35)_100%)]" />
          </div>
        </Reveal>
      </div>

      <Link href="/contact" className="btn-primary mt-12 inline-flex">
        {tn("contact")}
      </Link>
    </div>
  );
}
