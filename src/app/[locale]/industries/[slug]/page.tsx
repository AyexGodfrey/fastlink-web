import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getIndustry, industries } from "@/lib/content/industries";

export function generateStaticParams() {
  return industries.flatMap((i) => [
    { locale: "en", slug: i.slug },
    { locale: "zh", slug: i.slug },
  ]);
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const industry = getIndustry(slug);
  if (!industry) notFound();
  const t = await getTranslations("industries");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const zh = locale === "zh";

  return (
    <div className="container-site py-14 md:py-20">
      <Link
        href="/industries"
        className="text-sm text-[color:var(--muted)] hover:text-[color:var(--navy)]"
      >
        ← {tc("back")}
      </Link>
      <h1 className="section-title mt-4">
        {zh ? industry.titleZh : industry.title}
      </h1>
      <p className="section-sub">
        {zh ? industry.summaryZh : industry.summary}
      </p>
      <p className="mt-8 max-w-3xl text-lg leading-relaxed">
        {zh ? industry.bodyZh : industry.body}
      </p>

      <h2 className="mt-14 text-xl font-semibold text-[color:var(--navy)]">
        {t("projects")}
      </h2>
      <div className="mt-6 space-y-4">
        {industry.projects.map((p) => (
          <div
            key={p.name}
            className="rounded-xl border-l-2 border-[color:var(--gold)] bg-white px-5 py-4"
          >
            <h3 className="font-semibold text-[color:var(--navy)]">
              {zh ? p.nameZh : p.name}
            </h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {zh ? p.resultZh : p.result}
            </p>
          </div>
        ))}
      </div>

      <Link href="/quote" className="btn-primary mt-10 inline-flex">
        {tn("quote")}
      </Link>
    </div>
  );
}
