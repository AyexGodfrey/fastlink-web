import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";

export default async function SourcingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sourcing");

  return (
    <div className="container-site py-14 md:py-20">
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-sub">{t("subtitle")}</p>
      <div className="mt-10 max-w-3xl">
        <LeadForm
          type="SOURCING"
          submitLabel={t("submit")}
          successMessage={t("success")}
          showProduct
          showLogistics
        />
      </div>
    </div>
  );
}
