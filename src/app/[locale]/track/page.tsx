import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrackPageClient } from "@/components/track/TrackPageClient";
import { pageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "track" });
  return pageMetadata({
    locale,
    path: "/track",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("track");

  return (
    <div className="container-site py-14 md:py-20">
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-sub">{t("subtitle")}</p>
      <div className="mt-10 max-w-3xl">
        <Suspense
          fallback={
            <div className="h-14 animate-pulse rounded-xl bg-white/80" />
          }
        >
          <TrackPageClient />
        </Suspense>
      </div>
    </div>
  );
}
