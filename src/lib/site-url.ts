/** Canonical public site origin (no trailing slash). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://amginternationallogistics.com";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "https://amginternationallogistics.com";
    }
    return url.origin;
  } catch {
    return "https://amginternationallogistics.com";
  }
}
