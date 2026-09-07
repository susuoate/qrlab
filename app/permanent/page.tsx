import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code ไม่มีวันหมดอายุ ฟรี — QR Code ถาวร ไม่จำกัดจำนวนครั้ง | QR Code Maker',
  description: 'สร้าง QR Code ไม่มีวันหมดอายุ (Permanent QR Code) ใช้งานได้ตลอดชีพ 100% ฟรี ไม่มีค่าบริการรายเดือน ไม่ล็อกรหัส ไม่บังคับสมัครสมาชิก แปลงทุกลิงก์ พร้อมเพย์ และ Wi-Fi เป็น Static QR Code ที่ไม่มีวันดับ คมชัดระดับเวกเตอร์ SVG',
  keywords: [
    'สร้าง qr code ไม่มีหมดอายุ',
    'qr code ไม่มีวันหมดอายุ',
    'qr code ถาวร',
    'ทำ qr code ถาวร',
    'สร้าง qr code ตลอดชีพ',
    'static qr code generator',
    'qr code no expiration',
    'permanent qr code generator',
    'ทำ qr code ฟรี',
    'สร้าง qr code ฟรี',
    'qr code ไม่หมดอายุ',
    'qr code ไม่จำกัดเวลา',
  ],
  alternates: {
    canonical: '/permanent',
  },
  openGraph: {
    title: 'สร้าง QR Code ไม่มีวันหมดอายุ ฟรี — QR Code ถาวร ไม่จำกัดจำนวนครั้ง | QR Code Maker',
    description: 'สร้าง Static QR Code ถาวร ไม่มีวันหมดอายุ ใช้งานได้ตลอดชีพ ฟรี 100% ไม่ต้องกลัว QR Code ดับหรือโดนล็อก',
    url: '/permanent',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code ไม่มีวันหมดอายุ ฟรี — QR Code Maker',
    }],
  },
};

export default function PermanentPage() {
  return <Home initialQrType="url" />;
}
