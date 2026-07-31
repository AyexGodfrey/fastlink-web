"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { knowledgeArticles } from "@/lib/content/knowledge";

export function KnowledgeSearch() {
  const t = useTranslations("knowledge");
  const locale = useLocale();
  const zh = locale === "zh";
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return knowledgeArticles;
    return knowledgeArticles.filter((a) => {
      const hay = [
        a.title,
        a.titleZh,
        a.excerpt,
        a.excerptZh,
        a.category,
        a.body,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q]);

  return (
    <div>
      <input
        className="field max-w-xl"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search")}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {results.map((a) => (
          <Link
            key={a.slug}
            href={`/knowledge/${a.slug}`}
            className="block border border-[color:var(--line)] bg-white p-6 transition-shadow hover:shadow-[0_12px_40px_rgba(15,45,74,0.08)]"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--gold)]">
              {a.category}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-[color:var(--navy)]">
              {zh ? a.titleZh : a.title}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {zh ? a.excerptZh : a.excerpt}
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-[color:var(--navy-light)]">
              {t("readMore")} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
