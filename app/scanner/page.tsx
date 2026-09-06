import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สแกน QR Code ออนไลน์ ฟรี — อ่านข้อมูลผ่านกล้องและอัปโหลดรูปภาพ ไม่ต้องลงแอป | QR lab',
  description: 'เครื่องมือสแกน QR Code ออนไลน์ฟรีในเบราว์เซอร์ ใช้งานได้ทันทีทั้งบนคอมพิวเตอร์และมือถือ รองรับการเปิดกล้องสดและอัปโหลดไฟล์รูปภาพ ถอดรหัส URL, พร้อมเพย์, Wi-Fi รวดเร็ว ปลอดภัย',
  keywords: [
    'สแกน qr code',
    'สแกน qr code ออนไลน์',
    'อ่าน qr code ออนไลน์',
    'qr code scanner online',
    'สแกน qr code ผ่านเว็บ',
    'ถอดรหัส qr code',
    'สแกน qr code ฟรี',
  ],
  alternates: {
    canonical: '/scanner',
  },
  openGraph: {
    title: 'สแกน QR Code ออนไลน์ ฟรี — อ่านข้อมูลผ่านกล้องและอัปโหลดรูปภาพ',
    description: 'สแกน QR Code ผ่านเว็บได้ทันที ถอดรหัสผ่านกล้องสดหรือรูปภาพ ปลอดภัย 100%',
    url: '/scanner',
  },
};

export default function ScannerPage() {
  return <Home initialScannerOpen={true} />;
}
