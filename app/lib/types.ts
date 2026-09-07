export type QrType = 'url' | 'promptpay' | 'wifi' | 'social' | 'tel' | 'vcard' | 'text' | 'maps' | 'pdf';

export type ImageFormat = 'png' | 'jpeg' | 'svg';

export type Language = 'th' | 'en';

export interface PromptPayForm {
  targetType: 'mobile' | 'nationalId';
  target: string;
  amount: string;
}

export interface WifiForm {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export type SocialPlatform = 'line' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export interface SocialForm {
  platform: SocialPlatform;
  username: string;
}

export interface VCardForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
}

export interface PresetLogo {
  id: string;
  name: string;
  iconSvg: string;
}

export interface LogoConfig {
  type: 'none' | 'preset' | 'custom';
  presetId?: string;
  customDataUri?: string;
}

export interface HistoryItem {
  id: string;
  type: QrType;
  title: string;
  payload: string;
  darkColor: string;
  lightColor: string;
  format: ImageFormat;
  createdAt: number;
}

export type StandTemplate = 'none' | 'promptpay' | 'wifi' | 'menu' | 'custom';

export interface StandConfig {
  template: StandTemplate;
  headerText: string;
  subText: string;
  footerText: string;
}

