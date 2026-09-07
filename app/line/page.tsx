import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code LINE ฟรี — ทำ QR Code LINE เพิ่มเพื่อน & LINE Official ง่ายๆ | QR Code Maker',
  description: 'สร้าง QR Code LINE ออนไลน์ฟรี สแกนแล้วเปิดแอป LINE เพิ่มเพื่อนทันที รองรับทั้ง LINE ID ส่วนบุคคล, LINE Official Account (LINE OA) และลิงก์กลุ่ม ไม่มีวันหมดอายุ ไม่มีลายน้ำ ปรับแต่งสีและใส่โลโก้ LINE ได้ทันที',
  keywords: [
    'สร้าง qr code line',
    'ทำ qr code line',
    'qr code line เพิ่มเพื่อน',
    'สร้าง qr code line official',
    'qr code line oa',
    'line qr code generator',
    'วิธีสร้าง qr code line',
    'ทำ qr code ฟรี',
    'สร้าง qr code ฟรี',
    'qr code line สแกนเพิ่มเพื่อน',
  ],
  alternates: {
    canonical: '/line',
  },
  openGraph: {
    title: 'สร้าง QR Code LINE ฟรี — ทำ QR Code LINE เพิ่มเพื่อน & LINE OA | QR Code Maker',
    description: 'สร้าง QR Code LINE สแกนแล้วเด้งเปิดแอป LINE แอดเพื่อนทันที ฟรี ไม่มีวันหมดอายุ คมชัด ไม่แตก',
    url: '/line',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code LINE ฟรี — QR Code Maker',
    }],
  },
};

export default function LinePage() {
  return <Home initialQrType="social" />;
}
