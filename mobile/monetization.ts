import { Capacitor } from '@capacitor/core';
import type { CustomerInfo, PurchasesStoreProduct } from '@revenuecat/purchases-capacitor';

export const SUPPORT_PRODUCT_IDS = {
  basic: 'qrlab_supporter_49',
  plus: 'qrlab_supporter_100',
} as const;

const SUPPORT_ENTITLEMENT_ID = 'ad_free';
const productOrder = [SUPPORT_PRODUCT_IDS.basic, SUPPORT_PRODUCT_IDS.plus];
const buildEnv = (import.meta as ImportMeta & {
  readonly env: Record<string, string | undefined>;
}).env;

const fallbackProducts: SupportProduct[] = [
  { id: SUPPORT_PRODUCT_IDS.basic, title: 'Supporter', price: '฿49' },
  { id: SUPPORT_PRODUCT_IDS.plus, title: 'Supporter Plus', price: '฿100' },
];

const testBannerIds = {
  android: 'ca-app-pub-3940256099942544/6300978111',
  ios: 'ca-app-pub-3940256099942544/2934735716',
};

export interface SupportProduct {
  id: string;
  title: string;
  price: string;
}

export interface MonetizationState {
  status: 'loading' | 'free' | 'supporter' | 'unavailable';
  products: SupportProduct[];
  adsVisible: boolean;
  privacyOptionsRequired: boolean;
  message: string;
}

let storeProducts: PurchasesStoreProduct[] = [];
let purchasesConfigured = false;
let adMobInitialized = false;
let bannerVisible = false;
let privacyOptionsRequired = false;
let initializationPromise: Promise<MonetizationState> | undefined;

function getPlatform() {
  const platform = Capacitor.getPlatform();
  return platform === 'ios' || platform === 'android' ? platform : null;
}

function getRevenueCatApiKey() {
  const platform = getPlatform();
  if (platform === 'ios') return buildEnv.VITE_REVENUECAT_IOS_API_KEY?.trim();
  if (platform === 'android') return buildEnv.VITE_REVENUECAT_ANDROID_API_KEY?.trim();
  return undefined;
}

function isTestAdsEnabled() {
  return buildEnv.VITE_ADMOB_TEST_MODE !== 'false';
}

function hasAdFreeAccess(customerInfo: CustomerInfo) {
  return Boolean(customerInfo.entitlements.active[SUPPORT_ENTITLEMENT_ID])
    || productOrder.some((productId) => customerInfo.allPurchasedProductIdentifiers.includes(productId));
}

function toSupportProducts(products: PurchasesStoreProduct[]) {
  return productOrder.map((productId) => {
    const product = products.find((item) => item.identifier === productId);
    const fallback = fallbackProducts.find((item) => item.id === productId)!;
    return product
      ? { id: product.identifier, title: product.title || fallback.title, price: product.priceString }
      : fallback;
  });
}

async function configurePurchases() {
  if (purchasesConfigured) return;
  const apiKey = getRevenueCatApiKey();
  if (!apiKey) throw new Error('missing-store-configuration');

  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  await Purchases.configure({
    apiKey,
    appUserID: null,
    diagnosticsEnabled: false,
    automaticDeviceIdentifierCollectionEnabled: false,
  });
  purchasesConfigured = true;
}

async function hideBanner() {
  if (!bannerVisible) return;
  const { AdMob } = await import('@capacitor-community/admob');
  await AdMob.removeBanner();
  bannerVisible = false;
}

