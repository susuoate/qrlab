/**
 * Standards-compliant Thai PromptPay QR (EMVCo Merchant-Presented QR Code)
 * Specifications:
 * - AID: A000000677010111
 * - Currency: 764 (THB)
 * - Country: TH
 * - Checksum: CRC-16 CCITT (0x1021, init 0xFFFF)
 */

function formatTlv(tag: string, value: string): string {
  const tagStr = tag.padStart(2, '0');
  const lengthStr = value.length.toString().padStart(2, '0');
  return `${tagStr}${lengthStr}${value}`;
}

export function crc16Ccitt(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function sanitizeTarget(raw: string): string {
  return raw.replace(/[^0-9]/g, '');
}

export function formatTargetMobile(rawNumber: string): string {
  const digits = sanitizeTarget(rawNumber);
  // e.g. 0812345678 -> 0066812345678
  if (digits.length === 10 && digits.startsWith('0')) {
    return `0066${digits.slice(1)}`;
  }
  if (digits.length === 9) {
    return `0066${digits}`;
  }
  if (digits.startsWith('66') && digits.length === 11) {
    return `00${digits}`;
  }
  return digits;
}

export interface PromptPayOptions {
  type: 'mobile' | 'nationalId';
  target: string;
  amount?: number | string;
}

export function generatePromptPayPayload(options: PromptPayOptions): string {
  const rawTarget = sanitizeTarget(options.target);
  let subTag = '01';
  let formattedTarget = '';

  if (options.type === 'mobile') {
    subTag = '01';
    formattedTarget = formatTargetMobile(rawTarget);
    if (formattedTarget.length !== 13) {
      throw new Error('เบอร์มือถือพร้อมเพย์ต้องมี 10 หลัก (เช่น 0812345678)');
    }
  } else {
    subTag = '02';
    formattedTarget = rawTarget;
    if (formattedTarget.length !== 13) {
      throw new Error('เลขประจำตัวประชาชนหรือเลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก');
    }
  }

  const parsedAmount = typeof options.amount === 'string' ? parseFloat(options.amount) : options.amount;
  const hasAmount = typeof parsedAmount === 'number' && !isNaN(parsedAmount) && parsedAmount > 0;

  // Tag 00: Payload Format Indicator (01)
  const tag00 = formatTlv('00', '01');

  // Tag 01: Point of Initiation Method (11: Static, 12: Dynamic)
  const tag01 = formatTlv('01', hasAmount ? '12' : '11');

  // Tag 29: Merchant Account Information - PromptPay
  const aid = formatTlv('00', 'A000000677010111');
  const targetTlv = formatTlv(subTag, formattedTarget);
  const tag29 = formatTlv('29', `${aid}${targetTlv}`);

  // Tag 53: Transaction Currency (764 = THB)
  const tag53 = formatTlv('53', '764');

  // Tag 54: Transaction Amount (optional)
  const tag54 = hasAmount ? formatTlv('54', parsedAmount.toFixed(2)) : '';

  // Tag 58: Country Code (TH)
  const tag58 = formatTlv('58', 'TH');

  // Assemble before checksum
  const partial = `${tag00}${tag01}${tag29}${tag53}${tag54}${tag58}6304`;
  const checksum = crc16Ccitt(partial);

  return `${partial}${checksum}`;
}
