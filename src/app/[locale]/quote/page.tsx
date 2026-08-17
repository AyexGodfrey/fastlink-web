import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { pageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });
  return pageMetadata({
    locale,
    path: "/quote",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quote");

  return (
    <div className="container-site py-5 md:py-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <h1 className="text-xl font-light tracking-tight text-[color:var(--navy)] md:text-2xl">
            {t("title")}
          </h1>
          <p className="max-w-xl text-sm leading-snug text-[color:var(--muted)]">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-3">
          <LeadForm
            type="QUOTE"
            submitLabel={t("submit")}
            successMessage={t("success")}
            showProduct
            showLogistics
            compact
          />
        </div>
      </div>
    </div>
  );
}
