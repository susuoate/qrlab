import Link from 'next/link';

export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว — QR LAB',
  description: 'นโยบายความเป็นส่วนตัวของแอป QR LAB สำหรับเว็บ, iOS และ Android',
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <Link className="privacy-brand" href="/">QR LAB</Link>
      <article>
        <p className="section-kicker">PRIVACY POLICY</p>
        <h1>นโยบายความเป็นส่วนตัว</h1>
        <p className="privacy-date">มีผลตั้งแต่วันที่ 30 สิงหาคม 2026</p>

        <h2>ข้อมูลที่เราเก็บ</h2>
        <p>QR LAB ไม่ต้องสมัครสมาชิกและไม่เก็บข้อมูลส่วนบุคคล ลิงก์ สี ขนาด และ QR Code ที่คุณสร้างจะถูกประมวลผลภายในอุปกรณ์ของคุณและไม่ถูกส่งไปยังเซิร์ฟเวอร์ของเรา</p>

        <h2>การบันทึกและแชร์ไฟล์</h2>
        <p>เมื่อคุณบันทึกหรือแชร์ไฟล์ PNG/JPEG แอปจะสร้างไฟล์ชั่วคราวบนอุปกรณ์ และจะแชร์ไปยังแอปหรือบริการที่คุณเลือกเท่านั้น บริการปลายทางนั้นมีนโยบายความเป็นส่วนตัวของตนเอง</p>

        <h2>บัญชี โฆษณา และการติดตาม</h2>
        <p>QR LAB ไม่มีระบบเข้าสู่ระบบ ไม่มีโฆษณา และไม่ได้ติดตั้งระบบวิเคราะห์หรือเครื่องมือติดตามพฤติกรรมผู้ใช้</p>

        <h2>การเปลี่ยนแปลงนโยบาย</h2>
        <p>หากการทำงานของแอปเปลี่ยนไป เราจะปรับปรุงหน้านี้และระบุวันที่มีผลฉบับล่าสุด</p>

        <h2>ติดต่อ</h2>
        <p>แจ้งคำถามหรือปัญหาได้ที่ <a href="https://github.com/susuoate/qrlab/issues">GitHub Issues ของ QR LAB</a></p>
      </article>
    </main>
  );
}
