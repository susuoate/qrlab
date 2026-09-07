'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { translations } from '../lib/i18n';
import type { Language } from '../lib/types';

interface A4StickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: string;
  darkColor: string;
  lightColor: string;
  lang: Language;
}

type StickerCount = 6 | 12 | 24;

export default function A4StickerModal({
  isOpen,
  onClose,
  payload,
  darkColor,
  lightColor,
  lang,
}: A4StickerModalProps) {
  const [count, setCount] = useState<StickerCount>(12);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const t = translations[lang];

  useEffect(() => {
    if (!payload || !isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(payload, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: darkColor || '#000000',
        light: lightColor || '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate sticker QR:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [payload, darkColor, lightColor, isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('printing-stickers');
      const handleAfterPrint = () => {
        document.body.classList.remove('printing-stickers');
        window.removeEventListener('afterprint', handleAfterPrint);
      };
      window.addEventListener('afterprint', handleAfterPrint);
      window.print();
      // Fallback cleanup if afterprint doesn't fire
      setTimeout(() => {
        document.body.classList.remove('printing-stickers');
      }, 1500);
    }
  };

  const stickers = Array.from({ length: count });

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card sticker-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3>{t.stickerModalTitle}</h3>
            <p className="modal-subtitle">{t.stickerModalSub}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Sticker Count Selector */}
        <div className="sticker-controls-bar">
          <span className="sticker-select-label">{t.stickerCountLabel}</span>
          <div className="sticker-count-tabs">
            <button
              type="button"
              className={`sticker-count-btn ${count === 6 ? 'active' : ''}`}
              onClick={() => setCount(6)}
            >
              {t.stickerCount6}
            </button>
            <button
              type="button"
              className={`sticker-count-btn ${count === 12 ? 'active' : ''}`}
              onClick={() => setCount(12)}
            >
              {t.stickerCount12}
            </button>
            <button
              type="button"
              className={`sticker-count-btn ${count === 24 ? 'active' : ''}`}
              onClick={() => setCount(24)}
            >
              {t.stickerCount24}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticker-action-buttons">
          <button
            type="button"
            className="sticker-print-action-btn"
            onClick={handlePrint}
          >
            {t.stickerPrintNow}
          </button>
        </div>

        {/* Printable A4 Sheet Container */}
        <div className="sticker-preview-wrapper">
          <div id="printable-sticker-sheet" className={`a4-sticker-sheet count-${count}`}>
            {stickers.map((_, idx) => (
              <div key={idx} className="sticker-item">
                <div className="sticker-cut-border">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt={`QR Code Sticker ${idx + 1}`}
                      className="sticker-qr-img"
                    />
                  ) : (
                    <div className="sticker-qr-loading">...</div>
                  )}
                  <span className="sticker-watermark">qrcodemaker.me</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
