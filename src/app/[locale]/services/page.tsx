import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesLiveTabs } from "@/components/services/ServicesLiveTabs";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <div className="container-site py-14 md:py-20">
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-sub">{t("subtitle")}</p>
      <ServicesLiveTabs />
    </div>
  );
}
