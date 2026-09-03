import assert from 'node:assert/strict';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { generatePromptPayPayload, crc16Ccitt } from '../app/lib/promptpay.ts';
import { generateWifiPayload, generateSocialPayload, generateVCardPayload } from '../app/lib/qrPayloads.ts';

console.log('=== Running QR LAB Features Automated Tests ===\n');

// 1. PromptPay Tests
console.log('--- 1. Testing PromptPay Generation & CRC16 ---');
const ppMobileNoAmount = generatePromptPayPayload({
  type: 'mobile',
  target: '0812345678',
});
assert.match(ppMobileNoAmount, /^00020101021129370016A0000006770101110113006681234567853037645802TH6304[A-F0-9]{4}$/);
console.log('PASS: Mobile PromptPay payload without amount correctly formatted');

const ppMobileWithAmount = generatePromptPayPayload({
  type: 'mobile',
  target: '0812345678',
  amount: '150.00',
});
assert.match(ppMobileWithAmount, /^00020101021229370016A0000006770101110113006681234567853037645406150\.005802TH6304[A-F0-9]{4}$/);
console.log('PASS: Mobile PromptPay payload with amount correctly formatted');

const ppNationalId = generatePromptPayPayload({
  type: 'nationalId',
  target: '1234567890123',
  amount: 50,
});
assert.match(ppNationalId, /^00020101021229370016A000000677010111021312345678901235303764540550\.005802TH6304[A-F0-9]{4}$/);
console.log('PASS: National ID PromptPay payload correctly formatted');

// Verify Checksum recalculation
const withoutChecksum = ppMobileWithAmount.slice(0, -4);
const expectedChecksum = ppMobileWithAmount.slice(-4);
assert.equal(crc16Ccitt(withoutChecksum), expectedChecksum, 'CRC16 mismatch');
console.log('PASS: PromptPay CRC16 Checksum mathematically verified');

// 2. Wi-Fi Tests
console.log('\n--- 2. Testing Wi-Fi Payload Generation ---');
const wifiWpa = generateWifiPayload({
  ssid: 'CoffeeShop_Free',
  password: 'Password123;',
  encryption: 'WPA',
  hidden: false,
});
assert.equal(wifiWpa, 'WIFI:T:WPA;S:CoffeeShop_Free;P:Password123\\;;;');
console.log('PASS: WPA Wi-Fi payload with escaped special characters');

const wifiNoPassHidden = generateWifiPayload({
  ssid: 'HiddenLounge',
  password: '',
  encryption: 'nopass',
  hidden: true,
});
assert.equal(wifiNoPassHidden, 'WIFI:T:nopass;S:HiddenLounge;H:true;;');
console.log('PASS: Hidden Open Wi-Fi payload');

// 3. Social & vCard Tests
console.log('\n--- 3. Testing Social & vCard Payloads ---');
const lineUrl = generateSocialPayload({ platform: 'line', username: 'shop_official' });
assert.equal(lineUrl, 'https://line.me/ti/p/~shop_official');

const lineOaUrl = generateSocialPayload({ platform: 'line', username: '@mybrand' });
assert.equal(lineOaUrl, 'https://page.line.me/mybrand');

const fbUrl = generateSocialPayload({ platform: 'facebook', username: 'qrlabth' });
assert.equal(fbUrl, 'https://facebook.com/qrlabth');
console.log('PASS: Social platforms generated');

const vCard = generateVCardPayload({
  firstName: 'Somchai',
  lastName: 'Deejai',
  phone: '0812345678',
  email: 'somchai@example.com',
  organization: 'QR LAB',
});
assert.match(vCard, /BEGIN:VCARD/);
assert.match(vCard, /FN:Somchai Deejai/);
assert.match(vCard, /TEL;TYPE=CELL:0812345678/);
assert.match(vCard, /END:VCARD/);
console.log('PASS: vCard payload correctly generated');

// 4. End-to-End Decoding via jsQR
console.log('\n--- 4. Testing End-to-End QRCode Matrix & jsQR Decoding ---');
const testPayloads = [
  ppMobileWithAmount,
  wifiWpa,
  lineUrl,
  vCard,
  'https://qrlab-th-public-plato-122b.vercel.app',
];

for (const payload of testPayloads) {
  const qr = QRCode.create(payload, { errorCorrectionLevel: 'H' });
  const moduleCount = qr.modules.size;
  const margin = 4;
  const scale = 8;
  const width = (moduleCount + margin * 2) * scale;
  const data = new Uint8ClampedArray(width * width * 4);
  data.fill(255);

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (!qr.modules.data[r * moduleCount + c]) continue;
      const startX = (c + margin) * scale;
      const startY = (r + margin) * scale;
      for (let y = 0; y < scale; y++) {
        for (let x = 0; x < scale; x++) {
          const idx = ((startY + y) * width + (startX + x)) * 4;
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 255;
        }
      }
    }
  }

  const decoded = jsQR(data, width, width);
  assert.equal(decoded?.data, payload, `Decoded payload did not match original for ${payload.slice(0, 30)}`);
  console.log(`PASS: jsQR successfully decoded ${payload.slice(0, 35)}...`);
}

// 5. SVG Generation Test
console.log('\n--- 5. Testing SVG Generation ---');
const svg = await QRCode.toString('https://example.com', {
  type: 'svg',
  errorCorrectionLevel: 'H',
});
assert.match(svg, /<svg /);
assert.match(svg, /<\/svg>/);
console.log('PASS: SVG generated cleanly');

console.log('\n✅ ALL AUTOMATED TESTS PASSED SUCCESSFULLY!\n');
