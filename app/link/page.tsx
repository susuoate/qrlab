import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'แปลงลิงก์เป็น QR Code ฟรี — ทำ URL เป็น QR Code ง่ายนิดเดียว ไม่หมดอายุ | QR Code Maker',
  description: 'เครื่องมือแปลงลิงก์เป็น QR Code ออนไลน์ฟรี (URL to QR Code Generator) รองรับทุกลิงก์เว็บไซต์ โซเชียลมีเดีย Google Drive, TikTok, YouTube สแกนติดทันที คมชัดระดับเวกเตอร์ SVG ไม่มีลายน้ำ ปลอดภัย 100%',
  keywords: [
    'แปลงลิงก์เป็น qr code',
    'แปลง url เป็น qr code',
    'ทำ ลิงก์ เป็น qr code',
    'สร้าง qr code ลิงก์',
    'สร้าง qr code url',
    'url to qr code generator',
    'link to qr code',
    'ทำ qr code เว็บไซต์',
    'ทำ qr code ฟรี',
    'สร้าง qr code ฟรี',
  ],
  alternates: {
    canonical: '/link',
  },
  openGraph: {
    title: 'แปลงลิงก์เป็น QR Code ฟรี — ทำ URL เป็น QR Code ง่ายนิดเดียว | QR Code Maker',
    description: 'แปลงทุกลิงก์และ URL ให้กลายเป็น QR Code ความละเอียดสูง ฟรี ไม่มีวันหมดอายุ สแกนได้ทันที',
    url: '/link',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'แปลงลิงก์เป็น QR Code ฟรี — QR Code Maker',
    }],
  },
};

export default function LinkPage() {
  return <Home initialQrType="url" />;
}
