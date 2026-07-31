import { getTranslations, setRequestLocale } from "next-intl/server";
import { IndustriesLiveTabs } from "@/components/industries/IndustriesLiveTabs";

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");

  return (
    <div className="container-site py-14 md:py-20">
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-sub">{t("subtitle")}</p>
      <IndustriesLiveTabs />
    </div>
  );
}
