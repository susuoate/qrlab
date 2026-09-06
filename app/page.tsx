'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import HistoryModal from './components/HistoryModal';
import LogoSelector from './components/LogoSelector';
import QrScannerModal from './components/QrScannerModal';
import { clearAllHistory, deleteHistoryItem, getHistory, saveHistoryItem } from './lib/history';
import { translations } from './lib/i18n';
import { PRESET_LOGOS } from './lib/presetLogos';
import { generatePromptPayPayload } from './lib/promptpay';
import {
  generateSocialPayload,
  generateTelPayload,
  generateVCardPayload,
  generateWifiPayload,
} from './lib/qrPayloads';
import type {
  HistoryItem,
  ImageFormat,
  Language,
  LogoConfig,
  PromptPayForm,
  QrType,
  SocialForm,
  VCardForm,
  WifiForm,
} from './lib/types';
import SupportPanel from '../mobile/SupportPanel';
import SidebarAd from './components/SidebarAd';
import AdSenseBanner from './components/AdSenseBanner';

const colorChoices = ['#123B3A', '#196B62', '#215391', '#20232B', '#702D54'];

const quickLinks = [
  { label: 'เว็บไซต์', value: 'https://example.com' },
  { label: 'Facebook', value: 'https://facebook.com/' },
  { label: 'YouTube', value: 'https://youtube.com/' },
];

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(candidate);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid');
  return parsed.toString();
}

