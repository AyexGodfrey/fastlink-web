import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getService, services } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo/page-meta";

export function generateStaticParams() {
  return services.flatMap((s) => [
    { locale: "en", slug: s.slug },
    { locale: "zh", slug: s.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const zh = locale === "zh";
  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: zh ? service.titleZh : service.title,
    description: zh ? service.summaryZh : service.summary,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getService(slug);
  if (!service) notFound();
  const t = await getTranslations("common");
  const tn = await getTranslations("nav");
  const zh = locale === "zh";

  return (
    <div className="container-site py-14 md:py-20">
      <Link href="/services" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--navy)]">
        ← {t("back")}
      </Link>
      <h1 className="section-title mt-4">
        {zh ? service.titleZh : service.title}
      </h1>
      <p className="section-sub">
        {zh ? service.summaryZh : service.summary}
      </p>
      <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[color:var(--ink)]">
        {zh ? service.bodyZh : service.body}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/quote" className="btn-primary">
          {tn("quote")}
        </Link>
        <Link href="/sourcing" className="btn-ghost">
          {tn("sourcing")}
        </Link>
      </div>
    </div>
  );
}
