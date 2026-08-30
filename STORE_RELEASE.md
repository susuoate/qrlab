# QR LAB — iOS และ Android Release

## สถานะปัจจุบัน

- Bundle/Package ID ชั่วคราว: `com.susuoate.qrlab`
- Android: Capacitor project พร้อม target API 36, version code 1, version 1.0
- iOS: Capacitor/Xcode project พร้อม deployment target iOS 15, version 1.0
- Mobile web bundle: บรรจุในแอปและใช้งานได้โดยไม่ต้องโหลดเว็บไซต์จากภายนอก
- Native features: บันทึก/แชร์ PNG และ JPEG ผ่าน Filesystem + Share พร้อม haptic feedback
- Monetization: เตรียม AdMob banner สำหรับผู้ใช้ฟรี และ In-App Purchase แบบถาวร 2 ระดับ
- Privacy: ไม่มีบัญชีหรือการส่ง URL ไปเซิร์ฟเวอร์ แต่ AdMob/RevenueCat ประมวลผลข้อมูลตามหน้าที่ของ SDK
- Privacy policy: `/privacy`

## ระบบสนับสนุนและโฆษณา

- Product ID ราคา 49 บาท: `qrlab_supporter_49`
- Product ID ราคา 100 บาท: `qrlab_supporter_100`
- Product type: Non-consumable / one-time product
- RevenueCat entitlement: `ad_free`
- ทั้งสอง Product ID ต้องผูกกับ entitlement `ad_free`
- ผู้ใช้ไม่ต้องล็อกอินและกู้คืนสิทธิ์ด้วยบัญชี Store เดิมได้
- สิทธิ์ไม่ซิงก์ข้าม iOS/Android เพราะไม่มีบัญชี QR LAB
- โฆษณาเป็น adaptive banner และขอ UMP consent ก่อนโหลด
- ระหว่างพัฒนาใช้ Google Test App ID และ Test Ad Unit ID เท่านั้น

คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ RevenueCat public SDK keys และ AdMob banner unit IDs จริงก่อนสร้าง release

รัน `npm run check:monetization-release` ก่อนเซ็นแอป คำสั่งนี้จะไม่ยอมผ่านถ้ายังใช้ Test ID หรือขาดการตั้งค่ารายได้

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
6. RevenueCat project พร้อม Apple/Google public SDK key
7. AdMob App ID และ banner ad unit ID ของทั้ง iOS/Android

## Android release gate

- ติดตั้ง JDK และ Android SDK/Android Studio
- สร้าง upload keystore และเก็บรหัสผ่านนอก repository
- สร้าง one-time products ทั้งสองรายการและตั้งราคา THB 49 / THB 100
- เปลี่ยน `admob_app_id` ใน `android/app/src/main/res/values/strings.xml` จาก Test ID เป็น App ID จริง
- ตั้ง `VITE_ADMOB_TEST_MODE=false` และใช้ banner unit ID จริง
- Build signed Android App Bundle (`.aab`)
- ทดสอบ Internal testing บนอุปกรณ์จริงอย่างน้อยหนึ่งเครื่อง
- กรอก Data safety ตามข้อมูลที่ AdMob, RevenueCat และ Store SDK เก็บ/แชร์จริง ห้ามเลือก "ไม่เก็บข้อมูล" โดยยังไม่ได้ตรวจแบบฟอร์มของ SDK รุ่นที่ใช้
- อัปโหลดไอคอน 512×512, feature graphic และภาพหน้าจอโทรศัพท์

ข้อกำหนด target API: https://support.google.com/googleplay/android-developer/answer/11926878

## iOS release gate

- ใช้ macOS ที่ติดตั้ง Xcode รุ่นรองรับ App Store ปัจจุบัน
- ตั้ง Apple Team และ automatic signing ใน Xcode
- เปิด In-App Purchase capability และสร้าง Non-Consumable IAP ทั้งสองรายการ
- เปลี่ยน `GADApplicationIdentifier` ใน `ios/App/App/Info.plist` จาก Test ID เป็น App ID จริง
- ตรวจ App Privacy, ATT/UMP consent และ `PrivacyInfo.xcprivacy` กับ SDK รุ่นที่ใช้จริง
- สร้าง Archive แล้วส่งไป TestFlight
- ทดสอบบันทึก/แชร์ PNG และ JPEG บน iPhone จริง
- กรอก App Privacy ตามข้อมูลที่ AdMob, RevenueCat และ Store SDK เก็บจริง พร้อมตรวจ privacy manifest ของ SDK รุ่นที่ใช้
- อัปโหลดภาพหน้าจอ iPhone และข้อมูล review

App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

## Store listing draft

- ชื่อ: QR LAB — สร้าง QR Code
- หมวดหมู่: Utilities
- คำอธิบายสั้น: สร้าง QR Code จาก URL ปรับสีและบันทึกเป็น PNG/JPEG ได้ทันที
- ราคา: Free
- Login: ไม่ต้องใช้
- โฆษณา: มี adaptive banner ในเวอร์ชันฟรี; ผู้สนับสนุน 49 หรือ 100 บาทปิดโฆษณาถาวร
