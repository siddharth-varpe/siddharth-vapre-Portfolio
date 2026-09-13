import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG, SITE_URL, generatePersonJsonLd, generateWebSiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { FirebaseAnalytics } from "@/components/analytics/firebase-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.title,
    template: "%s | Siddharth Varpe",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Siddharth Varpe",
    "Software Engineer",
    "AI & Full-Stack",
    "Next.js",
    "React",
    "TypeScript",
    "Cloud Firestore",
    "Firebase App Hosting",
    "Distributed Systems",
    "CRM Architecture",
    "Python",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_URL }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: "Siddharth Varpe — Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.defaultImage],
    creator: "@siddharthvarpe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = generatePersonJsonLd();
  const websiteSchema = generateWebSiteJsonLd();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <JsonLd data={websiteSchema} />
        <JsonLd data={personSchema} />
      </head>
      <body className="min-h-screen bg-[#09090b] font-sans text-[#fafafa] antialiased selection:bg-accent/25 selection:text-accent">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
