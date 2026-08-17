import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "AMG International Logistics | China–Uganda Freight, Kampala & Guangzhou",
    template: "%s | AMG International Logistics",
  },
  description:
    "China-to-Uganda sourcing, freight forwarding, and customs clearance. Offices in Guangzhou, China and Kampala, Uganda.",
  applicationName: "AMG International Logistics",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "AMG International Logistics",
    title:
      "AMG International Logistics | China–Uganda Freight, Kampala & Guangzhou",
    description:
      "China-to-Uganda sourcing, freight forwarding, and customs clearance. Offices in Guangzhou, China and Kampala, Uganda.",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lato.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
