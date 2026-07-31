import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function socialLinks() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || "256707469261";
  return [
    {
      key: "facebook",
      label: "Facebook",
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
      color: "#1877F2",
    },
    {
      key: "x",
      label: "X",
      href: process.env.NEXT_PUBLIC_X_URL || "",
      color: "#ffffff",
    },
    {
      key: "youtube",
      label: "YouTube",
      href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
      color: "#FF0000",
    },
    {
      key: "instagram",
      label: "Instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
      color: "#E4405F",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
      color: "#0A66C2",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/${wa}`,
      color: "#25D366",
    },
  ].filter((s) => Boolean(s.href));
}

function SocialIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };
  switch (name) {
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.2 22H3l7.3-8.4L1.5 2h6.4l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.5 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.6 4.8 6V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H10V9z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-1.4-.6-2.6-1.7-3.4-3.1-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4 0-.1 0-.3-.1-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 1.4.6 2 .6 2.7.5.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
        </svg>
      );
    default:
      return null;
  }
}

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tb = await getTranslations("brand");
  const links = socialLinks();

  return (
    <footer className="mt-24 bg-[color:var(--navy-deep)] text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
            Fast Link
          </div>
          <h3 className="mt-2 text-xl font-light">{tb("full")}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            {tb("tagline")}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            {t("offices")}
          </h4>
          <div className="mt-4 space-y-5 text-sm leading-relaxed text-white/85">
            <div>
              <div className="font-semibold text-[color:var(--gold-soft)]">
                {t("china")}
              </div>
              <p className="mt-1">
                Room 321, C3 building, Wanda Office Area, Baiyun District,
                Guangzhou, China
              </p>
              <p className="mt-1">LIN BING · +86 136 6053 4638</p>
            </div>
            <div>
              <div className="font-semibold text-[color:var(--gold-soft)]">
                {t("uganda")}
              </div>
              <p className="mt-1">Bweyogerere, Butto, Kampala, Uganda</p>
              <p className="mt-1">+256 707 469 261</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            {t("explore")}
          </h4>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/85">
            <Link href="/services" className="hover:text-white">
              {tn("services")}
            </Link>
            <Link href="/track" className="hover:text-white">
              {tn("track")}
            </Link>
            <Link href="/calculate" className="hover:text-white">
              {tn("calculate")}
            </Link>
            <Link href="/quote" className="hover:text-white">
              {tn("quote")}
            </Link>
            <Link href="/sourcing" className="hover:text-white">
              {tn("sourcing")}
            </Link>
            <Link href="/trade-financing" className="hover:text-white">
              {tn("tradeFinancing")}
            </Link>
            <Link href="/knowledge" className="hover:text-white">
              {tn("knowledge")}
            </Link>
            <Link href="/contact" className="hover:text-white">
              {tn("contact")}
            </Link>
          </div>
        </div>
      </div>

      {links.length > 0 ? (
        <div className="border-t border-white/10">
          <div className="container-site flex flex-col items-center gap-4 py-8">
            <h4 className="text-sm font-semibold tracking-wide text-white/80">
              {t("connectWithUs")}
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {links.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  style={{ color: s.color }}
                >
                  <SocialIcon name={s.key} />
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {tb("full")}. {t("rights")}
      </div>
    </footer>
  );
}
