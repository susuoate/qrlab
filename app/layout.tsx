import type { Metadata, Viewport } from 'next';
import './globals.css';

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://qrlab-th.oateoate1.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  applicationName: 'QR lab QR CODE generator',
  title: 'QR Code Generator & QR CODE Maker — สร้าง Qr code ง่ายนิดเดียว ฟรี ไม่มีวันหมดอายุ | QR lab',
  description: 'QR CODE Maker และ QR Code Generator ออนไลน์ที่ดีที่สุด — สร้าง Qr code ง่ายนิดเดียว ฟรี ไม่มีวันหมดอายุ คมชัดทั้ง PNG และเวกเตอร์ SVG ไม่แตก รองรับพร้อมเพย์ (PromptPay), Wi-Fi, vCard นามบัตร, โซเชียล ปลอดภัย 100% ไม่เก็บข้อมูล',
  keywords: [
    'QR CODE Maker',
    'QR Code Generator',
    'สร้าง Qr code ง่ายนิดเดียว',
    'qr code maker',
    'qr code generator',
    'สร้าง qr code',
    'qr code ฟรี',
    'qr code พร้อมเพย์',
    'สร้าง qr code wifi',
    'สร้าง qr code ไม่มีหมดอายุ',
    'qr code ไม่มีลายน้ำ',
    'qr code svg',
    'สแกน qr code',
    'promptpay qr code generator',
    'free qr code maker',
  ],
  authors: [{ name: 'PlatoisPlutonian' }],
  creator: 'PlatoisPlutonian',
  publisher: 'QR lab QR CODE generator',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QR lab QR CODE generator',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: '/',
    siteName: 'QR lab QR CODE generator',
    title: 'QR Code Generator & QR CODE Maker — สร้าง Qr code ง่ายนิดเดียว ฟรี ไม่มีวันหมดอายุ',
    description: 'QR Code Generator & QR CODE Maker ระดับโปร — สร้าง Qr code ง่ายนิดเดียว แปลงทุกลิงก์ พร้อมเพย์ และ Wi-Fi ให้เป็น QR Code ความละเอียดสูง คมชัด ปรับแต่งสีและโลโก้ได้ทันที 100% ฟรี',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'QR Code Generator & QR CODE Maker — สร้าง Qr code ง่ายนิดเดียว',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator & QR CODE Maker — สร้าง Qr code ง่ายนิดเดียว',
    description: 'QR CODE Maker และ QR Code Generator สร้าง Qr code ง่ายนิดเดียว รองรับพร้อมเพย์, Wi-Fi, นามบัตร และ URL ฟรี คมชัดระดับเวกเตอร์ SVG ไม่แตก',
    images: ['/og.png'],
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
    google: 'google00330e34bbc9ec84',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c79d8',
  colorScheme: 'light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${productionUrl}/#webapp`,
      name: 'QR lab QR CODE generator',
      alternateName: [
        'QR Code Generator',
        'QR CODE Maker',
        'สร้าง Qr code ง่ายนิดเดียว',
      ],
      url: productionUrl,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'THB',
      },
      description: 'QR Code Generator และ QR CODE Maker ระดับโปร — สร้าง Qr code ง่ายนิดเดียว ฟรี ไม่มีวันหมดอายุ รองรับ PromptPay พร้อมเพย์, Wi-Fi, vCard, โซเชียล และส่งออกเวกเตอร์ SVG',
    },
    {
      '@type': 'WebSite',
      '@id': `${productionUrl}/#website`,
      url: productionUrl,
      name: 'QR lab QR CODE generator',
      alternateName: [
        'QR Code Generator',
        'QR CODE Maker',
        'สร้าง Qr code ง่ายนิดเดียว',
      ],
      description: 'QR Code Generator & QR CODE Maker — สร้าง Qr code ง่ายนิดเดียว ฟรี ไม่มีลายน้ำ ปรับแต่งสีและโลโก้ได้ตามต้องการ',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* Google AdSense Script for Revenue Generation */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9961728700267165"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
