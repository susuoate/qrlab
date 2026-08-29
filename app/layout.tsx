import type { Metadata } from 'next';
import './globals.css';

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://qrlab-th.oateoate1.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: 'QR LAB — สร้าง QR Code จาก URL ฟรี',
  description: 'แปลง URL เป็น QR Code ฟรี ปรับสีและดาวน์โหลด PNG หรือ JPEG ความละเอียดสูงได้ทันที โดยไม่ต้องสมัครสมาชิก',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: '/',
    siteName: 'QR LAB',
    title: 'QR LAB — เปลี่ยนทุกลิงก์ให้พร้อมสแกน',
    description: 'สร้าง QR Code จาก URL ฟรี ปรับสีและดาวน์โหลดไฟล์คมชัดได้ทันที',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'QR LAB — เปลี่ยนทุกลิงก์ให้พร้อมสแกน',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR LAB — เปลี่ยนทุกลิงก์ให้พร้อมสแกน',
    description: 'สร้าง QR Code จาก URL ฟรี ปรับสีและดาวน์โหลดไฟล์คมชัดได้ทันที',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
