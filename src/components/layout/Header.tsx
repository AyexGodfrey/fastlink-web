"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { services } from "@/lib/content/services";

export function Header() {
  const t = useTranslations("nav");
  const tb = useTranslations("brand");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const otherLocale = locale === "en" ? "zh" : "en";
  const navItemClass =
    "rounded-sm px-2.5 py-1.5 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:var(--navy-deep)]/95 text-white backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link href="/" className="min-w-0 shrink-0">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
            Fast Link
          </div>
          <div className="truncate text-sm font-light tracking-wide md:text-base">
            {tb("full")}
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={`inline-flex items-center gap-1 font-medium ${navItemClass}`}
              onClick={() => setServicesOpen((v) => !v)}
            >
              {t("services")}
              <span className="text-[0.65rem]">▾</span>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full z-50 w-[min(52rem,90vw)] min-w-[40rem] border border-white/10 bg-[color:var(--navy)] py-3 shadow-2xl">
                <Link
                  href="/services"
                  className="block px-4 py-2 text-sm font-semibold text-[color:var(--gold-soft)] hover:bg-white/10"
                  onClick={() => setServicesOpen(false)}
                >
                  {t("services")} →
                </Link>
                <div className="mt-1 grid grid-cols-3 gap-x-2 px-2 pb-1">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="block rounded-sm px-2 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                      onClick={() => setServicesOpen(false)}
                    >
                      {locale === "zh" ? s.titleZh : s.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/industries" className={navItemClass}>
            {t("industries")}
          </Link>
          <Link href="/trade-financing" className={navItemClass}>
            {t("tradeFinancing")}
          </Link>
          <Link href="/knowledge" className={navItemClass}>
            {t("knowledge")}
          </Link>
          <Link href="/calculate" className={navItemClass}>
            {t("calculate")}
          </Link>
          <Link href="/track" className={navItemClass}>
            {t("track")}
          </Link>
          <Link href="/contact" className={navItemClass}>
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={otherLocale}
            className="hidden rounded-none border border-white/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 hover:border-white sm:inline"
          >
            {otherLocale === "zh" ? "中文" : "EN"}
          </Link>
          <Link
            href="/quote"
            className="hidden bg-[color:var(--gold)] px-3 py-2 text-xs font-bold text-[color:var(--navy-deep)] hover:bg-[color:var(--gold-soft)] md:inline-flex"
          >
            {t("quote")}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/20 lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[color:var(--navy-deep)] lg:hidden">
          <div className="container-site flex flex-col gap-1 py-4">
            <Link href="/services" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("services")}
            </Link>
            {services.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                onClick={() => setOpen(false)}
                className="py-1.5 pl-3 text-sm text-white/70"
              >
                {locale === "zh" ? s.titleZh : s.title}
              </Link>
            ))}
            <Link href="/industries" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("industries")}
            </Link>
            <Link href="/trade-financing" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("tradeFinancing")}
            </Link>
            <Link href="/knowledge" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("knowledge")}
            </Link>
            <Link href="/calculate" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("calculate")}
            </Link>
            <Link href="/track" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("track")}
            </Link>
            <Link href="/sourcing" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("sourcing")}
            </Link>
            <Link href="/quote" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("quote")}
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="py-2 text-sm">
              {t("contact")}
            </Link>
            <Link
              href={pathname}
              locale={otherLocale}
              onClick={() => setOpen(false)}
              className="mt-2 py-2 text-sm font-semibold text-[color:var(--gold-soft)]"
            >
              {otherLocale === "zh" ? "切换到中文" : "Switch to English"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
