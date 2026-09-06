'use client';

import { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  adSlot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  label?: string;
}

export default function AdSenseBanner({
  adSlot,
  format = 'auto',
  label = 'โฆษณา / SPONSORED',
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // @ts-expect-error Google AdSense global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore if AdBlocker is active
    }
  }, []);

  return (
    <div className="web-ad-horizontal" aria-label={label}>
      <span className="web-ad-tag">{label}</span>
      <div className="web-ad-banner-box">
        {adSlot ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client="ca-pub-9961728700267165"
            data-ad-slot={adSlot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client="ca-pub-9961728700267165"
            data-ad-format={format}
            data-full-width-responsive="true"
          >
            {/* Displayed while AdSense is syncing site */}
            <div className="web-ad-banner-inner">
              <div className="ad-badge-orbit small">✦</div>
              <div className="ad-banner-copy">
                <strong>QR LAB PRO — สแกน &amp; สร้าง QR Code ฟรี ไม่มีวันหมดอายุ</strong>
                <small>รองรับเวกเตอร์ SVG คมชัดสูง ปลอดภัย ไม่เก็บข้อมูล</small>
              </div>
            </div>
          </ins>
        )}
      </div>
    </div>
  );
}
