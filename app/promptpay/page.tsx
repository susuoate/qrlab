import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code พร้อมเพย์ ฟรี ไม่มีวันหมดอายุ (PromptPay) — สแกนจ่ายได้ทุกธนาคาร | QR Code Maker',
  description: 'เครื่องมือสร้าง QR Code พร้อมเพย์ (PromptPay QR Generator) ออนไลน์ฟรี ไม่มีวันหมดอายุ ตามมาตรฐาน EMVCo ธปท. รองรับทั้งเบอร์มือถือและเลขบัตรประชาชน สแกนจ่ายเงินได้ทุกแอปธนาคารไทย ปลอดภัย 100%',
  keywords: [
    'สร้าง qr code พร้อมเพย์',
    'qr code พร้อมเพย์',
    'ทำ qr code พร้อมเพย์',
    'promptpay qr code generator',
    'qr code พร้อมเพย์ ไม่มีหมดอายุ',
    'qr promptpay ฟรี',
    'สร้าง qr code ฟรี',
    'qr code ธนาคาร',
  ],
  alternates: {
    canonical: '/promptpay',
  },
  openGraph: {
    title: 'สร้าง QR Code พร้อมเพย์ ฟรี ไม่มีวันหมดอายุ (PromptPay) — สแกนจ่ายได้ทุกธนาคาร',
    description: 'สร้าง QR Code พร้อมเพย์ตามมาตรฐาน EMVCo สแกนจ่ายได้ทุกแอปธนาคาร ฟรี ไม่มีลายน้ำ ปลอดภัย 100%',
    url: '/promptpay',
  },
};

export default function PromptPayPage() {
  return <Home initialQrType="promptpay" />;
}
