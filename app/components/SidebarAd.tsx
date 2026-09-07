'use client';

import { useEffect } from 'react';

interface SidebarAdProps {
  side: 'left' | 'right';
  adSlot?: string;
  adClient?: string;
  label?: string;
}

export default function SidebarAd({
  side,
  adSlot,
  adClient = 'ca-pub-9961728700267165',
  label = 'โฆษณา / SPONSORED',
}: SidebarAdProps) {
  useEffect(() => {
    // If AdSense script is present and adSlot is configured, push the ad
    if (adSlot && typeof window !== 'undefined') {
      try {
        // @ts-expect-error AdSense adsbygoogle array
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ignore AdSense push error if blocked by adblock
      }
    }
  }, [adSlot]);

  return (
    <aside className={`web-ad-sidebar web-ad-sidebar-${side}`} aria-label={label}>
      <div className="web-ad-sticky">
        <div className="web-ad-header">
          <span className="web-ad-tag">{label}</span>
        </div>

        <div className="web-ad-container">
          {adSlot ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '160px', height: '600px' }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="vertical"
              data-full-width-responsive="false"
            />
          ) : (
            /* Elegant Fallback / Premium Promo Ad Placement */
            <div className="web-ad-fallback">
              <div className="web-ad-card">
                <div className="ad-badge-orbit">
                  <span>✦</span>
                </div>
                <strong>QR CODE MAKER PRO</strong>
                <p>สร้าง QR พร้อมเพย์ &amp; Wi-Fi ไม่จำกัด</p>
                <div className="ad-perks">
                  <span>✓ คมชัดเวกเตอร์ SVG</span>
                  <span>✓ ปลอดภัยไม่เก็บข้อมูล</span>
                  <span>✓ ไม่มีวันหมดอายุ</span>
                </div>
                <a href="#generator" className="ad-cta-btn">
                  สร้างฟรีทันที
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
