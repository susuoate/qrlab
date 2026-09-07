import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code เมนูอาหาร ฟรี — ทำ QR Code ดูเมนู ติดโต๊ะร้านอาหาร ไม่หมดอายุ | QR Code Maker',
  description: 'สร้าง QR Code เมนูอาหารออนไลน์ฟรี สำหรับร้านอาหาร คาเฟ่ ผับบาร์ ลูกค้าสแกนดูเมนู PDF หรือเปิดหน้าสั่งอาหารได้ทันที พร้อมระบบพิมพ์ป้ายตั้งโต๊ะ A4/A5 ไม่มีวันหมดอายุ คมชัด ไม่แตก ปลอดภัย 100%',
  keywords: [
    'สร้าง qr code เมนูอาหาร',
    'qr code เมนูอาหาร',
    'ทำ qr code เมนู',
    'qr code ร้านอาหาร',
    'เมนู qr code ฟรี',
    'ทำ qr code ดูเมนู',
    'qr code ติดโต๊ะอาหาร',
    'ทำ qr code ฟรี',
    'สร้าง qr code ฟรี',
    'menu qr code generator',
  ],
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: 'สร้าง QR Code เมนูอาหาร ฟรี — ทำ QR Code ดูเมนู ติดโต๊ะร้านอาหาร | QR Code Maker',
    description: 'เครื่องมือทำ QR Code เมนูอาหาร พร้อมพิมพ์ป้ายตั้งโต๊ะฟรี ไม่มีวันหมดอายุ สำหรับร้านอาหารและคาเฟ่',
    url: '/menu',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code เมนูอาหาร ฟรี — QR Code Maker',
    }],
  },
};

export default function MenuPage() {
  return <Home initialQrType="url" initialStandTemplate="menu" />;
}
