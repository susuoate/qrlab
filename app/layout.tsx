import type { Metadata, Viewport } from 'next';
import './globals.css';

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://qrlab-th.oateoate1.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  applicationName: 'QR lab QR CODE generator',
  title: 'ทำ QR Code ฟรี — สร้าง QR Code ง่ายนิดเดียว ไม่มีวันหมดอายุ | QR lab',
  description: 'ทำ QR Code และสร้าง QR Code ฟรี ง่ายนิดเดียว ไม่มีวันหมดอายุ ไม่มีลายน้ำ รองรับพร้อมเพย์ (PromptPay), Wi-Fi, นามบัตรดิจิทัล vCard, ลิงก์ และเบอร์โทร คมชัดระดับเวกเตอร์ SVG ไม่แตก ปลอดภัย 100%',
  keywords: [
    'ทำ qr code',
    'ทำ qr code ฟรี',
    'วิธีทำ qr code',
    'วิธีสร้าง qr code',
    'ทำ qr code ง่ายๆ',
    'สร้าง qr code',
    'สร้าง qr code ฟรี',
    'ทํา qr code',
    'ทํา qr code ฟรี',
    'QR CODE Maker',
    'QR Code Generator',
    'สร้าง Qr code ง่ายนิดเดียว',
    'qr code maker',
    'qr code generator',
    'คิวอาร์โค้ด',
    'คิวอาร์โค้ดฟรี',
    'ทำคิวอาร์โค้ด',
    'สร้างคิวอาร์โค้ด',
    'สร้าง qr code พร้อมเพย์',
    'qr code พร้อมเพย์',
    'ทำ qr code พร้อมเพย์',
    'promptpay qr code generator',
    'qr code พร้อมเพย์ ไม่มีหมดอายุ',
    'สร้าง qr code wifi',
    'qr code wifi',
    'qr code wifi ฟรี',
    'wifi qr code generator',
    'สร้าง qr code ไม่มีหมดอายุ',
    'qr code ไม่มีวันหมดอายุ',
    'qr code ไม่มีลายน้ำ',
    'สร้าง qr code ไม่มีลายน้ำ',
    'static qr code generator',
    'qr code no expiration',
    'free qr code no watermark',
    'qr code svg',
    'สร้าง qr code svg',
    'vector qr code svg',
    'qr code งานพิมพ์',
    'qr code ไม่แตก',
    'สร้าง qr code ใส่โลโก้',
    'qr code with logo',
    'สร้าง qr code นามบัตร',
    'qr code นามบัตร',
    'vcard qr code generator',
    'สร้าง qr code เบอร์โทร',
    'สร้าง qr code ลิงก์',
    'แปลงลิงก์เป็น qr code',
    'url to qr code',
    'สร้าง qr code โซเชียล',
    'สร้าง qr code line',
    'สแกน qr code',
    'สแกน qr code ออนไลน์',
    'อ่าน qr code ออนไลน์',
    'qr code scanner online',
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
    title: 'ทำ QR Code ฟรี — สร้าง QR Code ง่ายนิดเดียว ไม่มีวันหมดอายุ | QR lab',
    description: 'ทำ QR Code และสร้าง QR Code ฟรี ระดับมืออาชีพ แปลงทุกลิงก์ พร้อมเพย์ และ Wi-Fi ให้เป็น QR Code ความละเอียดสูง คมชัด ปรับแต่งสีและโลโก้ได้ทันที 100% ฟรี',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'ทำ QR Code ฟรี — สร้าง QR Code ง่ายนิดเดียว',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ทำ QR Code ฟรี — สร้าง QR Code ง่ายนิดเดียว ไม่มีวันหมดอายุ',
    description: 'ทำ QR Code และสร้าง QR Code ฟรี รองรับพร้อมเพย์, Wi-Fi, นามบัตร และ URL คมชัดระดับเวกเตอร์ SVG ไม่แตก ปลอดภัย 100%',
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
        'ทำ QR Code',
        'ทำ QR Code ฟรี',
        'วิธีทำ QR Code',
        'สร้าง QR Code',
        'สร้าง QR Code ฟรี',
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
      description: 'ทำ QR Code และสร้าง QR Code ฟรี — QR Code Generator และ QR CODE Maker ระดับโปร ง่ายนิดเดียว ไม่มีวันหมดอายุ รองรับ PromptPay พร้อมเพย์, Wi-Fi, vCard, โซเชียล และส่งออกเวกเตอร์ SVG',
    },
    {
      '@type': 'WebSite',
      '@id': `${productionUrl}/#website`,
      url: productionUrl,
      name: 'QR lab QR CODE generator',
      alternateName: [
        'ทำ QR Code',
        'ทำ QR Code ฟรี',
        'วิธีทำ QR Code',
        'สร้าง QR Code',
        'สร้าง QR Code ฟรี',
        'QR Code Generator',
        'QR CODE Maker',
        'สร้าง Qr code ง่ายนิดเดียว',
      ],
      description: 'ทำ QR Code ฟรี & QR Code Generator — สร้าง QR Code ง่ายนิดเดียว ไม่มีลายน้ำ ปรับแต่งสีและโลโก้ได้ตามต้องการ',
    },
    {
      '@type': 'HowTo',
      '@id': `${productionUrl}/#howto`,
      name: 'วิธีทำ QR Code ฟรี ใน 3 ขั้นตอน',
      description: 'วิธีทำ QR Code และสร้าง QR Code ฟรี ง่ายนิดเดียว รองรับทั้งลิงก์ พร้อมเพย์ Wi-Fi และนามบัตร โดยไม่ต้องลงโปรแกรม',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'เลือกประเภทและใส่ข้อมูล',
          text: 'เลือกประเภท QR Code ที่ต้องการ เช่น เว็บไซต์ (URL), พร้อมเพย์, Wi-Fi หรือ นามบัตร แล้วกรอกข้อมูล',
          url: `${productionUrl}/#generator`,
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'ปรับแต่งสไตล์และสี',
          text: 'เลือกสี โครงสร้าง หรือใส่โลโก้ตรงกลางตามต้องการ แสดงตัวอย่างทันที',
          url: `${productionUrl}/#generator`,
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'ดาวน์โหลด QR Code ฟรี',
          text: 'กดปุ่มดาวน์โหลดไฟล์ SVG คมชัดไม่แตกสำหรับงานพิมพ์ หรือไฟล์ PNG/JPEG นำไปใช้งานได้ทันที ไม่มีวันหมดอายุ',
          url: `${productionUrl}/#generator`,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${productionUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'สร้าง QR Code ฟรีจริงไหม มีลายน้ำหรือไม่?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ฟรี 100% ไม่มีลายน้ำ และไม่จำกัดจำนวนครั้ง ดาวน์โหลดไฟล์ PNG, JPEG และเวกเตอร์ SVG ไปใช้งานเชิงพาณิชย์ได้ทันที',
          },
        },
        {
          '@type': 'Question',
          name: 'สร้าง QR Code พร้อมเพย์ (PromptPay) อย่างไร สแกนจ่ายได้ทุกธนาคารไหม?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ได้ 100% ตามมาตรฐาน EMVCo ของธนาคารแห่งประเทศไทย สแกนจ่ายเงินได้ทุกแอปธนาคารไทย ทั้งเบอร์มือถือและเลขประจำตัวประชาชน ปลอดภัย ไม่ส่งข้อมูลไปเซิร์ฟเวอร์ภายนอก',
          },
        },
        {
          '@type': 'Question',
          name: 'สร้าง QR Code Wi-Fi ให้ลูกค้าสแกนต่อเน็ตอัตโนมัติทำอย่างไร?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'เลือกแท็บ Wi-Fi กรอกชื่อเครือข่ายและรหัสผ่าน จากนั้นดาวน์โหลด QR Code ไปติดหน้าร้าน ลูกค้าสามารถใช้กล้องสแกนเพื่อเชื่อมต่ออินเทอร์เน็ตได้ทันทีโดยไม่ต้องพิมพ์รหัสผ่าน',
          },
        },
        {
          '@type': 'Question',
          name: 'QR Code มีวันหมดอายุหรือไม่ (Static QR Code)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ไม่มีวันหมดอายุ เป็น Static QR Code ที่เก็บข้อมูลไว้ในตัวโค้ดโดยตรง ใช้งานได้ตลอดชีพ ไม่มีค่าบริการรายเดือน',
          },
        },
        {
          '@type': 'Question',
          name: 'ทำไมควรดาวน์โหลดเป็นไฟล์ SVG สำหรับงานพิมพ์และป้ายร้านค้า?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ไฟล์เวกเตอร์ SVG ขยายขนาดได้ไม่จำกัดโดยภาพไม่แตก เหมาะอย่างยิ่งสำหรับส่งให้โรงพิมพ์ทำป้ายไวนิล ป้ายตั้งโต๊ะ นามบัตร หรือสติกเกอร์ติดหน้าร้าน',
          },
        },
        {
          '@type': 'Question',
          name: 'สามารถสแกน QR Code ออนไลน์ผ่านหน้าเว็บได้หรือไม่?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ได้ทันที มีสแกนเนอร์ในตัว รองรับทั้งการเปิดกล้องสแกนสดและอัปโหลดรูปภาพจากอุปกรณ์เพื่ออ่านและถอดรหัส QR Code ได้ฟรี',
          },
        },
      ],
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
