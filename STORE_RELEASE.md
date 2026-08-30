# QR LAB — iOS และ Android Release

## สถานะปัจจุบัน

- Bundle/Package ID ชั่วคราว: `com.susuoate.qrlab`
- Android: Capacitor project พร้อม target API 36, version code 1, version 1.0
- iOS: Capacitor/Xcode project พร้อม deployment target iOS 15, version 1.0
- Mobile web bundle: บรรจุในแอปและใช้งานได้โดยไม่ต้องโหลดเว็บไซต์จากภายนอก
- Native features: บันทึก/แชร์ PNG และ JPEG ผ่าน Filesystem + Share พร้อม haptic feedback
- Privacy: ไม่มีบัญชี โฆษณา analytics หรือการส่ง URL ไปเซิร์ฟเวอร์
- Privacy policy: `/privacy`

## คำสั่งเตรียม native projects

```powershell
npm install
npm run assets:native
npm run mobile:sync
```

## สิ่งที่ต้องยืนยันก่อนเซ็นแอป

1. ยืนยันว่าใช้ `com.susuoate.qrlab` เป็น ID ถาวรได้
2. Google Play Console account และชื่อ developer ที่จะแสดง
3. Apple Developer Program account และ Apple Team ID
4. อีเมล support สำหรับ Store listing
5. ประเทศ/ภูมิภาค ราคา (แนะนำ Free) และกลุ่มอายุ

## Android release gate

- ติดตั้ง JDK และ Android SDK/Android Studio
- สร้าง upload keystore และเก็บรหัสผ่านนอก repository
- Build signed Android App Bundle (`.aab`)
- ทดสอบ Internal testing บนอุปกรณ์จริงอย่างน้อยหนึ่งเครื่อง
- กรอก Data safety ว่าไม่เก็บและไม่แชร์ข้อมูล หลังตรวจทาน build จริงอีกครั้ง
- อัปโหลดไอคอน 512×512, feature graphic และภาพหน้าจอโทรศัพท์

ข้อกำหนด target API: https://support.google.com/googleplay/android-developer/answer/11926878

## iOS release gate

- ใช้ macOS ที่ติดตั้ง Xcode รุ่นรองรับ App Store ปัจจุบัน
- ตั้ง Apple Team และ automatic signing ใน Xcode
- สร้าง Archive แล้วส่งไป TestFlight
- ทดสอบบันทึก/แชร์ PNG และ JPEG บน iPhone จริง
- กรอก App Privacy ว่าไม่เก็บข้อมูล หลังตรวจทาน build จริงอีกครั้ง
- อัปโหลดภาพหน้าจอ iPhone และข้อมูล review

App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

## Store listing draft

- ชื่อ: QR LAB — สร้าง QR Code
- หมวดหมู่: Utilities
- คำอธิบายสั้น: สร้าง QR Code จาก URL ปรับสีและบันทึกเป็น PNG/JPEG ได้ทันที
- ราคา: Free
- Login: ไม่ต้องใช้
- โฆษณา: ไม่มี
