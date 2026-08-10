import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Keep sitemap/robots out of locale middleware or metadata routes can 500.
  matcher: [
    "/",
    "/(en|zh)/:path*",
    "/((?!api|_next|_vercel|sitemap\\.xml|robots\\.txt|.*\\..*).*)",
  ],
};
