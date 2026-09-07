import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.susuoate.qrlab',
  appName: 'QR Code Maker',
  webDir: 'mobile-dist',
  android: {
    backgroundColor: '#07172f',
  },
  ios: {
    backgroundColor: '#07172f',
    contentInset: 'automatic',
  },
};

export default config;