export default function Home({
  mobileApp = false,
  initialQrType = 'url',
  initialScannerOpen = false,
}: {
  mobileApp?: boolean;
  initialQrType?: QrType;
  initialScannerOpen?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lang, setLang] = useState<Language>('th');
  const t = translations[lang];

  // QR Type & payloads
  const [qrType, setQrType] = useState<QrType>(initialQrType);
  const [url, setUrl] = useState('https://example.com');
  const [promptPayForm, setPromptPayForm] = useState<PromptPayForm>({
    targetType: 'mobile',
    target: '0812345678',
    amount: '',
  });
  const [wifiForm, setWifiForm] = useState<WifiForm>({
    ssid: 'MyHome_WiFi',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [socialForm, setSocialForm] = useState<SocialForm>({
    platform: 'line',
    username: '',
  });
  const [telNumber, setTelNumber] = useState('');
  const [vCardForm, setVCardForm] = useState<VCardForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
  });
  const [textContent, setTextContent] = useState('');

  // Styling & Export options
  const [darkColor, setDarkColor] = useState(colorChoices[0]);
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [size, setSize] = useState(720);
  const [imageFormat, setImageFormat] = useState<ImageFormat>('png');
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({ type: 'none' });

  // State
  const [activePayload, setActivePayload] = useState('https://example.com/');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(initialScannerOpen);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load language and history: Auto-detect English for international users unless Thai is detected or saved
  useEffect(() => {
    try {
      // 1. Check URL query parameter first (?lang=en or ?lang=th)
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const urlLang = searchParams.get('lang');
        if (urlLang === 'th' || urlLang === 'en') {
          setLang(urlLang);
          window.localStorage.setItem('qrlab_lang', urlLang);
          document.documentElement.lang = urlLang;
          setHistoryItems(getHistory());
          return;
        }

        // 2. Check saved user preference in localStorage
        const savedLang = window.localStorage.getItem('qrlab_lang') as Language;
        if (savedLang === 'th' || savedLang === 'en') {
          setLang(savedLang);
          document.documentElement.lang = savedLang;
          setHistoryItems(getHistory());
          return;
        }

        // 3. Auto-detect user: if user is not Thai, default to English ('en')
        const userLangs: string[] = [];
        if (typeof navigator !== 'undefined') {
          if (navigator.language) userLangs.push(navigator.language.toLowerCase());
          if (Array.isArray(navigator.languages)) {
            navigator.languages.forEach((l) => {
              if (l) userLangs.push(l.toLowerCase());
            });
          }
        }

        const isThaiLanguage = userLangs.some(
          (l) => l === 'th' || l.startsWith('th-') || l === 'th_th'
        );

        let isThaiTimeZone = false;
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz && tz.toLowerCase().includes('bangkok')) {
            isThaiTimeZone = true;
          }
        } catch {
          // Ignore
        }

        // If Thai language or Thai timezone, use 'th'; otherwise default to 'en'
        const detectedLang: Language = (isThaiLanguage || isThaiTimeZone) ? 'th' : 'en';
        setLang(detectedLang);
        document.documentElement.lang = detectedLang;
      }
    } catch {
      // Ignore
    }
    setHistoryItems(getHistory());
  }, []);

  const changeLanguage = (nextLang: Language) => {
    setLang(nextLang);
    try {
      window.localStorage.setItem('qrlab_lang', nextLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = nextLang;
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    void import('@capacitor/core').then(({ Capacitor }) => {
      setIsNativeApp(Capacitor.isNativePlatform());
    });
  }, []);

  // Compute active payload based on active QR type
  useEffect(() => {
    try {
      setError('');
      let payload = '';

      switch (qrType) {
        case 'url': {
          const nextUrl = normalizeUrl(url);
          if (!nextUrl) {
            setError(lang === 'th' ? 'กรุณาใส่ URL เว็บไซต์' : 'Please enter a URL');
            return;
          }
          payload = nextUrl;
          break;
        }
        case 'promptpay': {
          payload = generatePromptPayPayload({
            type: promptPayForm.targetType,
            target: promptPayForm.target,
            amount: promptPayForm.amount ? Number(promptPayForm.amount) : undefined,
          });
          break;
        }
        case 'wifi': {
          payload = generateWifiPayload(wifiForm);
          break;
        }
        case 'social': {
          payload = generateSocialPayload(socialForm);
          break;
        }
        case 'tel': {
          payload = generateTelPayload(telNumber);
          break;
        }
        case 'vcard': {
          payload = generateVCardPayload(vCardForm);
          break;
        }
        case 'text': {
          if (!textContent.trim()) {
            setError(lang === 'th' ? 'กรุณาพิมพ์ข้อความที่ต้องการเข้ารหัส' : 'Please enter text to encode');
            return;
          }
          payload = textContent.trim();
          break;
        }
      }

      setActivePayload(payload);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(lang === 'th' ? 'ข้อมูลไม่ถูกต้อง' : 'Invalid input');
      }
    }
  }, [qrType, url, promptPayForm, wifiForm, socialForm, telNumber, vCardForm, textContent, lang]);

  // Render QR Code + Center Logo to Canvas
  const renderQr = useCallback(
    async (value: string, target?: HTMLCanvasElement) => {
      const canvas = target ?? canvasRef.current;
      if (!canvas || !value) return;

      const targetSize = target ? size : 320;
      await QRCode.toCanvas(canvas, value, {
        width: targetSize,
        margin: 3,
        errorCorrectionLevel: 'H',
        color: { dark: darkColor, light: imageFormat === 'jpeg' ? '#FFFFFF' : lightColor },
      });

      // Composite Center Logo if configured
      if (logoConfig.type !== 'none') {
        const logoSrc =
          logoConfig.type === 'preset'
            ? PRESET_LOGOS.find((p) => p.id === logoConfig.presetId)?.iconSvg
            : logoConfig.customDataUri;

        if (logoSrc) {
          try {
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = logoSrc;
            });

            const ctx = canvas.getContext('2d');
            if (ctx) {
              const canvasWidth = canvas.width;
              const logoSize = Math.round(canvasWidth * 0.22);
              const logoX = Math.round((canvasWidth - logoSize) / 2);
              const logoY = Math.round((canvasWidth - logoSize) / 2);
              const padding = Math.max(4, Math.round(logoSize * 0.15));
              const bgSize = logoSize + padding * 2;
              const bgX = logoX - padding;
              const bgY = logoY - padding;
              const radius = Math.max(6, Math.round(bgSize * 0.22));

              ctx.save();
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(bgX, bgY, bgSize, bgSize, radius);
              } else {
                ctx.rect(bgX, bgY, bgSize, bgSize);
              }
              ctx.fill();
              ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
              ctx.restore();
            }
          } catch {
            // If image fails to load, fallback to plain QR
          }
        }
      }
    },
    [darkColor, imageFormat, lightColor, logoConfig, size]
  );

  // Re-render when active payload or styles change
  useEffect(() => {
    if (activePayload && !error) {
      void renderQr(activePayload);
    }
  }, [activePayload, error, renderQr]);

  // Generate SVG string with embedded logo
  const generateSvgString = async (value: string): Promise<string> => {
    const rawSvg = await QRCode.toString(value, {
      type: 'svg',
      width: size,
      margin: 3,
      errorCorrectionLevel: 'H',
      color: {
        dark: darkColor,
        light: lightColor === '#00000000' ? '#00000000' : lightColor,
      },
    });

    if (logoConfig.type === 'none') {
      return rawSvg;
    }

    const logoSrc =
      logoConfig.type === 'preset'
        ? PRESET_LOGOS.find((p) => p.id === logoConfig.presetId)?.iconSvg
        : logoConfig.customDataUri;

    if (!logoSrc) return rawSvg;

    const logoSize = Math.round(size * 0.22);
    const logoX = Math.round((size - logoSize) / 2);
    const logoY = Math.round((size - logoSize) / 2);
    const padding = Math.max(4, Math.round(logoSize * 0.15));
    const bgSize = logoSize + padding * 2;
    const bgX = logoX - padding;
    const bgY = logoY - padding;
    const radius = Math.max(6, Math.round(bgSize * 0.22));

    const logoSvgGroup = `
      <g id="center-logo">
        <rect x="${bgX}" y="${bgY}" width="${bgSize}" height="${bgSize}" rx="${radius}" fill="#FFFFFF" />
        <image href="${logoSrc}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />
      </g>
    `;

    return rawSvg.replace('</svg>', `${logoSvgGroup}</svg>`);
  };

  const downloadQr = async () => {
    if (error || !activePayload) return;

    // Save to history
    const itemTitle =
      qrType === 'url'
        ? url
        : qrType === 'promptpay'
        ? `PromptPay: ${promptPayForm.target}`
        : qrType === 'wifi'
        ? `Wi-Fi: ${wifiForm.ssid}`
        : qrType === 'social'
        ? `${socialForm.platform}: ${socialForm.username}`
        : qrType === 'tel'
        ? `Tel: ${telNumber}`
        : qrType === 'vcard'
        ? `Contact: ${vCardForm.firstName} ${vCardForm.lastName}`
        : `Text: ${textContent.slice(0, 20)}`;

    const updatedHistory = saveHistoryItem({
      type: qrType,
      title: itemTitle,
      payload: activePayload,
      darkColor,
      lightColor,
      format: imageFormat,
    });
    setHistoryItems(updatedHistory);

    if (imageFormat === 'svg') {
      const svgString = await generateSvgString(activePayload);
      const fileName = `qrlab-${qrType}.svg`;

      if (isNativeApp) {
        const [{ Directory, Filesystem }, { Share }, { Haptics, ImpactStyle }] = await Promise.all([
          import('@capacitor/filesystem'),
          import('@capacitor/share'),
          import('@capacitor/haptics'),
        ]);
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: btoa(unescape(encodeURIComponent(svgString))),
          directory: Directory.Cache,
        });
        await Haptics.impact({ style: ImpactStyle.Light });
        await Share.share({
          title: 'QR LAB',
          text: activePayload,
          url: savedFile.uri,
          dialogTitle: lang === 'th' ? 'บันทึกหรือแชร์ SVG' : 'Save or Share SVG',
        });
      } else {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = fileName;
        anchor.href = objectUrl;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
    } else {
      const exportCanvas = document.createElement('canvas');
      await renderQr(activePayload, exportCanvas);
      const isJpeg = imageFormat === 'jpeg';
      const fileName = `qrlab-${qrType}.${isJpeg ? 'jpg' : 'png'}`;
      const mimeType = isJpeg ? 'image/jpeg' : 'image/png';

      if (isNativeApp) {
        const dataUrl = exportCanvas.toDataURL(mimeType, 0.95);
        const [{ Directory, Filesystem }, { Share }, { Haptics, ImpactStyle }] = await Promise.all([
          import('@capacitor/filesystem'),
          import('@capacitor/share'),
          import('@capacitor/haptics'),
        ]);
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: dataUrl.split(',')[1],
          directory: Directory.Cache,
        });
        await Haptics.impact({ style: ImpactStyle.Light });
        await Share.share({
          title: 'QR LAB',
          text: activePayload,
          url: savedFile.uri,
          dialogTitle: lang === 'th' ? 'บันทึกหรือแชร์ QR Code' : 'Save or Share QR Code',
        });
      } else {
        const blob = await new Promise<Blob>((resolve, reject) => {
          exportCanvas.toBlob(
            (result) => (result ? resolve(result) : reject(new Error('export-failed'))),
            mimeType,
            0.95
          );
        });
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = fileName;
        anchor.href = objectUrl;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
    }

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1800);
  };

  const copyPayload = async () => {
    if (!activePayload) return;
    await navigator.clipboard.writeText(activePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const testLink = () => {
    if (!activePayload) return;
    if (/^https?:\/\//i.test(activePayload)) {
      window.open(activePayload, '_blank', 'noopener,noreferrer');
    } else if (/^tel:/i.test(activePayload)) {
      window.open(activePayload, '_self');
    } else {
      alert(
        lang === 'th'
          ? `ข้อมูลสำหรับสแกน:\n\n${activePayload}`
          : `Encoded payload:\n\n${activePayload}`
      );
    }
  };

  const handleUseScannedInMaker = (scannedText: string) => {
    const trimmed = scannedText.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      setQrType('url');
      setUrl(trimmed);
    } else if (trimmed.startsWith('WIFI:')) {
      setQrType('wifi');
      // Parse SSID if possible
      const ssidMatch = trimmed.match(/S:([^;]+);/);
      if (ssidMatch) setWifiForm((prev) => ({ ...prev, ssid: ssidMatch[1] }));
    } else if (trimmed.startsWith('tel:')) {
      setQrType('tel');
      setTelNumber(trimmed.replace('tel:', ''));
    } else if (trimmed.startsWith('000201')) {
      setQrType('promptpay');
    } else {
      setQrType('text');
      setTextContent(trimmed);
    }
  };

  const handleFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'BUTTON') {
      const input = e.currentTarget.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
      if (input) input.focus();
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setQrType(item.type);
    setDarkColor(item.darkColor);
    setLightColor(item.lightColor);
    setImageFormat(item.format);

    if (item.type === 'url') setUrl(item.payload);
    else if (item.type === 'text') setTextContent(item.payload);
    else if (item.type === 'tel') setTelNumber(item.payload.replace('tel:', ''));
    else setActivePayload(item.payload);

    setIsHistoryOpen(false);
  };

  const isLinkType = qrType === 'url' || qrType === 'social' || /^https?:\/\//i.test(activePayload);

  return (
    <main className={mobileApp ? 'native-app' : undefined}>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="QR lab QR CODE generator">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{t.brand}</span>
          </a>

          <nav aria-label="เมนูหลัก">
            <button
              type="button"
              className="nav-action-btn"
              onClick={() => setIsScannerOpen(true)}
            >
              📷 {t.navScanner}
            </button>
            <button
              type="button"
              className="nav-action-btn"
              onClick={() => setIsHistoryOpen(true)}
            >
              🕒 {t.navHistory}
            </button>
            <a href="#how">{t.navHow}</a>
            <a href="#features">{t.navFeatures}</a>
            <a href="#faq">{t.navFaq}</a>
          </nav>

          <div className="header-right-controls">
            <div className="lang-switcher">
              <button
                type="button"
                className={`lang-btn ${lang === 'th' ? 'active' : ''}`}
                onClick={() => changeLanguage('th')}
              >
                TH
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>

            <a className="header-cta" href="#generator">
              {t.ctaCreate} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-orb orb-one" aria-hidden="true" />
        <div className="hero-orb orb-two" aria-hidden="true" />
        <div className="hero-center-header">
          <span className="eyebrow">
            <i aria-hidden="true" /> {t.brand} — {t.tagline}
          </span>
          <h1>
            {lang === 'th' ? (
              <>
                ทำ QR Code ฟรี <span>สร้างง่ายนิดเดียว.</span>
              </>
            ) : (
              <>
                Free QR Code Generator &amp; <span>Maker.</span>
              </>
            )}
          </h1>
          <p>{t.heroDesc}</p>

          <div className="hero-action-buttons">
            <a className="hero-link" href="#generator">
              {t.ctaCreate} <span aria-hidden="true">↓</span>
            </a>
            <button
              type="button"
              className="hero-scan-btn"
              onClick={() => setIsScannerOpen(true)}
            >
              📷 {t.ctaScan}
            </button>
          </div>

          <div className="trust-row" aria-label="จุดเด่น">
            <span>
              <i aria-hidden="true">✓</i> {t.noWatermark}
            </span>
            <span>
              <i aria-hidden="true">✓</i> {t.noExpiry}
            </span>
            <span>
              <i aria-hidden="true">✓</i> {t.noDataCollect}
            </span>
          </div>
        </div>

        <div className="hero-studio-layout">
          {!mobileApp && (
            <SidebarAd side="left" label={lang === 'th' ? 'โฆษณา' : 'SPONSORED'} />
          )}

          <div className="generator-shell" id="generator">
            <div className="generator-head">
              <div>
                <span className="section-kicker">QR CODE MAKER &amp; GENERATOR</span>
                <h2>QR lab Studio</h2>
              </div>
              <span className="live-badge">
                <i /> {t.badgeLive}
              </span>
            </div>

            {/* QR Type Tabs */}
            <div className="type-tabs" role="tablist" aria-label="เลือกประเภท QR Code">
              <button
                type="button"
                role="tab"
                aria-selected={qrType === 'url'}
                className={`type-tab ${qrType === 'url' ? 'active' : ''}`}
                onClick={() => setQrType('url')}
              >
                🌐 {t.tabUrl}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={qrType === 'promptpay'}
                className={`type-tab ${qrType === 'promptpay' ? 'active' : ''}`}
                onClick={() => setQrType('promptpay')}
              >
                💳 {t.tabPromptpay}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={qrType === 'wifi'}
                className={`type-tab ${qrType === 'wifi' ? 'active' : ''}`}
                onClick={() => setQrType('wifi')}
              >
                📶 {t.tabWifi}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={qrType === 'social'}
                className={`type-tab ${qrType === 'social' ? 'active' : ''}`}
                onClick={() => setQrType('social')}
              >
                📱 {t.tabSocial}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={qrType === 'tel'}
                className={`type-tab ${qrType === 'tel' ? 'active' : ''}`}
                onClick={() => setQrType('tel')}
              >
                📞 {t.tabTel}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={qrType === 'vcard'}
                className={`type-tab ${qrType === 'vcard' ? 'active' : ''}`}
                onClick={() => setQrType('vcard')}
              >
                📇 {t.tabVCard}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={qrType === 'text'}
                className={`type-tab ${qrType === 'text' ? 'active' : ''}`}
                onClick={() => setQrType('text')}
              >
                📝 {t.tabText}
              </button>
            </div>

            <div className="generator-grid">
              <div className="controls">
                {/* 1. URL FORM */}
                {qrType === 'url' && (
                  <>
                    <label className="field-label" htmlFor="url-input">
                      {t.urlLabel}
                    </label>
                    <div className={`url-field ${error ? 'has-error' : ''}`} onClick={handleFieldClick}>
                      <span className="link-icon" aria-hidden="true">
                        ↗
                      </span>
                      <input
                        id="url-input"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        placeholder={t.urlPlaceholder}
                        inputMode="url"
                        spellCheck={false}
                      />
                      {url && (
                        <button type="button" onClick={() => setUrl('')} aria-label="ล้าง">
                          ×
                        </button>
                      )}
                    </div>
                    <p className={error ? 'field-error' : 'field-help'}>{error || t.urlHelp}</p>

                    <div className="quick-links" aria-label="ลิงก์ตัวอย่าง">
                      <span>{t.tryWith}</span>
                      {quickLinks.map((item) => (
                        <button
                          type="button"
                          key={item.label}
                          onClick={() => setUrl(item.value)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* 2. PROMPTPAY FORM */}
                {qrType === 'promptpay' && (
                  <div className="custom-form-group">
                    <label className="field-label">{t.promptpayType}</label>
                    <div className="segmented-control">
                      <button
                        type="button"
                        className={promptPayForm.targetType === 'mobile' ? 'active' : ''}
                        onClick={() =>
                          setPromptPayForm((prev) => ({
                            ...prev,
                            targetType: 'mobile',
                            target: '0812345678',
                          }))
                        }
                      >
                        📱 {t.promptpayMobile}
                      </button>
                      <button
                        type="button"
                        className={promptPayForm.targetType === 'nationalId' ? 'active' : ''}
                        onClick={() =>
                          setPromptPayForm((prev) => ({
                            ...prev,
                            targetType: 'nationalId',
                            target: '1234567890123',
                          }))
                        }
                      >
                        🪪 {t.promptpayId}
                      </button>
                    </div>

                    <label className="field-label mt-3" htmlFor="promptpay-target">
                      {promptPayForm.targetType === 'mobile'
                        ? t.promptpayMobile
                        : t.promptpayId}
                    </label>
                    <div className={`url-field ${error ? 'has-error' : ''}`} onClick={handleFieldClick}>
                      <input
                        id="promptpay-target"
                        value={promptPayForm.target}
                        onChange={(e) =>
                          setPromptPayForm((prev) => ({ ...prev, target: e.target.value }))
                        }
                        placeholder={
                          promptPayForm.targetType === 'mobile'
                            ? t.promptpayTargetPlaceholderMobile
                            : t.promptpayTargetPlaceholderId
                        }
                        inputMode="numeric"
                      />
                    </div>

                    <label className="field-label mt-3" htmlFor="promptpay-amount">
                      {t.promptpayAmountLabel}
                    </label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <span className="currency-prefix">฿</span>
                      <input
                        id="promptpay-amount"
                        value={promptPayForm.amount}
                        onChange={(e) =>
                          setPromptPayForm((prev) => ({ ...prev, amount: e.target.value }))
                        }
                        placeholder={t.promptpayAmountPlaceholder}
                        inputMode="decimal"
                      />
                    </div>
                    <p className={error ? 'field-error' : 'field-help'}>{error || t.promptpayHelp}</p>
                  </div>
                )}

                {/* 3. WI-FI FORM */}
                {qrType === 'wifi' && (
                  <div className="custom-form-group">
                    <label className="field-label" htmlFor="wifi-ssid">
                      {t.wifiSsid}
                    </label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <input
                        id="wifi-ssid"
                        value={wifiForm.ssid}
                        onChange={(e) => setWifiForm((prev) => ({ ...prev, ssid: e.target.value }))}
                        placeholder={t.wifiSsidPlaceholder}
                      />
                    </div>

                    <label className="field-label mt-3" htmlFor="wifi-pass">
                      {t.wifiPass}
                    </label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <input
                        id="wifi-pass"
                        type="text"
                        value={wifiForm.password}
                        onChange={(e) =>
                          setWifiForm((prev) => ({ ...prev, password: e.target.value }))
                        }
                        placeholder={t.wifiPassPlaceholder}
                      />
                    </div>

                    <div className="control-row mt-3">
                      <label className="format-control">
                        {t.wifiSec}
                        <select
                          value={wifiForm.encryption}
                          onChange={(e) =>
                            setWifiForm((prev) => ({
                              ...prev,
                              encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
                            }))
                          }
                        >
                          <option value="WPA">WPA / WPA2 / WPA3</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">ไม่มีรหัสผ่าน (None)</option>
                        </select>
                      </label>

                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={wifiForm.hidden}
                          onChange={(e) =>
                            setWifiForm((prev) => ({ ...prev, hidden: e.target.checked }))
                          }
                        />
                        <span>{t.wifiHidden}</span>
                      </label>
                    </div>
                    {error && <p className="field-error">{error}</p>}
                  </div>
                )}

                {/* 4. SOCIAL FORM */}
                {qrType === 'social' && (
                  <div className="custom-form-group">
                    <label className="field-label">{t.socialPlatform}</label>
                    <div className="segmented-control">
                      {(['line', 'facebook', 'instagram', 'tiktok', 'youtube'] as const).map(
                        (plat) => (
                          <button
                            key={plat}
                            type="button"
                            className={socialForm.platform === plat ? 'active' : ''}
                            onClick={() =>
                              setSocialForm((prev) => ({ ...prev, platform: plat }))
                            }
                          >
                            {plat.toUpperCase()}
                          </button>
                        )
                      )}
                    </div>

                    <label className="field-label mt-3" htmlFor="social-username">
                      {t.socialUsername}
                    </label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <input
                        id="social-username"
                        value={socialForm.username}
                        onChange={(e) =>
                          setSocialForm((prev) => ({ ...prev, username: e.target.value }))
                        }
                        placeholder={t.socialPlaceholder}
                      />
                    </div>
                    {error && <p className="field-error">{error}</p>}
                  </div>
                )}

                {/* 5. TEL FORM */}
                {qrType === 'tel' && (
                  <div className="custom-form-group">
                    <label className="field-label" htmlFor="tel-input">
                      {t.telLabel}
                    </label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <input
                        id="tel-input"
                        value={telNumber}
                        onChange={(e) => setTelNumber(e.target.value)}
                        placeholder={t.telPlaceholder}
                        inputMode="tel"
                      />
                    </div>
                    {error && <p className="field-error">{error}</p>}
                  </div>
                )}

                {/* 6. VCARD FORM */}
                {qrType === 'vcard' && (
                  <div className="custom-form-group">
                    <div className="form-grid-2">
                      <div>
                        <label className="field-label">{t.vcardFirstName}</label>
                        <div className="url-field" onClick={handleFieldClick}>
                          <input
                            value={vCardForm.firstName}
                            onChange={(e) =>
                              setVCardForm((prev) => ({ ...prev, firstName: e.target.value }))
                            }
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="field-label">{t.vcardLastName}</label>
                        <div className="url-field" onClick={handleFieldClick}>
                          <input
                            value={vCardForm.lastName}
                            onChange={(e) =>
                              setVCardForm((prev) => ({ ...prev, lastName: e.target.value }))
                            }
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    <label className="field-label mt-2">{t.vcardPhone}</label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <input
                        value={vCardForm.phone}
                        onChange={(e) =>
                          setVCardForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        placeholder="0812345678"
                        inputMode="tel"
                      />
                    </div>

                    <label className="field-label mt-2">{t.vcardEmail}</label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <input
                        value={vCardForm.email}
                        onChange={(e) =>
                          setVCardForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="john@example.com"
                        inputMode="email"
                      />
                    </div>

                    <label className="field-label mt-2">{t.vcardOrg}</label>
                    <div className="url-field" onClick={handleFieldClick}>
                      <input
                        value={vCardForm.organization}
                        onChange={(e) =>
                          setVCardForm((prev) => ({ ...prev, organization: e.target.value }))
                        }
                        placeholder="Company Co., Ltd."
                      />
                    </div>
                    {error && <p className="field-error">{error}</p>}
                  </div>
                )}

                {/* 7. TEXT FORM */}
                {qrType === 'text' && (
                  <div className="custom-form-group">
                    <label className="field-label" htmlFor="text-input">
                      {t.textLabel}
                    </label>
                    <div className="url-field textarea-field" onClick={handleFieldClick}>
                      <textarea
                        id="text-input"
                        rows={3}
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder={t.textPlaceholder}
                      />
                    </div>
                    {error && <p className="field-error">{error}</p>}
                  </div>
                )}

                <div className="divider" />

                {/* STYLING & FORMAT CONTROLS */}
                <div className="control-row">
                  <fieldset>
                    <legend>{t.colorTitle}</legend>
                    <div className="swatches">
                      {colorChoices.map((color) => (
                        <button
                          type="button"
                          key={color}
                          className={darkColor === color ? 'active' : ''}
                          style={{ backgroundColor: color }}
                          onClick={() => setDarkColor(color)}
                          aria-label={`เลือกสี ${color}`}
                          aria-pressed={darkColor === color}
                        />
                      ))}
                      <label className="custom-color" title={t.customColor}>
                        <span>+</span>
                        <input
                          type="color"
                          value={darkColor}
                          onChange={(event) => setDarkColor(event.target.value)}
                          aria-label={t.customColor}
                        />
                      </label>
                    </div>
                  </fieldset>

                  <label className="size-control">
                    {t.sizeTitle}
                    <select
                      value={size}
                      onChange={(event) => setSize(Number(event.target.value))}
                    >
                      <option value={512}>512 px</option>
                      <option value={720}>720 px</option>
                      <option value={1024}>1024 px</option>
                    </select>
                  </label>

                  <label className="format-control">
                    {t.formatTitle}
                    <select
                      value={imageFormat}
                      onChange={(event) =>
                        setImageFormat(event.target.value as ImageFormat)
                      }
                    >
                      <option value="png">PNG (Raster)</option>
                      <option value="jpeg">JPEG (Photo)</option>
                      <option value="svg">SVG (Vector)</option>
                    </select>
                  </label>
                </div>

                <label className="background-toggle">
                  <span>
                    <b>{t.transparentBg}</b>
                    <small>
                      {imageFormat === 'jpeg' ? t.jpegBgNotice : t.transparentBgHelp}
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={lightColor === '#00000000'}
                    disabled={imageFormat === 'jpeg'}
                    onChange={(event) =>
                      setLightColor(event.target.checked ? '#00000000' : '#FFFFFF')
                    }
                  />
                  <i aria-hidden="true" />
                </label>

                {/* CENTER LOGO SELECTOR */}
                <div className="divider" />
                <LogoSelector
                  logoConfig={logoConfig}
                  onChange={setLogoConfig}
                  title={t.centerLogoTitle}
                  noLogoText={t.noLogo}
                  uploadCustomText={t.uploadCustomLogo}
                  removeLogoText={t.removeLogo}
                />
              </div>

              {/* PREVIEW PANEL */}
              <div className="preview-panel">
                <div className="preview-topline">
                  <span>{t.preview}</span>
                  <b>{imageFormat.toUpperCase()}</b>
                </div>

                <div className="qr-stage">
                  <span className="scan-line" aria-hidden="true" />
                  <canvas
                    ref={canvasRef}
                    aria-label={`QR Code for ${activePayload}`}
                  />
                </div>

                <p className="preview-url" title={activePayload}>
                  {activePayload}
                </p>

                <div className="preview-action-buttons">
                  <button
                    className="download-button"
                    type="button"
                    onClick={downloadQr}
                    disabled={Boolean(error)}
                  >
                    <span className="button-icon" aria-hidden="true">
                      ↓
                    </span>
                    <span>
                      {downloaded
                        ? t.downloadReady
                        : `${isNativeApp ? t.saveShareBtn : t.downloadBtn} ${imageFormat.toUpperCase()}`}
                    </span>
                    <small>{imageFormat === 'svg' ? 'Vector' : `${size} px`}</small>
                  </button>

                  <div className="preview-sub-actions">
                    <button
                      className="test-link-button"
                      type="button"
                      onClick={testLink}
                      disabled={Boolean(error)}
                      title={t.previewActionTest}
                    >
                      {isLinkType ? t.previewActionTest : '🔍 ตรวจสอบ'}
                    </button>

                    <button
                      className="copy-button"
                      type="button"
                      onClick={copyPayload}
                      disabled={Boolean(error)}
                    >
                      {copied ? t.previewActionCopied : t.previewActionCopy}
                    </button>
                  </div>
                </div>

                <div className="safety-note">
                  <i aria-hidden="true">✓</i> {t.safeOnDevice}
                </div>
              </div>
            </div>
          </div>

          {!mobileApp && (
            <SidebarAd side="right" label={lang === 'th' ? 'โฆษณา' : 'SPONSORED'} />
          )}
        </div>

        {!mobileApp && (
          <AdSenseBanner label={lang === 'th' ? 'โฆษณา / SPONSORED' : 'SPONSORED'} />
        )}
      </section>

      {mobileApp && <SupportPanel lang={lang} />}

      <section className="value-strip" aria-label="ข้อมูลบริการ">
        <div>
          <strong>100% Free</strong>
          <span>{t.noWatermark}</span>
        </div>
        <div>
          <strong>Vector SVG</strong>
          <span>{t.f3Title}</span>
        </div>
        <div>
          <strong>100% Private</strong>
          <span>{t.noDataCollect}</span>
        </div>
        <div>
          <strong>Static QR</strong>
          <span>{t.noExpiry}</span>
        </div>
      </section>

      <section className="steps-section" id="how">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.stepsTitle}</span>
            <h2>
              {t.stepsHeading.split(' ')[0]}
              <br />
              {t.stepsHeading.split(' ').slice(1).join(' ')}
            </h2>
          </div>
          <p>{t.stepsDesc}</p>
        </div>
        <div className="steps-grid">
          <article>
            <span className="step-number">01</span>
            <div className="step-icon">↗</div>
            <h3>{t.step1}</h3>
            <p>{t.step1Desc}</p>
          </article>
          <article>
            <span className="step-number">02</span>
            <div className="step-icon">◐</div>
            <h3>{t.step2}</h3>
            <p>{t.step2Desc}</p>
          </article>
          <article>
            <span className="step-number">03</span>
            <div className="step-icon">↓</div>
            <h3>{t.step3}</h3>
            <p>{t.step3Desc}</p>
          </article>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="feature-copy">
          <span className="section-kicker light">PRO CAPABILITIES</span>
          <h2>
            {t.featuresHeading.split(' ')[0]} {t.featuresHeading.split(' ')[1]}
            <br />
            {t.featuresHeading.split(' ').slice(2).join(' ')}
          </h2>
          <p>{t.heroDesc}</p>
          <a href="#generator">
            {t.ctaCreate} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="feature-cards">
          <article>
            <span>01</span>
            <h3>{t.f1Title}</h3>
            <p>{t.f1Desc}</p>
          </article>
          <article>
            <span>02</span>
            <h3>{t.f2Title}</h3>
            <p>{t.f2Desc}</p>
          </article>
          <article>
            <span>03</span>
            <h3>{t.f3Title}</h3>
            <p>{t.f3Desc}</p>
          </article>
          <article className="accent-card">
            <span>04</span>
            <h3>{t.f4Title}</h3>
            <p>{t.f4Desc}</p>
          </article>
        </div>
      </section>

      <section className="comparison-section" id="compare">
        <div className="comparison-header">
          <span className="section-kicker">{t.comparisonKicker}</span>
          <h2>{t.comparisonTitle}</h2>
          <p>{t.comparisonSubtitle}</p>
        </div>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>{t.thFeature}</th>
                <th className="highlight-col">✨ {t.thQrlab}</th>
                <th>{t.thOthers}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{t.cmpRow1Feature}</strong></td>
                <td className="highlight-cell"><span className="badge-check">✓</span> {t.cmpRow1Qrlab}</td>
                <td className="dimmed-cell"><span className="badge-cross">✕</span> {t.cmpRow1Others}</td>
              </tr>
              <tr>
                <td><strong>{t.cmpRow2Feature}</strong></td>
                <td className="highlight-cell"><span className="badge-check">✓</span> {t.cmpRow2Qrlab}</td>
                <td className="dimmed-cell"><span className="badge-cross">✕</span> {t.cmpRow2Others}</td>
              </tr>
              <tr>
                <td><strong>{t.cmpRow3Feature}</strong></td>
                <td className="highlight-cell"><span className="badge-check">✓</span> {t.cmpRow3Qrlab}</td>
                <td className="dimmed-cell"><span className="badge-cross">✕</span> {t.cmpRow3Others}</td>
              </tr>
              <tr>
                <td><strong>{t.cmpRow4Feature}</strong></td>
                <td className="highlight-cell"><span className="badge-check">✓</span> {t.cmpRow4Qrlab}</td>
                <td className="dimmed-cell"><span className="badge-cross">✕</span> {t.cmpRow4Others}</td>
              </tr>
              <tr>
                <td><strong>{t.cmpRow5Feature}</strong></td>
                <td className="highlight-cell"><span className="badge-check">✓</span> {t.cmpRow5Qrlab}</td>
                <td className="dimmed-cell"><span className="badge-cross">✕</span> {t.cmpRow5Others}</td>
              </tr>
              <tr>
                <td><strong>{t.cmpRow6Feature}</strong></td>
                <td className="highlight-cell"><span className="badge-check">✓</span> {t.cmpRow6Qrlab}</td>
                <td className="dimmed-cell"><span className="badge-cross">✕</span> {t.cmpRow6Others}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-intro">
          <span className="section-kicker">FAQ</span>
          <h2>
            {t.faqTitle}
          </h2>
          <p>ข้อมูลสำคัญก่อนนำ QR Code ไปใช้งานจริง</p>
        </div>
        <div className="faq-list">
          <details open>
            <summary>
              {t.faq1Q}
              <span>+</span>
            </summary>
            <p>{t.faq1A}</p>
          </details>
          <details>
            <summary>
              {t.faq2Q}
              <span>+</span>
            </summary>
            <p>{t.faq2A}</p>
          </details>
          <details>
            <summary>
              {t.faq3Q}
              <span>+</span>
            </summary>
            <p>{t.faq3A}</p>
          </details>
          <details>
            <summary>
              {t.faq4Q}
              <span>+</span>
            </summary>
            <p>{t.faq4A}</p>
          </details>
          <details>
            <summary>
              {t.faq5Q}
              <span>+</span>
            </summary>
            <p>{t.faq5A}</p>
          </details>
          <details>
            <summary>
              {t.faq6Q}
              <span>+</span>
            </summary>
            <p>{t.faq6A}</p>
          </details>
        </div>
      </section>

      <section className="solutions-section">
        <div className="solutions-inner">
          <span className="section-kicker">{t.solutionsKicker}</span>
          <h2>{t.solutionsHeading}</h2>
          <div className="solutions-pills-grid" role="list">
            <button
              type="button"
              className="solution-pill"
              onClick={() => {
                setQrType('url');
                document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              🌐 {t.solUrl}
            </button>
            <Link
              href="/promptpay"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setQrType('promptpay');
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              ฿ {t.solPromptpay}
            </Link>
            <Link
              href="/wifi"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setQrType('wifi');
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              📶 {t.solWifi}
            </Link>
            <Link
              href="/vcard"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setQrType('vcard');
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              👤 {t.solVcard}
            </Link>
            <Link
              href="/link"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setQrType('url');
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              🔗 {t.solLink}
            </Link>
            <Link
              href="/line"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setQrType('social');
                  setSocialForm(prev => ({ ...prev, platform: 'line' }));
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              💬 {t.solLine}
            </Link>
            <button
              type="button"
              className="solution-pill"
              onClick={() => {
                setQrType('tel');
                document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              📞 {t.solTel}
            </button>
            <button
              type="button"
              className="solution-pill"
              onClick={() => {
                setQrType('text');
                document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              📝 {t.solText}
            </button>
            <Link
              href="/permanent"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setQrType('url');
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              ♾️ {t.solPermanent}
            </Link>
            <Link
              href="/no-watermark"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setQrType('url');
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              🛡️ {t.solNoWatermark}
            </Link>
            <Link
              href="/how-to"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              📖 {t.solHowTo}
            </Link>
            <Link
              href="/scanner"
              className="solution-pill"
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                  e.preventDefault();
                  setIsScannerOpen(true);
                }
              }}
            >
              📷 {t.solScanner}
            </Link>
          </div>
        </div>
      </section>

      <section className="share-section">
        <div className="share-card">
          <div className="share-info">
            <h3>{t.shareTitle}</h3>
            <p>{t.bookmarkHint}</p>
          </div>
          <div className="share-buttons">
            <button
              type="button"
              className="share-btn line"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const shareUrl = window.location.href;
                  const text = encodeURIComponent('QR Lab — ทำ QR Code ฟรี สร้างง่ายนิดเดียว ไม่มีวันหมดอายุ: ' + shareUrl);
                  window.open(`https://line.me/R/msg/text/?${text}`, '_blank');
                }
              }}
            >
              💬 {t.shareLine}
            </button>
            <button
              type="button"
              className="share-btn fb"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const shareUrl = encodeURIComponent(window.location.href);
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
                }
              }}
            >
              📘 {t.shareFb}
            </button>
            <button
              type="button"
              className="share-btn copy"
              onClick={async () => {
                if (typeof window !== 'undefined') {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2500);
                  } catch {
                    // ignore
                  }
                }
              }}
            >
              🔗 {shareCopied ? t.shareCopied : t.shareCopy}
            </button>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{t.brand}</span>
          </a>
          <p>{t.allRightsReserved}</p>
        </div>
        <div className="footer-actions">
          <a
            href={
              isNativeApp
                ? 'https://qrlab-th-public-plato-122b.vercel.app/privacy'
                : '/privacy'
            }
            target={isNativeApp ? '_blank' : undefined}
            rel={isNativeApp ? 'noreferrer' : undefined}
          >
            {t.privacyPolicy}
          </a>
          <a href="#generator">
            {t.ctaCreate} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </footer>

      {/* Modals */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onUseInMaker={handleUseScannedInMaker}
        lang={lang}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelect={handleRestoreHistory}
        onDelete={(id) => setHistoryItems(deleteHistoryItem(id))}
        onClearAll={() => {
          clearAllHistory();
          setHistoryItems([]);
        }}
        lang={lang}
      />
    </main>
  );
}
