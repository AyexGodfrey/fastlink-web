"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TrackPanel } from "@/components/track/TrackPanel";

export function Hero() {
  const t = useTranslations("home");
  const tb = useTranslations("brand");

  return (
    <section className="relative min-h-[100svh] overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-[position:70%_center] md:bg-[position:78%_center]"
        style={{ backgroundImage: "url(/images/amg-trucks.jpg)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,31,53,0.94)_0%,rgba(10,31,53,0.82)_38%,rgba(10,31,53,0.35)_62%,rgba(10,31,53,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(212,160,23,0.14),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[color:var(--surface)] to-transparent" />

      <div className="container-site relative flex min-h-[100svh] flex-col justify-end pb-16 pt-28 md:pb-24">
        <div className="max-w-xl md:max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--gold-soft)] md:text-sm"
          >
            {tb("full")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-[clamp(2.2rem,5.5vw,4.4rem)] font-light leading-[1.05] tracking-[-0.03em]"
          >
            {t("headline")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base font-light leading-relaxed text-white/85 md:text-lg"
          >
            {t("sub")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/quote"
              className="btn-primary"
              data-analytics="cta_click"
              data-analytics-label="Request a Quote"
            >
              {t("ctaQuote")}
            </Link>
            <Link
              href="/calculate"
              className="btn-secondary"
              data-analytics="cta_click"
              data-analytics-label="Calculate Import Cost"
            >
              {t("ctaCalculate")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          id="track"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 w-full max-w-3xl scroll-mt-28"
        >
          <TrackPanel variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
