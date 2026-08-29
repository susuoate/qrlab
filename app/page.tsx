'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

const colorChoices = ['#173B3F', '#126E64', '#15345A', '#1F2937', '#6B244D'];
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

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState('https://example.com');
  const [normalizedUrl, setNormalizedUrl] = useState('https://example.com/');
  const [darkColor, setDarkColor] = useState(colorChoices[0]);
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [size, setSize] = useState(720);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const renderQr = useCallback(async (value: string, target?: HTMLCanvasElement) => {
    const canvas = target ?? canvasRef.current;
    if (!canvas || !value) return;
    await QRCode.toCanvas(canvas, value, {
      width: target ? size : 320,
      margin: 3,
      errorCorrectionLevel: 'H',
      color: { dark: darkColor, light: lightColor },
    });
  }, [darkColor, lightColor, size]);

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
    }, 180);
    return () => window.clearTimeout(timer);
  }, [url, renderQr]);

  const downloadQr = async () => {
    if (error || !normalizedUrl) return;
    const exportCanvas = document.createElement('canvas');
    await renderQr(normalizedUrl, exportCanvas);
    const anchor = document.createElement('a');
    anchor.download = 'qrlab-code.png';
    anchor.href = exportCanvas.toDataURL('image/png');
    anchor.click();
  };

  const copyUrl = async () => {
    if (!normalizedUrl) return;
    await navigator.clipboard.writeText(normalizedUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="QR Lab หน้าหลัก">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>QR LAB</span>
        </a>
        <nav aria-label="เมนูหลัก">
          <a href="#how">วิธีใช้งาน</a>
          <a href="#features">จุดเด่น</a>
          <a href="#faq">คำถามที่พบบ่อย</a>
        </nav>
        <a className="header-cta" href="#generator">สร้าง QR ฟรี</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow"><span aria-hidden="true">●</span> ฟรี • ไม่ต้องสมัครสมาชิก</span>
          <h1>เปลี่ยนทุกลิงก์<br />ให้พร้อม<span>สแกน</span></h1>
          <p>สร้าง QR Code จาก URL ได้ทันที ปรับสี ดาวน์โหลดคมชัด และใช้งานได้ไม่จำกัด — ทุกอย่างเกิดขึ้นบนอุปกรณ์ของคุณ</p>
          <div className="trust-row">
            <span><b>01</b> วางลิงก์</span>
            <span><b>02</b> ปรับแต่ง</span>
            <span><b>03</b> ดาวน์โหลด</span>
          </div>
        </div>

        <div className="generator-shell" id="generator">
          <div className="generator-head">
            <div>
              <span className="section-kicker">URL → QR CODE</span>
              <h2>สร้าง QR ของคุณ</h2>
            </div>
            <span className="live-badge"><i /> พร้อมใช้งาน</span>
          </div>

          <div className="generator-grid">
            <div className="controls">
              <label htmlFor="url-input">ลิงก์เว็บไซต์</label>
              <div className={`url-field ${error ? 'has-error' : ''}`}>
                <span aria-hidden="true">↗</span>
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
              <p id="url-help" className={error ? 'field-error' : 'field-help'}>
                {error || 'ใส่ได้ทั้งแบบมีหรือไม่มี https://'}
              </p>

              <div className="quick-links" aria-label="ลิงก์ตัวอย่าง">
                {quickLinks.map((item) => (
                  <button type="button" key={item.label} onClick={() => setUrl(item.value)}>{item.label}</button>
                ))}
              </div>

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
              </div>

              <label className="background-toggle">
                <span>
                  <b>พื้นหลังโปร่งใส</b>
                  <small>เหมาะกับงานกราฟิก</small>
                </span>
                <input
                  type="checkbox"
                  checked={lightColor === '#00000000'}
                  onChange={(event) => setLightColor(event.target.checked ? '#00000000' : '#FFFFFF')}
                />
                <i aria-hidden="true" />
              </label>
            </div>

            <div className="preview-panel">
              <span className="preview-label">ตัวอย่างแบบเรียลไทม์</span>
              <div className="qr-stage">
                <span className="corner top-left" /><span className="corner top-right" />
                <canvas ref={canvasRef} aria-label={`QR Code สำหรับ ${normalizedUrl}`} />
                <span className="corner bottom-left" /><span className="corner bottom-right" />
              </div>
              <p className="preview-url" title={normalizedUrl}>{normalizedUrl}</p>
              <button className="download-button" type="button" onClick={downloadQr} disabled={Boolean(error)}>
                <span aria-hidden="true">↓</span> ดาวน์โหลด PNG <small>{size} px</small>
              </button>
              <button className="copy-button" type="button" onClick={copyUrl} disabled={Boolean(error)}>
                {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกลิงก์'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="steps-section" id="how">
        <div className="section-heading">
          <span className="section-kicker">ง่ายใน 3 ขั้นตอน</span>
          <h2>จากลิงก์สู่ QR Code<br />ภายในไม่กี่วินาที</h2>
        </div>
        <div className="steps-grid">
          <article><span>01</span><div className="step-icon">↗</div><h3>วาง URL</h3><p>ใส่ลิงก์เว็บไซต์ หน้าเมนู โซเชียล หรือหน้าสินค้าที่ต้องการแชร์</p></article>
          <article><span>02</span><div className="step-icon">◐</div><h3>ปรับให้เป็นคุณ</h3><p>เลือกสี ขนาด และพื้นหลังให้เข้ากับแบรนด์หรืองานออกแบบ</p></article>
          <article><span>03</span><div className="step-icon">↓</div><h3>ดาวน์โหลด</h3><p>บันทึกเป็น PNG ความละเอียดสูง พร้อมใช้ทั้งออนไลน์และงานพิมพ์</p></article>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="feature-main">
          <span className="section-kicker light">ทำไมต้อง QR LAB</span>
          <h2>เร็ว เรียบง่าย<br />และเป็นส่วนตัว</h2>
          <p>เราออกแบบเครื่องมือให้คุณไปถึง QR Code ที่ต้องการได้ทันที โดยไม่ต้องผ่านหน้าสมัครสมาชิกหรือขั้นตอนที่ซับซ้อน</p>
          <div className="feature-stats"><span><b>0</b> บาท</span><span><b>0</b> ข้อมูลที่ส่งออก</span><span><b>∞</b> จำนวนครั้ง</span></div>
        </div>
        <div className="feature-list">
          <article><span>✓</span><div><h3>สร้างบนอุปกรณ์ของคุณ</h3><p>ลิงก์และ QR Code ประมวลผลในเบราว์เซอร์ ไม่ถูกอัปโหลดไปที่เรา</p></div></article>
          <article><span>✓</span><div><h3>สแกนได้ตลอดไป</h3><p>เป็น QR แบบคงที่ ไม่มีวันหมดอายุ ตราบใดที่ลิงก์ปลายทางยังใช้งานได้</p></div></article>
          <article><span>✓</span><div><h3>พร้อมสำหรับงานพิมพ์</h3><p>ดาวน์โหลดได้สูงสุด 1,024 px พร้อมระดับแก้ไขข้อผิดพลาดสูง</p></div></article>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-heading compact"><span className="section-kicker">FAQ</span><h2>คำถามที่พบบ่อย</h2></div>
        <div className="faq-list">
          <details open><summary>QR Code ที่สร้างฟรีจริงไหม?<span>+</span></summary><p>ฟรี ไม่มีลายน้ำ และไม่จำกัดจำนวนครั้ง คุณสามารถดาวน์โหลดไปใช้งานได้ทันที</p></details>
          <details><summary>QR Code จะหมดอายุหรือไม่?<span>+</span></summary><p>ไม่หมดอายุ เพราะเป็น QR Code แบบคงที่ แต่ต้องแน่ใจว่าลิงก์ปลายทางยังเปิดใช้งานอยู่</p></details>
          <details><summary>ควรเลือกขนาดเท่าไร?<span>+</span></summary><p>512 px เหมาะกับออนไลน์ ส่วน 720–1,024 px เหมาะกับงานพิมพ์หรือป้ายขนาดใหญ่ขึ้น</p></details>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>QR LAB</span></a>
        <p>เครื่องมือสร้าง QR Code ที่ตั้งใจให้ทุกลิงก์แชร์ได้ง่ายขึ้น</p>
        <a href="#generator">กลับไปสร้าง QR <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  );
}
