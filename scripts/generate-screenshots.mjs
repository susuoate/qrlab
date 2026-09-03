import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import { execFile } from 'node:child_process';
import http from 'node:http';

async function buildScreenshots() {
  const qrBlue = await QRCode.toDataURL('https://my-shop.com/menu', { width: 500, margin: 2, color: { dark: '#0C79D8', light: '#FFFFFF' } });
  const qrDark = await QRCode.toDataURL('https://qrlab.app', { width: 500, margin: 2, color: { dark: '#07172F', light: '#FFFFFF' } });
  const qrCoral = await QRCode.toDataURL('https://instagram.com/mybrand', { width: 500, margin: 2, color: { dark: '#702D54', light: '#FFFFFF' } });

  const kanitFont = fs.readFileSync('public/fonts/kanit/kanit-nKKZ-Go6G5tXcraBGwCYdA.woff2').toString('base64');
  const kanitBold = fs.readFileSync('public/fonts/kanit/kanit-nKKU-Go6G5tXcr4uPhWzVaF5NQ.woff2').toString('base64');

  const cssHead = `
    @font-face {
      font-family: 'Kanit';
      font-style: normal;
      font-weight: 400;
      src: url(data:font/woff2;base64,${kanitFont}) format('woff2');
    }
    @font-face {
      font-family: 'Kanit';
      font-style: normal;
      font-weight: 700;
      src: url(data:font/woff2;base64,${kanitBold}) format('woff2');
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      font-family: 'Kanit', sans-serif;
      background: radial-gradient(circle at 50% 12%, #0d3868 0%, #07172F 65%);
      color: white;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .header {
      padding: 95px 65px 45px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 10px 24px;
      border-radius: 999px;
      background: rgba(104, 196, 255, 0.14);
      border: 1.5px solid rgba(104, 196, 255, 0.35);
      color: #68C4FF;
      font-size: 23px;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin-bottom: 22px;
    }
    .title {
      font-size: 64px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.5px;
      color: #FFFFFF;
      margin-bottom: 14px;
    }
    .subtitle {
      font-size: 32px;
      color: rgba(255, 255, 255, 0.75);
      font-weight: 400;
      line-height: 1.4;
    }
    .phone-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .phone {
      width: 780px;
      height: 1480px;
      background: #091c38;
      border-radius: 54px 54px 0 0;
      border: 6px solid #1a365d;
      border-bottom: 0;
      box-shadow: 0 -20px 70px rgba(0,0,0,0.6);
      padding: 24px 34px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .notch {
      width: 150px;
      height: 24px;
      background: #030a17;
      border-radius: 999px;
      margin: 0 auto 12px;
    }
    .card {
      background: #07172F;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 28px;
      padding: 30px;
    }
    .input-box {
      background: white;
      border-radius: 16px;
      padding: 20px 24px;
      color: #07172F;
      font-size: 26px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 18px 0 14px;
    }
    .chips {
      display: flex;
      gap: 12px;
    }
    .chip {
      padding: 8px 18px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 999px;
      font-size: 20px;
      color: rgba(255,255,255,0.85);
    }
    .chip.active {
      background: #c9f264;
      color: #07172F;
      border-color: #c9f264;
      font-weight: 700;
    }
    .qr-preview-box {
      background: white;
      border-radius: 32px;
      padding: 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.25);
    }
    .qr-img {
      width: 440px;
      height: 440px;
      border-radius: 16px;
    }
    .btn-main {
      width: 100%;
      background: #c9f264;
      color: #07172F;
      font-size: 28px;
      font-weight: 700;
      padding: 22px;
      border-radius: 18px;
      text-align: center;
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .btn-sub {
      width: 100%;
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.24);
      color: white;
      font-size: 24px;
      font-weight: 700;
      padding: 18px;
      border-radius: 16px;
      text-align: center;
      margin-top: 12px;
    }
    .swatches-row {
      display: flex;
      gap: 16px;
      align-items: center;
      margin: 18px 0;
    }
    .swatch {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      border: 3px solid white;
    }
    .swatch.selected {
      box-shadow: 0 0 0 5px #c9f264;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .feature-item {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      padding: 22px;
      text-align: center;
    }
    .feature-item h3 { font-size: 26px; color: #68C4FF; margin-bottom: 6px; }
    .feature-item p { font-size: 19px; color: rgba(255,255,255,0.7); }
  `;

  const screens = [
    {
      file: 'screen1.html',
      out: 'QR_LAB_Screenshot_1.png',
      badge: '⚡ สร้าง QR CODE ทันใจ',
      title: 'สร้าง QR Code ง่ายๆ ในไม่กี่วินาที',
      sub: 'เพียงวางลิงก์เว็บไซต์ ก็ได้ QR Code คุณภาพสูงพร้อมใช้งาน',
      content: `
        <div class="card">
          <div style="font-size: 22px; color: #68C4FF; font-weight: 700;">🔗 วางลิงก์ URL ที่ต้องการ</div>
          <div class="input-box">
            <span>https://my-shop.com/menu</span>
            <span style="color: #888;">✕</span>
          </div>
          <div class="chips">
            <span class="chip active">เว็บไซต์</span>
            <span class="chip">Facebook</span>
            <span class="chip">YouTube</span>
          </div>
        </div>
        <div class="qr-preview-box">
          <img src="${qrDark}" class="qr-img" />
          <div style="margin-top: 20px; font-size: 22px; color: #196b62; font-weight: 700; background: #e8f7f5; padding: 6px 18px; border-radius: 999px;">
            ● ความคมชัดสูง • สแกนได้ตลอดชีพ
          </div>
          <div class="btn-main">⬇ บันทึกภาพ PNG คมชัด</div>
        </div>
      `
    },
    {
      file: 'screen2.html',
      out: 'QR_LAB_Screenshot_2.png',
      badge: '🎨 ปรับแต่งสีสันอิสระ',
      title: 'เลือกเฉดสีให้เข้ากับแบรนด์คุณ',
      sub: 'ปรับสี QR Code ได้หลากหลายรูปแบบ ทั้งโทนสุภาพและสีสันสดใส',
      content: `
        <div class="card">
          <div style="font-size: 22px; color: #68C4FF; font-weight: 700;">🎨 เลือกโทนสี QR Code</div>
          <div class="swatches-row">
            <div class="swatch selected" style="background: #0C79D8;"></div>
            <div class="swatch" style="background: #123B3A;"></div>
            <div class="swatch" style="background: #702D54;"></div>
            <div class="swatch" style="background: #FF7259;"></div>
            <div class="swatch" style="background: #20232B;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 22px;">พื้นหลังโปร่งใส (Transparent)</span>
            <span style="background: #c9f264; color: #07172F; font-size: 18px; font-weight: 700; padding: 4px 14px; border-radius: 999px;">เปิด</span>
          </div>
        </div>
        <div class="qr-preview-box">
          <img src="${qrBlue}" class="qr-img" />
          <div style="margin-top: 20px; font-size: 22px; color: #0C79D8; font-weight: 700; background: #e9f4fc; padding: 6px 18px; border-radius: 999px;">
            โทนสี: Deep Ocean Blue
          </div>
          <div class="btn-main" style="background: #0C79D8; color: white;">บันทึกรูปภาพสีนี้</div>
        </div>
      `
    },
    {
      file: 'screen3.html',
      out: 'QR_LAB_Screenshot_3.png',
      badge: '💾 คุณภาพสูงระดับ HD',
      title: 'บันทึกไฟล์ PNG และ JPEG',
      sub: 'ความละเอียดสูงถึง 1024px ภาพไม่แตก นำไปพิมพ์ลงสื่อต่างๆ ได้ทันที',
      content: `
        <div class="card">
          <div style="font-size: 22px; color: #68C4FF; font-weight: 700;">📐 ฟอร์แมตและขนาดความละเอียด</div>
          <div class="chips" style="margin: 16px 0 20px;">
            <span class="chip active">PNG (แนะนำ)</span>
            <span class="chip">JPEG</span>
          </div>
          <div style="background: rgba(255,255,255,0.08); padding: 18px 22px; border-radius: 16px; display: flex; justify-content: space-between; font-size: 22px;">
            <span>ขนาดความละเอียด:</span>
            <strong style="color: #c9f264;">1024 x 1024 px (HD)</strong>
          </div>
        </div>
        <div class="qr-preview-box">
          <img src="${qrCoral}" class="qr-img" style="width: 360px; height: 360px;" />
          <div class="btn-main">⬇ บันทึกภาพ (PNG 1024px)</div>
          <div class="btn-sub" style="border-color: #0C79D8; color: #0C79D8;">📤 แชร์ไปยัง LINE / Facebook</div>
        </div>
        <div class="grid-2" style="margin-top: 14px;">
          <div class="feature-item"><h3>ป้ายร้านค้า</h3><p>พิมพ์คมชัด ไม่แตก</p></div>
          <div class="feature-item"><h3>เมนูอาหาร</h3><p>สแกนเร็วในแสงน้อย</p></div>
        </div>
      `
    },
    {
      file: 'screen4.html',
      out: 'QR_LAB_Screenshot_4.png',
      badge: '🔒 ปลอดภัยและเป็นส่วนตัว',
      title: 'สแกนได้ตลอดชีพ ไม่มีวันหมดอายุ',
      sub: 'ประมวลผลบนเครื่อง 100% ไม่ต้องสมัครสมาชิก ปลอดภัยสูงสุด',
      content: `
        <div class="card" style="background: linear-gradient(145deg, #0f365d, #07172F); border-color: rgba(104,196,255,0.3);">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #c9f264; color: #07172F; display: grid; place-items: center; font-size: 32px; font-weight: 700;">✓</div>
            <div>
              <div style="font-size: 28px; font-weight: 700;">ใช้งานฟรี 100%</div>
              <div style="font-size: 20px; color: rgba(255,255,255,0.7);">ไม่มีค่าบริการแอบแฝง สแกนได้ไม่จำกัด</div>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px;">
          <div class="feature-item" style="text-align: left; display: flex; align-items: center; gap: 18px;">
            <span style="font-size: 36px;">🔒</span>
            <div><h3 style="font-size: 24px;">ความเป็นส่วนตัวสูงสุด</h3><p style="font-size: 18px;">ข้อมูลไม่ถูกส่งไปยังเซิร์ฟเวอร์ภายนอก</p></div>
          </div>
          <div class="feature-item" style="text-align: left; display: flex; align-items: center; gap: 18px;">
            <span style="font-size: 36px;">♾️</span>
            <div><h3 style="font-size: 24px;">QR Code แบบถาวร</h3><p style="font-size: 18px;">สร้างครั้งเดียว สแกนได้ตลอดกาล</p></div>
          </div>
          <div class="feature-item" style="text-align: left; display: flex; align-items: center; gap: 18px;">
            <span style="font-size: 36px;">⭐</span>
            <div><h3 style="font-size: 24px;">ตัวเลือกปิดโฆษณาถาวร</h3><p style="font-size: 18px;">สนับสนุนผู้พัฒนา ปลดล็อกประสบการณ์ไร้โฆษณา</p></div>
          </div>
        </div>
        <div class="card" style="margin-top: 10px; text-align: center; border-color: rgba(201,242,100,0.3);">
          <div style="font-size: 26px; font-weight: 700; color: #c9f264; margin-bottom: 8px;">QR LAB</div>
          <div style="font-size: 20px; color: rgba(255,255,255,0.7);">เครื่องมือสร้าง QR Code ที่คุณวางใจได้</div>
        </div>
      `
    }
  ];

  const server = http.createServer((req, res) => {
    const urlName = req.url.replace('/', '');
    const found = screens.find(s => s.file === urlName);
    if (found) {
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${cssHead}</style></head><body><div class="header"><span class="badge">${found.badge}</span><h1 class="title">${found.title}</h1><p class="subtitle">${found.sub}</p></div><div class="phone-wrapper"><div class="phone"><div class="notch"></div>${found.content}</div></div></body></html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(8925, async () => {
    console.log('Rendering 4 screenshots via headless Chrome...');
    const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    for (const sc of screens) {
      const targetPath = 'C:\\Users\\oate_\\Desktop\\' + sc.out;
      const args = [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--window-size=1080,1920',
        '--screenshot=' + targetPath,
        'http://localhost:8925/' + sc.file
      ];
      await new Promise((resolve) => {
        execFile(chrome, args, (err) => {
          if (err) console.error('Error on', sc.out, err);
          else console.log('Generated:', targetPath);
          resolve();
        });
      });
    }
    server.close();
    console.log('All 4 screenshots generated successfully on Desktop!');
  });
}

buildScreenshots();
