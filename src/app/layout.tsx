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
    default: "AMG International Logistics",
    template: "%s | AMG",
  },
  description:
    "Procurement, sourcing, freight forwarding, customs clearance, and door-to-door logistics connecting Africa and global markets.",
  applicationName: "AMG",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "AMG",
    title: "AMG International Logistics",
    description:
      "Procurement, sourcing, freight forwarding, customs clearance, and door-to-door logistics connecting Africa and global markets.",
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
