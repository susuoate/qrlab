import { readFile } from 'node:fs/promises';

const errors = [];
const checkAndroid = !process.argv.includes('--ios');
const checkIos = !process.argv.includes('--android');

const requiredEnvironment = [];
if (checkIos) {
  requiredEnvironment.push(
    ['VITE_REVENUECAT_IOS_API_KEY', /^appl_/],
    ['VITE_ADMOB_IOS_BANNER_ID', /^ca-app-pub-\d{16}\/\d{10}$/],
  );
}
if (checkAndroid) {
  requiredEnvironment.push(
    ['VITE_REVENUECAT_ANDROID_API_KEY', /^goog_/],
    ['VITE_ADMOB_ANDROID_BANNER_ID', /^ca-app-pub-\d{16}\/\d{10}$/],
  );
}

for (const [name, pattern] of requiredEnvironment) {
  const value = process.env[name]?.trim() ?? '';
  if (!pattern.test(value)) errors.push(`${name} ยังไม่ได้ตั้งค่าหรือรูปแบบไม่ถูกต้อง`);
  if (value.includes('3940256099942544')) errors.push(`${name} ยังเป็น Google Test ID`);
}

if (process.env.VITE_ADMOB_TEST_MODE !== 'false') {
  errors.push('VITE_ADMOB_TEST_MODE ต้องเป็น false สำหรับ release');
}

if (checkAndroid) {
  const androidStrings = await readFile(new URL('../android/app/src/main/res/values/strings.xml', import.meta.url), 'utf8');
  if (androidStrings.includes('3940256099942544')) {
    errors.push('Android admob_app_id ยังเป็น Google Test App ID');
  }
}

if (checkIos) {
  const iosPlist = await readFile(new URL('../ios/App/App/Info.plist', import.meta.url), 'utf8');
  if (iosPlist.includes('3940256099942544')) {
    errors.push('iOS GADApplicationIdentifier ยังเป็น Google Test App ID');
  }
}

if (errors.length > 0) {
  console.error(`Monetization release check failed (${checkAndroid && checkIos ? 'All' : checkAndroid ? 'Android' : 'iOS'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Monetization release configuration is ready (${checkAndroid && checkIos ? 'All' : checkAndroid ? 'Android' : 'iOS'}).`);
}
