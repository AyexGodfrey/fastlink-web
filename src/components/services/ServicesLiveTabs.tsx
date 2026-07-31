"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getServicesForTabs } from "@/lib/content/services";

export function ServicesLiveTabs() {
  const t = useTranslations("services");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const zh = locale === "zh";
  const tabs = getServicesForTabs();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || !tabs.length) return;
    const first = el.querySelector<HTMLElement>("[data-service-slide]");
    if (!first) return;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    const step = first.offsetWidth + gap;
    if (step <= 0) return;
    const index = Math.round(el.scrollLeft / step);
    const clamped = Math.max(0, Math.min(tabs.length - 1, index));
    setActive(clamped);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, [tabs.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncFromScroll();
    el.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);
    return () => {
      el.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, [syncFromScroll]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slides = el.querySelectorAll<HTMLElement>("[data-service-slide]");
    const target = slides[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, []);

  const scrollByTile = useCallback(
    (dir: -1 | 1) => {
      scrollToIndex(Math.max(0, Math.min(tabs.length - 1, active + dir)));
    },
    [active, scrollToIndex, tabs.length],
  );

  return (
    <section
      className="mt-12"
      aria-roledescription="carousel"
      aria-label={t("carousel")}
    >
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((service) => (
          <article
            key={service.slug}
            data-service-slide
            className="group relative aspect-[5/3.4] w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[48%] lg:w-[32%]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${service.image})` }}
            />
            {/* Bottom-weighted fade — photo color reads through the top */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,24,0.12)_0%,rgba(10,16,24,0.28)_38%,rgba(10,16,24,0.78)_78%,rgba(10,16,24,0.92)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(212,160,23,0.14),transparent_42%)]" />

            <div className="relative flex h-full flex-col justify-end p-5 text-white md:p-6">
              <h2 className="text-[clamp(1.35rem,2.4vw,1.75rem)] font-light leading-[1.15] tracking-[-0.02em]">
                {zh ? service.titleZh : service.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm font-light leading-relaxed text-white/88 md:text-[0.95rem]">
                {zh ? service.summaryZh : service.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link
                  href={`/services/${service.slug}`}
                  className="btn-primary !px-4 !py-2.5 text-sm"
                >
                  {t("learnMore")}
                </Link>
                <Link
                  href="/quote"
                  className="btn-secondary !px-4 !py-2.5 text-sm"
                >
                  {tn("quote")}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div
          className="flex flex-1 items-center justify-center gap-2"
          role="tablist"
          aria-label={t("carousel")}
        >
          {tabs.map((service, i) => {
            const selected = i === active;
            return (
              <button
                key={service.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`${zh ? service.titleZh : service.title}`}
                onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  selected
                    ? "w-7 bg-[color:var(--navy)]"
                    : "w-2 bg-[color:var(--navy)]/25 hover:bg-[color:var(--navy)]/45"
                }`}
              />
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={t("prev")}
            disabled={!canPrev}
            onClick={() => scrollByTile(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[color:var(--navy)] transition disabled:cursor-not-allowed disabled:opacity-35 hover:border-[color:var(--gold)]"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label={t("next")}
            disabled={!canNext}
            onClick={() => scrollByTile(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--navy)] text-white transition disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[color:var(--navy-light)]"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={dir === "left" ? "rotate-180" : undefined}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
