import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AMG International Logistics",
    template: "%s | AMG",
  },
  description:
    "Procurement, sourcing, freight forwarding, customs clearance, and door-to-door logistics connecting Africa and global markets.",
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
