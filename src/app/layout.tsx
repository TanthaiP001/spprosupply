import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Analytics } from "@vercel/analytics/next";
import WebsiteStructuredData from "@/components/WebsiteStructuredData";
import OrganizationStructuredData from "@/components/OrganizationStructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spprosupply.com';
const siteName = 'SP Pro Supply';
const siteDescription = 'สินค้าสร้างสรรค์ นวัตกรรมสุขภาพ - เอส พี โปร ซัพพลาย ร้านค้าออนไลน์คุณภาพ';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - สินค้าสร้างสรรค์ นวัตกรรมสุขภาพ`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'SP Pro Supply',
    'สินค้าสร้างสรรค์',
    'นวัตกรรมสุขภาพ',
    'ร้านค้าออนไลน์',
    'e-commerce',
    'ซื้อของออนไลน์',
    'สินค้าคุณภาพ',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - สินค้าสร้างสรรค์ นวัตกรรมสุขภาพ`,
    description: siteDescription,
    images: [
      {
        url: '/logo/logo.png',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - สินค้าสร้างสรรค์ นวัตกรรมสุขภาพ`,
    description: siteDescription,
    images: ['/logo/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+Thai:wght@100..900&family=Outfit&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${notoSansThai.variable} ${outfit.variable} antialiased`}
        style={{
          fontFamily: '"Inter", "Noto Sans Thai", "Outfit", sans-serif',
        }}
      >
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
