import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesLiveTabs } from "@/components/services/ServicesLiveTabs";
import { IndustriesLiveTabs } from "@/components/industries/IndustriesLiveTabs";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const tSvc = await getTranslations("services");
  const tInd = await getTranslations("industries");
  const tFin = await getTranslations("financing");

  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="container-site py-16 md:py-24">
        <Reveal>
          <h2 className="section-title">{tSvc("title")}</h2>
          <p className="section-sub">{tSvc("subtitle")}</p>
        </Reveal>
        <ServicesLiveTabs />
        <Reveal>
          <Link href="/services" className="btn-ghost mt-10">
            {tNav("services")} →
          </Link>
        </Reveal>
      </section>

      <section className="bg-[color:var(--navy)] py-16 text-white md:py-24">
        <div className="container-site">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-light tracking-tight">
              {tFin("title")}
            </h2>
            <p className="mt-3 max-w-xl text-white/75">{tFin("subtitle")}</p>
            <Link
              href="/trade-financing"
              className="btn-primary mt-8 inline-flex"
            >
              {tSvc("learnMore")}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="container-site py-16 pb-20 md:py-24 md:pb-28">
        <Reveal>
          <h2 className="section-title">{tInd("title")}</h2>
          <p className="section-sub">{tInd("subtitle")}</p>
        </Reveal>
        <IndustriesLiveTabs />
        <Reveal>
          <Link href="/industries" className="btn-ghost mt-10">
            {tNav("industries")} →
          </Link>
        </Reveal>
      </section>

    </>
  );
}
