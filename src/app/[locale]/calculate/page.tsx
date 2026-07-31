import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalculatePanel } from "@/components/calculate/CalculatePanel";

export default async function CalculatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("calculate");

  return (
    <div className="container-site py-14 md:py-20">
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-sub">{t("subtitle")}</p>
      <div className="mt-10">
        <CalculatePanel />
      </div>
    </div>
  );
}
