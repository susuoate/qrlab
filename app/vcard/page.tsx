import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'สร้าง QR Code นามบัตรดิจิทัล (vCard) ฟรี — สแกนบันทึกรายชื่อลงมือถือทันที | QR lab',
  description: 'สร้าง QR Code นามบัตรอิเล็กทรอนิกส์ (Digital Business Card vCard) ฟรี สแกนแล้วกดบันทึกเบอร์โทร อีเมล บริษัท และตำแหน่งลงสมุดโทรศัพท์ได้ทันที คมชัดระดับเวกเตอร์ SVG ไม่มีวันหมดอายุ',
  keywords: [
    'สร้าง qr code นามบัตร',
    'qr code นามบัตร',
    'vcard qr code generator',
    'qr code นามบัตรดิจิทัล',
    'สร้าง qr code vcard',
    'digital business card qr code',
    'สร้าง qr code ฟรี',
  ],
  alternates: {
    canonical: '/vcard',
  },
  openGraph: {
    title: 'สร้าง QR Code นามบัตรดิจิทัล (vCard) ฟรี — สแกนบันทึกเบอร์ลงมือถือทันที',
    description: 'แปลงข้อมูลติดต่อเป็น QR Code นามบัตรดิจิทัล สแกนครั้งเดียวบันทึกลงเครื่องทันที',
    url: '/vcard',
  },
};

export default function VCardPage() {
  return <Home initialQrType="vcard" />;
}
