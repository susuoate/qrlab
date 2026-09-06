import type { Metadata, Viewport } from 'next';
import './globals.css';

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://qrlab-th.oateoate1.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  applicationName: 'QR LAB',
  title: 'QR LAB — สร้าง QR Code ฟรี ไม่มีวันหมดอายุ | พร้อมเพย์, Wi-Fi, นามบัตร, ลิงก์',
  description: 'สร้าง QR Code ออนไลน์ฟรี ระดับมืออาชีพ คมชัดทั้ง PNG, JPEG และเวกเตอร์ SVG ไม่แตก รองรับพร้อมเพย์ (PromptPay), Wi-Fi, vCard นามบัตร, โซเชียล และเบอร์โทร ปลอดภัย 100% ประมวลผลบนเครื่องของคุณ ไม่เก็บข้อมูล',
  keywords: [
    'สร้าง qr code',
    'qr code ฟรี',
    'qr code พร้อมเพย์',
    'สร้าง qr code wifi',
    'สร้าง qr code ไม่มีหมดอายุ',
    'qr code ไม่มีลายน้ำ',
    'qr code svg',
    'สแกน qr code',
    'qr code generator',
    'promptpay qr code generator',
    'free qr code maker',
  ],
  authors: [{ name: 'PlatoisPlutonian' }],
  creator: 'PlatoisPlutonian',
  publisher: 'QR LAB',
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
    title: 'QR LAB',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: '/',
    siteName: 'QR LAB',
    title: 'QR LAB — สร้าง QR Code ฟรี ไม่มีวันหมดอายุ (พร้อมเพย์, Wi-Fi, นามบัตร)',
    description: 'แปลงทุกลิงก์ พร้อมเพย์ และ Wi-Fi ให้เป็น QR Code ความละเอียดสูง คมชัด ปรับแต่งสีและโลโก้ได้ทันที 100% ฟรี',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'QR LAB — สร้าง QR Code ฟรี ไม่มีวันหมดอายุ',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR LAB — สร้าง QR Code ฟรี ไม่มีวันหมดอายุ',
    description: 'สร้าง QR Code พร้อมเพย์, Wi-Fi, นามบัตร และ URL ฟรี คมชัดระดับเวกเตอร์ SVG ไม่แตก',
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
      name: 'QR LAB',
      url: productionUrl,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'THB',
      },
      description: 'เครื่องมือสร้าง QR Code ออนไลน์ฟรี ไม่มีวันหมดอายุ รองรับ PromptPay พร้อมเพย์, Wi-Fi, vCard, โซเชียล และส่งออกเวกเตอร์ SVG',
    },
    {
      '@type': 'WebSite',
      '@id': `${productionUrl}/#website`,
      url: productionUrl,
      name: 'QR LAB',
      description: 'สร้าง QR Code ฟรี ไม่มีลายน้ำ ปรับแต่งสีและโลโก้ได้ตามต้องการ',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
