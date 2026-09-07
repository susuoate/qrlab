import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code ไฟล์ PDF ฟรี — แปลงลิงก์ Google Drive & เอกสาร ดูได้ทันที ไม่หมดอายุ | QR Code Maker',
  description: 'สร้าง QR Code สำหรับไฟล์ PDF, Google Drive และเอกสารออนไลน์ฟรี สแกนแล้วเปิดอ่านไฟล์ PDF ได้ทันที ไม่ต้องสมัครสมาชิก เหมาะสำหรับเมนูอาหาร โบรชัวร์ เอกสารอบรม และสื่อการสอน คมชัดระดับเวกเตอร์ SVG',
  keywords: [
    'สร้าง qr code pdf',
    'ทำ qr code pdf',
    'แปลง pdf เป็น qr code',
    'qr code ไฟล์ pdf',
    'qr code เมนู pdf',
    'pdf qr code generator',
    'qr code google drive',
    'ทำ qr code เอกสาร',
    'ทำ qr code ฟรี',
    'สร้าง qr code ฟรี',
  ],
  alternates: {
    canonical: '/pdf',
  },
  openGraph: {
    title: 'สร้าง QR Code ไฟล์ PDF ฟรี — แปลงลิงก์ Google Drive & เอกสาร ดูได้ทันที | QR Code Maker',
    description: 'แปลงทุกลิงก์ PDF และ Google Drive ให้เป็น QR Code สแกนแล้วเปิดดูเอกสารทันที ไม่มีวันหมดอายุ',
    url: '/pdf',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code ไฟล์ PDF ฟรี — QR Code Maker',
    }],
  },
};

export default function PdfPage() {
  return <Home initialQrType="pdf" />;
}
