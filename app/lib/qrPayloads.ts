import type { SocialForm, VCardForm, WifiForm } from './types';

function escapeWifiString(str: string): string {
  return str.replace(/([\\;,":])/g, '\\$1');
}

export function generateWifiPayload(form: WifiForm): string {
  const ssid = form.ssid.trim();
  if (!ssid) throw new Error('กรุณาระบุชื่อ Wi-Fi (SSID)');

  const escapedSsid = escapeWifiString(ssid);
  const hiddenFlag = form.hidden ? 'H:true;' : '';

  if (form.encryption === 'nopass') {
    return `WIFI:T:nopass;S:${escapedSsid};${hiddenFlag};`;
  }

  const password = form.password.trim();
  if (!password) {
    throw new Error('กรุณาระบุรหัสผ่าน Wi-Fi');
  }

  const escapedPass = escapeWifiString(password);
  return `WIFI:T:${form.encryption};S:${escapedSsid};P:${escapedPass};${hiddenFlag};`;
}

export function generateSocialPayload(form: SocialForm): string {
  const raw = form.username.trim();
  if (!raw) throw new Error('กรุณาระบุไอดีหรือชื่อผู้ใช้');

  // If user already typed a full URL, return it
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const clean = raw.replace(/^@/, '');

  switch (form.platform) {
    case 'line':
      // Support @ for Line Official Account or normal id
      if (raw.startsWith('@')) {
        return `https://page.line.me/${clean}`;
      }
      return `https://line.me/ti/p/~${encodeURIComponent(clean)}`;
    case 'facebook':
      return `https://facebook.com/${encodeURIComponent(clean)}`;
    case 'instagram':
      return `https://instagram.com/${encodeURIComponent(clean)}`;
    case 'tiktok':
      return `https://tiktok.com/@${encodeURIComponent(clean)}`;
    case 'youtube':
      return `https://youtube.com/@${encodeURIComponent(clean)}`;
    default:
      return raw;
  }
}

function escapeVCard(str: string): string {
  return str.replace(/([\\;,])/g, '\\$1');
}

export function generateVCardPayload(form: VCardForm): string {
  const fn = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
  if (!fn && !form.phone.trim()) {
    throw new Error('กรุณากรอกชื่อหรือเบอร์โทรศัพท์อย่างน้อยหนึ่งอย่าง');
  }

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCard(form.lastName.trim())};${escapeVCard(form.firstName.trim())};;;`,
    `FN:${escapeVCard(fn || form.phone.trim())}`,
  ];

  if (form.phone.trim()) {
    lines.push(`TEL;TYPE=CELL:${form.phone.trim()}`);
  }
  if (form.email.trim()) {
    lines.push(`EMAIL:${form.email.trim()}`);
  }
  if (form.organization.trim()) {
    lines.push(`ORG:${escapeVCard(form.organization.trim())}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

export function generateTelPayload(rawPhone: string): string {
  const cleaned = rawPhone.trim().replace(/\s+/g, '');
  if (!cleaned) throw new Error('กรุณาระบุเบอร์โทรศัพท์');
  return `tel:${cleaned}`;
}
