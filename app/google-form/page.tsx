import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code Google Form ฟรี — แปลงลิงก์ฟอร์ม แบบสอบถาม ส่งงาน ง่ายๆ | QR Code Maker',
  description: 'สร้าง QR Code สำหรับ Google Form, Google Docs, และ Google Drive ออนไลน์ฟรี สแกนแล้วเปิดหน้าแบบสอบถามหรือส่งงานได้ทันที เหมาะสำหรับคุณครู นักเรียน นิสิตนักศึกษา และองค์กรวิจัย คมชัดระดับเวกเตอร์ SVG ไม่มีวันหมดอายุ',
  keywords: [
    'สร้าง qr code google form',
    'ทำ qr code google form',
    'qr code แบบสอบถาม',
    'ทำ qr code ส่งงาน',
    'qr code google drive',
    'แปลง google form เป็น qr code',
    'สร้าง qr code ฟรี',
    'ทำ qr code ฟรี',
    'google form qr code generator',
  ],
  alternates: {
    canonical: '/google-form',
  },
  openGraph: {
    title: 'สร้าง QR Code Google Form ฟรี — แปลงลิงก์ฟอร์ม แบบสอบถาม ง่ายๆ | QR Code Maker',
    description: 'แปลงทุกลิงก์ Google Form และ Drive ให้เป็น QR Code สแกนติดง่าย ไม่มีวันหมดอายุ ฟรี 100%',
    url: '/google-form',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'สร้าง QR Code Google Form ฟรี — QR Code Maker',
    }],
  },
};

export default function GoogleFormPage() {
  return <Home initialQrType="url" />;
}
