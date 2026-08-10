import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

const SITELINKS = [
  {
    key: "track",
    href: "/track",
  },
  {
    key: "quote",
    href: "/quote",
  },
  {
    key: "calculate",
    href: "/calculate",
  },
  {
    key: "contact",
    href: "/contact",
  },
] as const;

export async function HomeSitelinks() {
  const t = await getTranslations("home.sitelinks");

  return (
    <section className="border-y border-[color:var(--line)] bg-white">
      <div className="container-site py-10 md:py-12">
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            {t("title")}
          </h2>
        </Reveal>
        <ul className="mt-4 divide-y divide-[color:var(--line)]">
          {SITELINKS.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="group flex items-start justify-between gap-4 py-4 transition-colors hover:bg-[color:var(--surface)]/80"
              >
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-[color:var(--navy)] group-hover:text-[color:var(--navy-light)]">
                    {t(`${item.key}.label`)}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-[color:var(--muted)]">
                    {t(`${item.key}.description`)}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-[color:var(--muted)] transition-transform group-hover:translate-x-0.5"
                >
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
