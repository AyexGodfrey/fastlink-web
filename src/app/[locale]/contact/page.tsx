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
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tf = await getTranslations("footer");

  return (
    <div className="container-site py-14 md:py-20">
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-sub">{t("subtitle")}</p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[color:var(--muted)]">
        {t("disambiguation")}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-[0_10px_40px_rgba(15,45,74,0.06)]">
            <h2 className="text-lg font-semibold text-[color:var(--navy)]">
              {tf("china")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
              Room 321, C3 building, Wanda Office Area, Baiyun District,
              Guangzhou, China
            </p>
            <p className="mt-2 text-sm text-[color:var(--navy)]">
              LIN BING · +86 136 6053 4638
            </p>
            <iframe
              title="China office map"
              className="mt-4 h-48 w-full rounded-xl border-0 grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Wanda+Office+Area+Baiyun+Guangzhou&output=embed"
            />
          </div>
          <div className="rounded-xl bg-white p-6 shadow-[0_10px_40px_rgba(15,45,74,0.06)]">
            <h2 className="text-lg font-semibold text-[color:var(--navy)]">
              {tf("uganda")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
              Gyagenda Plaza, Room 007, Bweyogerere, Kyobe Rd, Kampala, Uganda
            </p>
            <p className="mt-2 text-sm text-[color:var(--navy)]">
              +256 795 896 222 · +86 136 6053 4638
            </p>
            <p className="mt-4 text-sm">
              <span className="font-semibold text-[color:var(--navy)]">
                {t("hours")}:
              </span>{" "}
              <span className="text-[color:var(--muted)]">{t("hoursValue")}</span>
            </p>
            <iframe
              title="Uganda office map"
              className="mt-4 h-48 w-full rounded-xl border-0 grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=9M9F%2B986,+Kampala,+Uganda&output=embed"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-light text-[color:var(--navy)]">
            {t("formTitle")}
          </h2>
          <LeadForm
            type="CONTACT"
            submitLabel={t("submit")}
            successMessage={t("success")}
            showMessage
          />
        </div>
      </div>
    </div>
  );
}
