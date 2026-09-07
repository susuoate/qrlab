import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code Google Maps ฟรี — ทำ QR Code แผนที่ ปักหมุดบอกทาง ไม่หมดอายุ | QR Code Maker',
  description: 'สร้าง QR Code Google Maps และแผนที่ออนไลน์ฟรี สแกนแล้วเปิดแอป Google Maps นำทางทันที เหมาะสำหรับร้านค้า งานแต่งงาน งานสัมมนา และป้ายบอกทางหน้าร้าน คมชัดระดับเวกเตอร์ SVG ไม่มีวันหมดอายุ',
  keywords: [
    'สร้าง qr code google maps',
    'qr code แผนที่',
    'ทำ qr code google map',
    'qr code ปักหมุด',
    'ทำ qr code บอกทาง',
    'google maps qr code generator',
    'สร้าง qr code พิกัด',
    'qr code โลเคชั่น',
    'ทำ qr code ฟรี',
    'สร้าง qr code ฟรี',
  ],
  alternates: {
    canonical: '/google-maps',
  },
  openGraph: {
    title: 'สร้าง QR Code Google Maps ฟรี — ทำ QR Code แผนที่ ปักหมุดบอกทาง | QR Code Maker',
    description: 'แปลงทุกลิงก์ Google Maps และพิกัด GPS เป็น QR Code สแกนแล้วนำทางทันที ฟรี ไม่มีวันหมดอายุ',
    url: '/google-maps',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code Google Maps ฟรี — QR Code Maker',
    }],
  },
};

export default function GoogleMapsPage() {
  return <Home initialQrType="maps" />;
}
