import type { Language } from './types';

export const translations = {
  th: {
    brand: 'QR LAB',
    tagline: 'ทุกลิงก์ พร้อมสแกน',
    heroDesc: 'สร้าง QR Code คมชัดระดับโปร รองรับทั้ง URL, พร้อมเพย์, Wi-Fi, โซเชียล และนามบัตร พร้อมสแกนเนอร์ในตัว',
    ctaCreate: 'สร้าง QR ฟรี',
    ctaScan: 'สแกน QR Code',
    badgeLive: 'อัปเดตทันที',
    navHow: 'วิธีใช้งาน',
    navFeatures: 'จุดเด่น',
    navFaq: 'คำถามที่พบบ่อย',
    navHistory: 'ประวัติการสร้าง',
    navScanner: 'สแกนเนอร์',

    // Trust items
    noWatermark: 'ไม่มีลายน้ำ',
    noExpiry: 'ไม่หมดอายุ',
    noDataCollect: 'ไม่เก็บข้อมูล',

    // Tabs
    tabUrl: 'เว็บไซต์ (URL)',
    tabPromptpay: 'พร้อมเพย์',
    tabWifi: 'Wi-Fi',
    tabSocial: 'โซเชียล',
    tabTel: 'เบอร์โทร',
    tabVCard: 'นามบัตร',
    tabText: 'ข้อความ',

    // URL Form
    urlLabel: 'ลิงก์เว็บไซต์',
    urlPlaceholder: 'yourwebsite.com หรือใส่ลิงก์เต็ม',
    urlHelp: 'ใส่ได้ทั้งแบบมีหรือไม่มี https://',
    tryWith: 'ลองด้วย',

    // PromptPay Form
    promptpayType: 'ประเภทบัญชี',
    promptpayMobile: 'เบอร์มือถือ',
    promptpayId: 'เลขบัตร ปชช. / ผู้เสียภาษี',
    promptpayTargetPlaceholderMobile: '0812345678',
    promptpayTargetPlaceholderId: '1234567890123',
    promptpayAmountLabel: 'จำนวนเงิน (บาท - ไม่ใส่ก็ได้)',
    promptpayAmountPlaceholder: '0.00',
    promptpayHelp: 'สแกนจ่ายได้ทุกแอปธนาคารไทย (มาตรฐาน EMVCo)',

    // Wi-Fi Form
    wifiSsid: 'ชื่อเครือข่าย Wi-Fi (SSID)',
    wifiSsidPlaceholder: 'MyHome_WiFi',
    wifiPass: 'รหัสผ่าน Wi-Fi',
    wifiPassPlaceholder: 'รหัสผ่านอย่างน้อย 8 ตัวอักษร',
    wifiSec: 'ประเภทความปลอดภัย',
    wifiHidden: 'เครือข่ายนี้ซ่อนชื่อ (Hidden SSID)',

    // Social Form
    socialPlatform: 'แพลตฟอร์ม',
    socialUsername: 'ชื่อบัญชี / ไอดี',
    socialPlaceholder: 'ใส่ไอดี เช่น susuoate หรือใส่ @',

    // Tel Form
    telLabel: 'เบอร์โทรศัพท์ที่ต้องการให้สแกนแล้วโทร',
    telPlaceholder: '0812345678 หรือ +66812345678',

    // vCard Form
    vcardFirstName: 'ชื่อ',
    vcardLastName: 'นามสกุล',
    vcardPhone: 'เบอร์โทรศัพท์',
    vcardEmail: 'อีเมล',
    vcardOrg: 'บริษัท / องค์กร',

    // Text Form
    textLabel: 'ข้อความที่ต้องการเข้ารหัสใน QR Code',
    textPlaceholder: 'พิมพ์ข้อความ บันทึก หรือรหัสข้อความที่นี่…',

    // Controls
    colorTitle: 'สี QR Code',
    customColor: 'เลือกสีอื่น',
    sizeTitle: 'ขนาดไฟล์',
    formatTitle: 'ชนิดไฟล์',
    transparentBg: 'พื้นหลังโปร่งใส',
    transparentBgHelp: 'เหมาะกับงานออกแบบและป้ายโลโก้',
    jpegBgNotice: 'JPEG ใช้พื้นหลังสีขาวเสมอ',
    centerLogoTitle: 'โลโก้ตรงกลาง (Center Logo)',
    noLogo: 'ไม่มีโลโก้',
    uploadCustomLogo: 'อัปโหลดภาพเอง…',
    removeLogo: 'ลบโลโก้',

    // Preview Panel
    preview: 'ตัวอย่าง',
    previewActionTest: 'ทดสอบเปิดลิงก์ ↗',
    previewActionCopy: 'คัดลอกข้อมูล',
    previewActionCopied: 'คัดลอกแล้ว ✓',
    downloadBtn: 'ดาวน์โหลด',
    saveShareBtn: 'บันทึก / แชร์',
    downloadReady: 'พร้อมใช้งาน ✓',
    safeOnDevice: 'สร้างบนอุปกรณ์ของคุณ ปลอดภัย 100%',

    // Scanner
    scannerTitle: 'สแกน QR Code',
    scannerSubtitle: 'สแกนด้วยกล้องหรืออัปโหลดรูปภาพจากเครื่องเพื่อถอดรหัส',
    tabCamera: 'กล้องสด',
    tabUpload: 'อัปโหลดรูปภาพ',
    cameraStart: 'เปิดกล้อง',
    cameraStop: 'ปิดกล้อง',
    cameraPermissionError: 'ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์',
    dropImage: 'คลิกหรือลากรูปภาพมาวางที่นี่เพื่อสแกน',
    chooseFile: 'เลือกไฟล์รูปภาพ',
    scanning: 'กำลังสแกนรูปภาพ…',
    noQrFound: 'ไม่พบ QR Code ในรูปภาพนี้ ลองเลือกภาพที่ชัดเจนขึ้น',
    scanResult: 'ผลการสแกน',
    openLink: 'เปิดลิงก์',
    copyResult: 'คัดลอกข้อความ',
    useInMaker: 'นำไปสร้าง QR ใหม่',

    // History
    historyTitle: 'ประวัติการสร้างล่าสุด',
    historySubtitle: 'บันทึกเฉพาะในอุปกรณ์นี้ สูงสุด 20 รายการ',
    historyEmpty: 'ยังไม่มีประวัติการสร้าง QR Code',
    clearAllHistory: 'ล้างประวัติทั้งหมด',
    restoreToMaker: 'นำกลับมาแก้ไข',
    deleteItem: 'ลบรายการ',

    // Steps & Features
    stepsTitle: 'ขั้นตอนการใช้งาน',
    stepsHeading: 'ง่ายกว่าที่คิด เสร็จในไม่กี่วินาที',
    stepsDesc: 'ไม่ต้องเรียนรู้เครื่องมือซับซ้อน เพียงเลือกประเภท ปรับสไตล์ และบันทึกไฟล์',
    step1: 'เลือกประเภทและใส่ข้อมูล',
    step1Desc: 'รองรับทั้ง URL, พร้อมเพย์, Wi-Fi, เบอร์โทร และนามบัตร',
    step2: 'ปรับแต่งสไตล์และโลโก้',
    step2Desc: 'เลือกสี ขนาด ใส่โลโก้ตรงกลาง และเลือกรูปแบบไฟล์ SVG/PNG/JPEG',
    step3: 'ดาวน์โหลดหรือแชร์ทันที',
    step3Desc: 'ไฟล์เวกเตอร์และภาพความละเอียดสูง พร้อมนำไปพิมพ์โดยไม่มีลายน้ำ',

    featuresHeading: 'QR Code ที่พร้อม ไปกับทุกงาน',
    f1Title: 'เป็นส่วนตัวตั้งแต่ต้น',
    f1Desc: 'ทุกอย่างประมวลผลบนเครื่องของคุณ ข้อมูลไม่ถูกส่งไปเซิร์ฟเวอร์ภายนอก',
    f2Title: 'สแกนได้ตลอดไป',
    f2Desc: 'QR แบบคงที่ไม่มีวันหมดอายุ ใช้งานได้ตลอดชีพ',
    f3Title: 'เวกเตอร์ SVG แท้',
    f3Desc: 'ส่งออก SVG สำหรับงานพิมพ์ป้ายขนาดใหญ่ คมชัด 100% ไม่แตก',
    f4Title: 'พร้อมเพย์ & Wi-Fi',
    f4Desc: 'ได้มาตรฐาน EMVCo สแกนจ่ายเงินและต่อเครือข่ายอัตโนมัติ',

    // FAQ
    faqTitle: 'คำถามที่พบบ่อย',
    faq1Q: 'QR Code ที่สร้างฟรีจริงไหม?',
    faq1A: 'ฟรี 100% ไม่มีลายน้ำ และไม่จำกัดจำนวนครั้ง ดาวน์โหลดไปใช้งานเชิงพาณิชย์ได้ทันที',
    faq2Q: 'QR Code พร้อมเพย์ปลอดภัยไหม?',
    faq2A: 'ปลอดภัย 100% เพราะระบบเข้ารหัสแบบ EMVCo TLV บนอุปกรณ์ของคุณ ไม่มีการส่งข้อมูลบัญชีหรือยอดเงินไปยังเซิร์ฟเวอร์ใดๆ',
    faq3Q: 'ทำไมถึงควรใช้ไฟล์ SVG?',
    faq3A: 'ไฟล์ SVG เป็นภาพเวกเตอร์ที่ขยายได้ไม่จำกัด เหมาะอย่างยิ่งสำหรับส่งให้โรงพิมพ์ทำป้ายไวนิล นามบัตร หรือติดหน้าร้าน',
    faq4Q: 'QR Code จะหมดอายุหรือไม่?',
    faq4A: 'ไม่หมดอายุ เป็น Static QR Code ที่เก็บข้อมูลไว้ในตัวโค้ดโดยตรง ใช้งานได้ตลอดไป',

    // Footer
    privacyPolicy: 'นโยบายความเป็นส่วนตัว',
    allRightsReserved: 'QR LAB — เปลี่ยนทุกลิงก์ให้พร้อมสแกน',
  },
  en: {
    brand: 'QR LAB',
    tagline: 'Every Link, Ready to Scan',
    heroDesc: 'Generate crisp, professional QR codes for URLs, PromptPay, Wi-Fi, Social, and Contacts with built-in scanner & vector SVG export.',
    ctaCreate: 'Create QR Free',
    ctaScan: 'Scan QR Code',
    badgeLive: 'Instant Live Preview',
    navHow: 'How It Works',
    navFeatures: 'Features',
    navFaq: 'FAQ',
    navHistory: 'History',
    navScanner: 'Scanner',

    // Trust items
    noWatermark: 'No Watermark',
    noExpiry: 'Never Expires',
    noDataCollect: 'Zero Data Tracking',

    // Tabs
    tabUrl: 'Website (URL)',
    tabPromptpay: 'PromptPay',
    tabWifi: 'Wi-Fi',
    tabSocial: 'Social',
    tabTel: 'Phone Call',
    tabVCard: 'Contact (vCard)',
    tabText: 'Plain Text',

    // URL Form
    urlLabel: 'Website Link',
    urlPlaceholder: 'yourwebsite.com or full https:// link',
    urlHelp: 'Enter with or without https://',
    tryWith: 'Try with',

    // PromptPay Form
    promptpayType: 'Account Type',
    promptpayMobile: 'Mobile Number',
    promptpayId: 'National ID / Tax ID',
    promptpayTargetPlaceholderMobile: '0812345678',
    promptpayTargetPlaceholderId: '1234567890123',
    promptpayAmountLabel: 'Amount in THB (Optional)',
    promptpayAmountPlaceholder: '0.00',
    promptpayHelp: 'Scannable by all Thai mobile banking apps (EMVCo Standard)',

    // Wi-Fi Form
    wifiSsid: 'Wi-Fi Network Name (SSID)',
    wifiSsidPlaceholder: 'MyHome_WiFi',
    wifiPass: 'Wi-Fi Password',
    wifiPassPlaceholder: 'Password (min 8 characters)',
    wifiSec: 'Security Type',
    wifiHidden: 'Hidden Network (SSID)',

    // Social Form
    socialPlatform: 'Platform',
    socialUsername: 'Username / Account ID',
    socialPlaceholder: 'Username (e.g. susuoate or @handle)',

    // Tel Form
    telLabel: 'Phone Number to Call',
    telPlaceholder: '+66812345678 or 0812345678',

    // vCard Form
    vcardFirstName: 'First Name',
    vcardLastName: 'Last Name',
    vcardPhone: 'Phone Number',
    vcardEmail: 'Email',
    vcardOrg: 'Company / Organization',

    // Text Form
    textLabel: 'Plain Text to Encode',
    textPlaceholder: 'Type your message, notes, or code here…',

    // Controls
    colorTitle: 'QR Code Color',
    customColor: 'Custom Color',
    sizeTitle: 'Resolution',
    formatTitle: 'File Format',
    transparentBg: 'Transparent Background',
    transparentBgHelp: 'Ideal for graphic design and badges',
    jpegBgNotice: 'JPEG always uses a solid white background',
    centerLogoTitle: 'Center Logo / Icon',
    noLogo: 'No Logo',
    uploadCustomLogo: 'Upload Custom Image…',
    removeLogo: 'Remove Logo',

    // Preview Panel
    preview: 'Preview',
    previewActionTest: 'Test Open Link ↗',
    previewActionCopy: 'Copy Data',
    previewActionCopied: 'Copied! ✓',
    downloadBtn: 'Download',
    saveShareBtn: 'Save / Share',
    downloadReady: 'Ready! ✓',
    safeOnDevice: 'Generated locally on your device (100% Private)',

    // Scanner
    scannerTitle: 'QR Code Scanner',
    scannerSubtitle: 'Scan with your live camera or upload an image file from your device',
    tabCamera: 'Live Camera',
    tabUpload: 'Upload Photo',
    cameraStart: 'Start Camera',
    cameraStop: 'Stop Camera',
    cameraPermissionError: 'Cannot access camera. Please allow camera permissions in your browser.',
    dropImage: 'Click or drop an image file here to scan',
    chooseFile: 'Choose Image File',
    scanning: 'Scanning image…',
    noQrFound: 'No QR Code found in this image. Please try a clearer picture.',
    scanResult: 'Scan Result',
    openLink: 'Open Link',
    copyResult: 'Copy Text',
    useInMaker: 'Load into QR Maker',

    // History
    historyTitle: 'Recent QR History',
    historySubtitle: 'Saved privately on this device (up to 20 items)',
    historyEmpty: 'No saved QR codes yet.',
    clearAllHistory: 'Clear All History',
    restoreToMaker: 'Load & Edit',
    deleteItem: 'Delete',

    // Steps & Features
    stepsTitle: 'How It Works',
    stepsHeading: 'Easier than you think, ready in seconds',
    stepsDesc: 'No complicated software needed. Select type, customize style, and save.',
    step1: 'Choose Type & Input Data',
    step1Desc: 'Supports URLs, PromptPay, Wi-Fi, Phone, and digital vCard contacts.',
    step2: 'Customize Style & Logo',
    step2Desc: 'Pick custom colors, resolution, center logo, and vector SVG format.',
    step3: 'Download or Share',
    step3Desc: 'Instant high-resolution or vector SVG ready for print without watermarks.',

    featuresHeading: 'QR Codes Built For Every Purpose',
    f1Title: 'Private by Design',
    f1Desc: 'Everything is processed locally on your device with zero cloud tracking.',
    f2Title: 'Never Expires',
    f2Desc: 'Static QR codes remain scannable forever without recurring subscription fees.',
    f3Title: 'True Vector SVG',
    f3Desc: 'Export scalable vector graphics perfect for large billboards and vinyl print.',
    f4Title: 'PromptPay & Wi-Fi Ready',
    f4Desc: 'Standards-compliant EMVCo payments and instant one-tap Wi-Fi connection.',

    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faq1Q: 'Is it completely free?',
    faq1A: 'Yes, 100% free with no watermarks and unlimited usage for personal and commercial use.',
    faq2Q: 'Is PromptPay QR secure?',
    faq2A: '100% secure. Payload encoding is computed client-side using Bank of Thailand EMVCo TLV specifications with zero network transmission.',
    faq3Q: 'Why should I use SVG format?',
    faq3A: 'SVG is an infinite resolution vector graphic. It never pixelates when scaled up for vinyl signs, packaging, or professional print.',
    faq4Q: 'Do the generated QR codes expire?',
    faq4A: 'Never. These are static QR codes where data is embedded directly in the matrix.',

    // Footer
    privacyPolicy: 'Privacy Policy',
    allRightsReserved: 'QR LAB — Every Link, Ready to Scan',
  },
} as const;

export type TranslationKey = keyof typeof translations['th'];
