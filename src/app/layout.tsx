import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers/query-provider";
import { Navbar } from "@/components/molecules/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhammad Tahir — Data Analyst & Business Analyst",
  description:
    "Portfolio of Muhammad Tahir — An Information Systems graduate experienced in data analysis, SQL-based data validation, and business analysis, committed to data integrity and accurate insights for business decision-making.",
  keywords: [
    "Muhammad Tahir",
    "Data Analyst",
    "Business Analyst",
    "SQL",
    "Data Analytics",
    "Information Systems",
    "Portfolio",
    "Jakarta",
    "Indonesia",
  ],
  authors: [{ name: "Muhammad Tahir" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    title: "Muhammad Tahir — Data Analyst & Business Analyst",
    description:
      "Turning structured data into accurate insights that support business decision-making.",
    siteName: "Muhammad Tahir Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Tahir — Data Analyst & Business Analyst",
    description:
      "Turning structured data into accurate insights that support business decision-making.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
