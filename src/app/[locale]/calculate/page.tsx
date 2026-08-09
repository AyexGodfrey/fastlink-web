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
    <div className="container-site py-5 md:py-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <h1 className="text-xl font-light tracking-tight text-[color:var(--navy)] md:text-2xl">
          {t("title")}
        </h1>
        <p className="max-w-xl text-sm leading-snug text-[color:var(--muted)]">
          {t("subtitle")}
        </p>
      </div>
      <div className="mt-3">
        <CalculatePanel />
      </div>
    </div>
  );
}
