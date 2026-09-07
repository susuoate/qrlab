import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code ไม่มีลายน้ำ ฟรี — ไม่ติดโลโก้ ไม่จำกัดจำนวน คมชัด 100% | QR Code Maker',
  description: 'สร้าง QR Code ฟรี ไม่มีลายน้ำ (No Watermark QR Code Generator) ไม่มีโลโก้เว็บมาเกะกะ นำไปใช้งานเชิงพาณิชย์และพิมพ์ป้ายร้านค้าได้ทันที ปรับแต่งสี ใส่โลโก้ของคุณเองได้ ส่งออกไฟล์ SVG, PNG, JPEG คมชัดสูงสุด',
  keywords: [
    'สร้าง qr code ไม่มีลายน้ำ',
    'qr code ฟรี ไม่มีลายน้ำ',
    'ทำ qr code ไม่มีลายน้ำ',
    'qr code ไม่มีโลโก้',
    'สร้าง qr code ไม่ติดลายน้ำ',
    'free qr code no watermark',
    'qr code no watermark generator',
    'สร้าง qr code ฟรี',
    'ทำ qr code ฟรี',
    'qr code งานพิมพ์',
    'qr code คมชัด',
  ],
  alternates: {
    canonical: '/no-watermark',
  },
  openGraph: {
    title: 'สร้าง QR Code ไม่มีลายน้ำ ฟรี — ไม่ติดโลโก้ คมชัด 100% | QR Code Maker',
    description: 'สร้าง QR Code คุณภาพระดับมืออาชีพ ฟรี ไม่มีลายน้ำ ไม่มีโลโก้เว็บรบกวน ส่งออกเวกเตอร์ SVG สำหรับงานพิมพ์ได้ทันที',
    url: '/no-watermark',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code ฟรี ไม่มีลายน้ำ — QR Code Maker',
    }],
  },
};

export default function NoWatermarkPage() {
  return <Home initialQrType="url" />;
}