async function showBanner() {
  const platform = getPlatform();
  if (!platform || bannerVisible) return bannerVisible;

  const {
    AdMob,
    AdmobConsentStatus,
    BannerAdPosition,
    BannerAdSize,
  } = await import('@capacitor-community/admob');

  if (!adMobInitialized) {
    await AdMob.initialize({ initializeForTesting: isTestAdsEnabled() });
    adMobInitialized = true;
  }

  let consentInfo = await AdMob.requestConsentInfo();
  if (consentInfo.status === AdmobConsentStatus.REQUIRED && consentInfo.isConsentFormAvailable) {
    consentInfo = await AdMob.showConsentForm();
  }

  privacyOptionsRequired = consentInfo.privacyOptionsRequirementStatus === 'REQUIRED';
  if (!consentInfo.canRequestAds) return false;

  const configuredBannerId = platform === 'ios'
    ? buildEnv.VITE_ADMOB_IOS_BANNER_ID?.trim()
    : buildEnv.VITE_ADMOB_ANDROID_BANNER_ID?.trim();
  const isTesting = isTestAdsEnabled() || !configuredBannerId;

  await AdMob.showBanner({
    adId: configuredBannerId || testBannerIds[platform],
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting,
    npa: true,
    margin: 0,
  });
  bannerVisible = true;
  return true;
}

function createState(
  status: MonetizationState['status'],
  message: string,
  products = toSupportProducts(storeProducts),
): MonetizationState {
  return {
    status,
    products,
    adsVisible: bannerVisible,
    privacyOptionsRequired,
    message,
  };
}

async function loadMonetization(): Promise<MonetizationState> {
  if (!Capacitor.isNativePlatform()) {
    return createState('unavailable', 'ระบบสนับสนุนมีเฉพาะแอป iOS และ Android');
  }

  if (!getRevenueCatApiKey()) {
    if (isTestAdsEnabled()) await showBanner();
    return createState('unavailable', 'กำลังใช้โหมดทดสอบ กรุณาเชื่อมต่อ Store ก่อนเปิดรับการสนับสนุน');
  }

  try {
    await configurePurchases();
    const { PRODUCT_CATEGORY, Purchases } = await import('@revenuecat/purchases-capacitor');
    const [{ customerInfo }, productResult] = await Promise.all([
      Purchases.getCustomerInfo(),
      Purchases.getProducts({
        productIdentifiers: productOrder,
        type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
      }),
    ]);
    storeProducts = productResult.products;

    if (hasAdFreeAccess(customerInfo)) {
      await hideBanner();
      return createState('supporter', 'ปลดล็อกไม่มีโฆษณาถาวรแล้ว ขอบคุณที่สนับสนุน QR LAB');
    }

    await showBanner();
    if (storeProducts.length !== productOrder.length) {
      return createState('unavailable', 'ยังไม่พบสินค้าครบใน Store กรุณาตรวจ Product ID');
    }
    return createState('free', 'ซื้อครั้งเดียวเพื่อปิดโฆษณาถาวร');
  } catch {
    await hideBanner();
    return createState('unavailable', 'เชื่อมต่อ Store ไม่สำเร็จ กรุณาลองใหม่ภายหลัง');
  }
}

export function initializeMonetization() {
  initializationPromise ??= loadMonetization();
  return initializationPromise;
}

export async function purchaseSupport(productId: string) {
  await configurePurchases();
  const product = storeProducts.find((item) => item.identifier === productId);
  if (!product) throw new Error('product-unavailable');

  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  const { customerInfo } = await Purchases.purchaseStoreProduct({ product });
  if (!hasAdFreeAccess(customerInfo)) throw new Error('entitlement-not-active');

  await hideBanner();
  return createState('supporter', 'ปลดล็อกไม่มีโฆษณาถาวรแล้ว ขอบคุณที่สนับสนุน QR LAB');
}

export async function restoreSupport() {
  await configurePurchases();
  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  const { customerInfo } = await Purchases.restorePurchases();

  if (hasAdFreeAccess(customerInfo)) {
    await hideBanner();
    return createState('supporter', 'กู้คืนสิทธิ์สำเร็จ แอปไม่มีโฆษณาถาวรแล้ว');
  }

  await showBanner();
  return createState('free', 'ไม่พบรายการซื้อที่กู้คืนได้ในบัญชี Store นี้');
}

export async function showAdPrivacyOptions() {
  const { AdMob } = await import('@capacitor-community/admob');
  await AdMob.showPrivacyOptionsForm();
}
