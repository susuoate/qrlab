import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code Wi-Fi ฟรี — สแกนเชื่อมต่ออินเทอร์เน็ตอัตโนมัติ ไม่ต้องพิมพ์รหัส | QR lab',
  description: 'เครื่องมือสร้าง QR Code Wi-Fi ฟรี สำหรับร้านค้า คาเฟ่ โรงแรม และบ้าน สแกนด้วยกล้องมือถือต่อเน็ตอัตโนมัติทันที ไม่ต้องบอกรหัสผ่าน รองรับ WPA/WPA2/WPA3 ไม่มีวันหมดอายุ',
  keywords: [
    'สร้าง qr code wifi',
    'qr code wifi',
    'qr code wifi ฟรี',
    'wifi qr code generator',
    'ต่อ wifi ด้วย qr code',
    'แชร์ wifi ด้วย qr code',
    'สร้าง qr code ฟรี',
  ],
  alternates: {
    canonical: '/wifi',
  },
  openGraph: {
    title: 'สร้าง QR Code Wi-Fi ฟรี — สแกนต่อเน็ตอัตโนมัติ ไม่ต้องพิมพ์รหัส',
    description: 'แชร์ Wi-Fi ให้ลูกค้าและเพื่อนง่ายๆ สแกนแล้วต่อเน็ตทันที ปลอดภัย 100%',
    url: '/wifi',
  },
};

export default function WifiPage() {
  return <Home initialQrType="wifi" />;
}
