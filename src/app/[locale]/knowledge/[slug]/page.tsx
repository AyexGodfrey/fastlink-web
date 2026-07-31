import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getArticle, knowledgeArticles } from "@/lib/content/knowledge";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200";

export function generateStaticParams() {
  return knowledgeArticles.flatMap((a) => [
    { locale: "en", slug: a.slug },
    { locale: "zh", slug: a.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const zh = locale === "zh";
  return {
    title: zh ? article.titleZh : article.title,
    description: zh ? article.excerptZh : article.excerpt,
    alternates: {
      languages: {
        en: `${base}/en/knowledge/${slug}`,
        zh: `${base}/zh/knowledge/${slug}`,
      },
    },
  };
}

function firstParagraph(text: string): string {
  return text.split("\n\n")[0]?.trim() ?? text;
}

function buildFaqAnswer(excerpt: string, body: string): string {
  const lead = firstParagraph(body);
  if (!lead || lead === excerpt || excerpt.length >= 120) return excerpt;
  return `${excerpt} ${lead}`;
}

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticle(slug);
  if (!article) notFound();
  const t = await getTranslations("common");
  const zh = locale === "zh";
  const title = zh ? article.titleZh : article.title;
  const excerpt = zh ? article.excerptZh : article.excerpt;
  const bodyText = zh ? article.bodyZh : article.body;
  const body = bodyText.split("\n\n");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: title,
        acceptedAnswer: {
          "@type": "Answer",
          text: buildFaqAnswer(excerpt, bodyText),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="container-site py-14 md:py-20">
        <Link
          href="/knowledge"
          className="text-sm text-[color:var(--muted)] hover:text-[color:var(--navy)]"
        >
          ← {t("back")}
        </Link>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--gold)]">
          {article.category}
        </div>
        <h1 className="section-title mt-2">{title}</h1>
        <p className="section-sub">{excerpt}</p>
        <div className="prose-fl mt-10 max-w-3xl space-y-5 text-base leading-relaxed text-[color:var(--ink)]">
          {body.map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>
      </article>
    </>
  );
}
