import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code งานแต่งงาน ฟรี — พร้อมเพย์รับซองอวยพร ป้ายหน้างานเรียบหรู | QR lab',
  description: 'สร้าง QR Code พร้อมเพย์สำหรับงานแต่งงาน งานบวช และงานบุญออนไลน์ฟรี แขกสแกนโอนเงินอวยพรได้สะดวกทุกธนาคาร ไม่มีค่าธรรมเนียม พร้อมพิมพ์ป้ายตั้งโต๊ะหน้างานสวยหรู ไม่มีวันหมดอายุ ปลอดภัย 100%',
  keywords: [
    'qr code งานแต่ง',
    'สร้าง qr code งานแต่ง',
    'qr code ซองงานแต่ง',
    'ทำ qr code รับซอง',
    'พร้อมเพย์งานแต่ง',
    'ป้าย qr code งานแต่ง',
    'สร้าง qr code พร้อมเพย์',
    'ทำ qr code ฟรี',
    'wedding qr code generator',
  ],
  alternates: {
    canonical: '/wedding',
  },
  openGraph: {
    title: 'สร้าง QR Code งานแต่งงาน ฟรี — พร้อมเพย์รับซองอวยพร ป้ายหน้างานเรียบหรู | QR lab',
    description: 'สร้าง QR Code พร้อมเพย์รับซองงานแต่งงาน สแกนจ่ายได้ทุกแอปธนาคาร พร้อมพิมพ์ป้ายสวยหรู ฟรี 100%',
    url: '/wedding',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code งานแต่งงาน ฟรี — QR lab',
    }],
  },
};

export default function WeddingPage() {
  return <Home initialQrType="promptpay" initialStandTemplate="promptpay" />;
}
