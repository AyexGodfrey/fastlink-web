import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  financingTopics,
  getFinancingTopic,
} from "@/lib/content/financing";
import { pageMetadata } from "@/lib/seo/page-meta";

export function generateStaticParams() {
  return financingTopics.flatMap((topic) => [
    { locale: "en", slug: topic.slug },
    { locale: "zh", slug: topic.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = getFinancingTopic(slug);
  if (!topic) return {};
  const zh = locale === "zh";
  return pageMetadata({
    locale,
    path: `/trade-financing/${slug}`,
    title: zh ? topic.titleZh : topic.title,
    description: zh ? topic.summaryZh : topic.summary,
  });
}

export default async function FinancingTopicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const topic = getFinancingTopic(slug);
  if (!topic) notFound();

  const t = await getTranslations("common");
  const tf = await getTranslations("financing");
  const tn = await getTranslations("nav");
  const zh = locale === "zh";

  const paragraphs = (zh ? topic.detailZh : topic.detail).split("\n\n");
  const points = zh ? topic.pointsZh : topic.points;

  return (
    <div className="container-site py-14 md:py-20">
      <Link
        href="/trade-financing"
        className="text-sm text-[color:var(--muted)] hover:text-[color:var(--navy)]"
      >
        ← {t("back")}
      </Link>

      <h1 className="section-title mt-4">
        {zh ? topic.titleZh : topic.title}
      </h1>
      <p className="section-sub">
        {zh ? topic.summaryZh : topic.summary}
      </p>

      <div className="mt-10 max-w-3xl space-y-5 text-lg leading-relaxed text-[color:var(--ink)]">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>

      <div className="mt-10 max-w-3xl">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
          {tf("whatItCovers")}
        </h2>
        <ul className="mt-4 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="border-t border-[color:var(--line)] pt-3 text-[color:var(--ink)]"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/quote" className="btn-primary">
          {tn("quote")}
        </Link>
        <Link href="/contact" className="btn-ghost">
          {tn("contact")}
        </Link>
      </div>
    </div>
  );
}
