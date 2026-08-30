'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

const colorChoices = ['#123B3A', '#196B62', '#215391', '#20232B', '#702D54'];
type ImageFormat = 'png' | 'jpeg';

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

export default function Home({ mobileApp = false }: { mobileApp?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState('https://example.com');
  const [normalizedUrl, setNormalizedUrl] = useState('https://example.com/');
  const [darkColor, setDarkColor] = useState(colorChoices[0]);
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [size, setSize] = useState(720);
  const [imageFormat, setImageFormat] = useState<ImageFormat>('png');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    void import('@capacitor/core').then(({ Capacitor }) => {
      setIsNativeApp(Capacitor.isNativePlatform());
    });
  }, []);

  const renderQr = useCallback(async (value: string, target?: HTMLCanvasElement) => {
    const canvas = target ?? canvasRef.current;
    if (!canvas || !value) return;
    await QRCode.toCanvas(canvas, value, {
      width: target ? size : 320,
      margin: 3,
      errorCorrectionLevel: 'H',
      color: { dark: darkColor, light: imageFormat === 'jpeg' ? '#FFFFFF' : lightColor },
    });
  }, [darkColor, imageFormat, lightColor, size]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const nextUrl = normalizeUrl(url);
        if (!nextUrl) {
          setError('กรุณาใส่ URL ที่ต้องการสร้าง QR Code');
          return;
        }
        setError('');
        setNormalizedUrl(nextUrl);
        void renderQr(nextUrl);
      } catch {
        setError('URL ยังไม่ถูกต้อง ลองใส่ตัวอย่างเช่น yourwebsite.com');
      }
    }, 160);
    return () => window.clearTimeout(timer);
  }, [url, renderQr]);

  const downloadQr = async () => {
    if (error || !normalizedUrl) return;
    const exportCanvas = document.createElement('canvas');
    await renderQr(normalizedUrl, exportCanvas);
    const anchor = document.createElement('a');
    const isJpeg = imageFormat === 'jpeg';
    const fileName = `qrlab-code.${isJpeg ? 'jpg' : 'png'}`;
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
        text: normalizedUrl,
        url: savedFile.uri,
        dialogTitle: 'บันทึกหรือแชร์ QR Code',
      });
    } else {
      const blob = await new Promise<Blob>((resolve, reject) => {
        exportCanvas.toBlob((result) => result ? resolve(result) : reject(new Error('export-failed')), mimeType, 0.95);
      });
      const objectUrl = URL.createObjectURL(blob);
      anchor.download = fileName;
      anchor.href = objectUrl;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    }
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1800);
  };

  const copyUrl = async () => {
    if (!normalizedUrl) return;
    await navigator.clipboard.writeText(normalizedUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className={mobileApp ? 'native-app' : undefined}>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="QR Lab หน้าหลัก">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>QR LAB</span>
          </a>
          <nav aria-label="เมนูหลัก">
            <a href="#how">วิธีใช้งาน</a>
            <a href="#features">จุดเด่น</a>
            <a href="#faq">คำถามที่พบบ่อย</a>
          </nav>
          <a className="header-cta" href="#generator">สร้าง QR ฟรี <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-orb orb-one" aria-hidden="true" />
        <div className="hero-orb orb-two" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><i aria-hidden="true" /> เครื่องมือ QR สำหรับทุกคน</span>
            <h1>ทุกลิงก์<br />พร้อม<span>สแกน.</span></h1>
            <p>สร้าง QR Code ที่สวย คมชัด และพร้อมใช้งานได้ทันที ไม่ต้องสมัครสมาชิก ไม่จำกัดจำนวนครั้ง</p>
            <a className="hero-link" href="#generator">เริ่มสร้างฟรี <span aria-hidden="true">↓</span></a>
            <div className="trust-row" aria-label="จุดเด่น">
              <span><i aria-hidden="true">✓</i> ไม่มีลายน้ำ</span>
              <span><i aria-hidden="true">✓</i> ไม่หมดอายุ</span>
              <span><i aria-hidden="true">✓</i> ไม่เก็บข้อมูล</span>
            </div>
          </div>

          <div className="generator-shell" id="generator">
            <div className="generator-head">
              <div>
                <span className="section-kicker">QR MAKER</span>
                <h2>สร้าง QR Code ของคุณ</h2>
              </div>
              <span className="live-badge"><i /> อัปเดตทันที</span>
            </div>

            <div className="progress-line" aria-label="ขั้นตอนการสร้าง QR Code">
              <span className="active"><b>1</b> ใส่ลิงก์</span>
              <i />
              <span><b>2</b> ปรับแต่ง</span>
              <i />
              <span><b>3</b> ดาวน์โหลด</span>
            </div>

            <div className="generator-grid">
              <div className="controls">
                <label className="field-label" htmlFor="url-input">ลิงก์เว็บไซต์</label>
                <div className={`url-field ${error ? 'has-error' : ''}`}>
                  <span className="link-icon" aria-hidden="true">↗</span>
                  <input
                    id="url-input"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="yourwebsite.com"
                    inputMode="url"
                    spellCheck={false}
                    aria-describedby="url-help"
                  />
                  {url && <button type="button" onClick={() => setUrl('')} aria-label="ล้าง URL">×</button>}
                </div>
                <p id="url-help" role={error ? 'alert' : undefined} className={error ? 'field-error' : 'field-help'}>
                  {error || 'ใส่ได้ทั้งแบบมีหรือไม่มี https://'}
                </p>

                <div className="quick-links" aria-label="ลิงก์ตัวอย่าง">
                  <span>ลองด้วย</span>
                  {quickLinks.map((item) => (
                    <button type="button" key={item.label} onClick={() => setUrl(item.value)}>{item.label}</button>
                  ))}
                </div>

                <div className="divider" />

                <div className="control-row">
                  <fieldset>
                    <legend>สี QR Code</legend>
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
                      <label className="custom-color" title="เลือกสีอื่น">
                        <span>+</span>
                        <input type="color" value={darkColor} onChange={(event) => setDarkColor(event.target.value)} aria-label="เลือกสี QR Code แบบกำหนดเอง" />
                      </label>
                    </div>
                  </fieldset>

                  <label className="size-control">
                    ขนาดไฟล์
                    <select value={size} onChange={(event) => setSize(Number(event.target.value))}>
                      <option value={512}>512 px</option>
                      <option value={720}>720 px</option>
                      <option value={1024}>1024 px</option>
                    </select>
                  </label>

                  <label className="format-control">
                    ชนิดไฟล์
                    <select value={imageFormat} onChange={(event) => setImageFormat(event.target.value as ImageFormat)}>
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                    </select>
                  </label>
                </div>

                <label className="background-toggle">
                  <span>
                    <b>พื้นหลังโปร่งใส</b>
                    <small>{imageFormat === 'jpeg' ? 'JPEG ใช้พื้นหลังสีขาว' : 'เหมาะกับงานออกแบบและโลโก้'}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={lightColor === '#00000000'}
                    disabled={imageFormat === 'jpeg'}
                    onChange={(event) => setLightColor(event.target.checked ? '#00000000' : '#FFFFFF')}
                  />
                  <i aria-hidden="true" />
                </label>
              </div>

              <div className="preview-panel">
                <div className="preview-topline">
                  <span>ตัวอย่าง</span>
                  <b>{imageFormat.toUpperCase()}</b>
                </div>
                <div className="qr-stage">
                  <span className="scan-line" aria-hidden="true" />
                  <canvas ref={canvasRef} aria-label={`QR Code สำหรับ ${normalizedUrl}`} />
                </div>
                <p className="preview-url" title={normalizedUrl}>{normalizedUrl}</p>
                <button className="download-button" type="button" onClick={downloadQr} disabled={Boolean(error)}>
                  <span className="button-icon" aria-hidden="true">↓</span>
                  <span>{downloaded ? 'พร้อมใช้งาน ✓' : `${isNativeApp ? 'บันทึก / แชร์' : 'ดาวน์โหลด'} ${imageFormat.toUpperCase()}`}</span>
                  <small>{size} px</small>
                </button>
                <button className="copy-button" type="button" onClick={copyUrl} disabled={Boolean(error)}>
                  {copied ? 'คัดลอกลิงก์แล้ว ✓' : 'คัดลอกลิงก์ปลายทาง'}
                </button>
                <div className="safety-note"><i aria-hidden="true">✓</i> สร้างบนอุปกรณ์ของคุณ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="value-strip" aria-label="ข้อมูลบริการ">
        <div><strong>ฟรี 100%</strong><span>ไม่มีค่าใช้จ่ายแอบแฝง</span></div>
        <div><strong>ความละเอียดสูง</strong><span>พร้อมใช้ทั้งจอและงานพิมพ์</span></div>
        <div><strong>เป็นส่วนตัว</strong><span>URL ไม่ถูกส่งไปที่เซิร์ฟเวอร์</span></div>
        <div><strong>ใช้งานตลอดไป</strong><span>QR Code ไม่มีวันหมดอายุ</span></div>
      </section>

      <section className="steps-section" id="how">
        <div className="section-heading">
          <div><span className="section-kicker">ขั้นตอนการใช้งาน</span><h2>ง่ายกว่าที่คิด<br />เสร็จในไม่กี่วินาที</h2></div>
          <p>ไม่ต้องเรียนรู้เครื่องมือซับซ้อน เพียงใส่ลิงก์ ปรับสไตล์ และบันทึกไฟล์</p>
        </div>
        <div className="steps-grid">
          <article><span className="step-number">01</span><div className="step-icon">↗</div><h3>วาง URL</h3><p>ใส่ลิงก์เว็บไซต์ เมนูออนไลน์ โซเชียล หรือหน้าสินค้าที่ต้องการแชร์</p></article>
          <article><span className="step-number">02</span><div className="step-icon">◐</div><h3>ปรับให้เข้ากับแบรนด์</h3><p>เลือกสี ขนาด และพื้นหลังให้เหมาะกับหน้าจอหรืองานออกแบบของคุณ</p></article>
          <article><span className="step-number">03</span><div className="step-icon">↓</div><h3>ดาวน์โหลดทันที</h3><p>บันทึกเป็น PNG หรือ JPEG ความละเอียดสูง พร้อมนำไปใช้ได้โดยไม่มีลายน้ำ</p></article>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="feature-copy">
          <span className="section-kicker light">สร้างอย่างมั่นใจ</span>
          <h2>QR Code ที่พร้อม<br />ไปกับทุกงาน</h2>
          <p>ออกแบบมาให้เร็วพอสำหรับงานประจำวัน และคมชัดพอสำหรับงานจริงของธุรกิจ</p>
          <a href="#generator">สร้าง QR Code ตอนนี้ <span aria-hidden="true">↗</span></a>
        </div>
        <div className="feature-cards">
          <article><span>01</span><h3>เป็นส่วนตัวตั้งแต่ต้น</h3><p>ทุกอย่างประมวลผลบนเบราว์เซอร์ ลิงก์ของคุณไม่ถูกบันทึกไว้ที่เรา</p></article>
          <article><span>02</span><h3>สแกนได้ตลอดไป</h3><p>QR แบบคงที่ไม่หมดอายุ ตราบใดที่ลิงก์ปลายทางยังเปิดใช้งาน</p></article>
          <article><span>03</span><h3>คมชัดทุกขนาด</h3><p>เลือกระดับความละเอียดได้สูงสุด 1,024 px พร้อมระบบแก้ไขข้อผิดพลาดสูง</p></article>
          <article className="accent-card"><span>∞</span><h3>สร้างได้ไม่จำกัด</h3><p>ไม่ต้องสมัครสมาชิก ไม่มีโควตา และไม่มีลายน้ำบนผลงาน</p></article>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-intro"><span className="section-kicker">FAQ</span><h2>มีคำถาม?<br />เรามีคำตอบ</h2><p>ข้อมูลสำคัญก่อนนำ QR Code ไปใช้งานจริง</p></div>
        <div className="faq-list">
          <details open><summary>QR Code ที่สร้างฟรีจริงไหม?<span>+</span></summary><p>ฟรี ไม่มีลายน้ำ และไม่จำกัดจำนวนครั้ง คุณสามารถดาวน์โหลดไปใช้งานได้ทันที</p></details>
          <details><summary>QR Code จะหมดอายุหรือไม่?<span>+</span></summary><p>ไม่หมดอายุ เพราะเป็น QR Code แบบคงที่ แต่ลิงก์ปลายทางจะต้องยังเปิดใช้งานอยู่</p></details>
          <details><summary>ควรเลือกขนาดเท่าไร?<span>+</span></summary><p>512 px เหมาะกับออนไลน์ ส่วน 720–1,024 px เหมาะกับงานพิมพ์และป้ายที่มีขนาดใหญ่ขึ้น</p></details>
          <details><summary>ระบบเก็บ URL ของฉันหรือไม่?<span>+</span></summary><p>ไม่เก็บ การสร้าง QR Code เกิดขึ้นภายในเบราว์เซอร์บนอุปกรณ์ของคุณ</p></details>
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>QR LAB</span></a>
          <p>เปลี่ยนทุกลิงก์ให้พร้อมสแกน — ฟรี เรียบง่าย และเป็นส่วนตัว</p>
        </div>
        <div className="footer-actions">
          <a href={isNativeApp ? 'https://qrlab-th-public-plato-122b.vercel.app/privacy' : '/privacy'} target={isNativeApp ? '_blank' : undefined} rel={isNativeApp ? 'noreferrer' : undefined}>นโยบายความเป็นส่วนตัว</a>
          <a href="#generator">สร้าง QR ฟรี <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </main>
  );
}
