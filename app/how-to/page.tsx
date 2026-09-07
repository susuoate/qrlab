import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'วิธีทำ QR Code ฟรี ในโทรศัพท์และคอมพิวเตอร์ (3 ขั้นตอนง่ายๆ) | QR Code Maker',
  description: 'คู่มือและวิธีทำ QR Code ฟรีอย่างละเอียด ทำได้ทั้งบนมือถือ iPhone, Android และคอมพิวเตอร์ เพียง 3 ขั้นตอน: เลือกประเภท กรอกข้อมูล และดาวน์โหลดไฟล์ SVG คมชัด ไม่แตก ไม่มีลายน้ำ ใช้งานได้ตลอดชีพ',
  keywords: [
    'วิธีทำ qr code',
    'วิธีสร้าง qr code',
    'วิธีทำ qr code ในโทรศัพท์',
    'สอนทำ qr code',
    'ทำ qr code ยังไง',
    'วิธีทำ qr code ฟรี',
    'ขั้นตอนการทำ qr code',
    'ทำ qr code ในคอม',
    'วิธีทำ qr code พร้อมเพย์',
    'วิธีทำ qr code wifi',
  ],
  alternates: {
    canonical: '/how-to',
  },
  openGraph: {
    title: 'วิธีทำ QR Code ฟรี ในโทรศัพท์และคอมพิวเตอร์ (3 ขั้นตอนง่ายๆ) | QR Code Maker',
    description: 'สอนวิธีทำ QR Code ฟรีด้วยตัวเองง่ายๆ ไม่ต้องลงโปรแกรม ทำเสร็จใน 10 วินาที คมชัดระดับโปร',
    url: '/how-to',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'วิธีทำ QR Code ฟรี — QR Code Maker',
    }],
  },
};

export default function HowToPage() {
  return <Home initialQrType="url" />;
}
