'use client';

import { useEffect, useRef, useState } from 'react';
import type { MonetizationState } from './monetization';

type MonetizationModule = typeof import('./monetization');

const initialState: MonetizationState = {
  status: 'loading',
  products: [
    { id: 'qrlab_supporter_49', title: 'Supporter', price: '฿49' },
    { id: 'qrlab_supporter_100', title: 'Supporter Plus', price: '฿100' },
  ],
  adsVisible: false,
  privacyOptionsRequired: false,
  message: 'กำลังตรวจสอบสิทธิ์จาก Store…',
};

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'userCancelled' in error && error.userCancelled) {
    return 'ยกเลิกการซื้อแล้ว ไม่มีการเรียกเก็บเงิน';
  }
  return 'ทำรายการไม่สำเร็จ กรุณาตรวจการเชื่อมต่อและลองใหม่';
}

export default function SupportPanel() {
  const moduleRef = useRef<MonetizationModule | null>(null);
  const [state, setState] = useState(initialState);
  const [busyAction, setBusyAction] = useState('');

  useEffect(() => {
    let active = true;
    void import('./monetization')
      .then(async (monetization) => {
        moduleRef.current = monetization;
        const nextState = await monetization.initializeMonetization();
        if (active) setState(nextState);
      })
      .catch(() => {
        if (active) {
          setState((current) => ({
            ...current,
            status: 'unavailable',
            message: 'โหลดระบบ Store ไม่สำเร็จ กรุณาเปิดแอปใหม่อีกครั้ง',
          }));
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('native-banner-visible', state.adsVisible);
    return () => document.documentElement.classList.remove('native-banner-visible');
  }, [state.adsVisible]);

  const purchase = async (productId: string) => {
    if (!moduleRef.current) return;
    setBusyAction(productId);
    try {
      setState(await moduleRef.current.purchaseSupport(productId));
    } catch (error) {
      setState((current) => ({ ...current, message: getErrorMessage(error) }));
    } finally {
      setBusyAction('');
    }
  };

  const restore = async () => {
    if (!moduleRef.current) return;
    setBusyAction('restore');
    try {
      setState(await moduleRef.current.restoreSupport());
    } catch (error) {
      setState((current) => ({ ...current, message: getErrorMessage(error) }));
    } finally {
      setBusyAction('');
    }
  };

  const openPrivacyOptions = async () => {
    if (!moduleRef.current) return;
    try {
      await moduleRef.current.showAdPrivacyOptions();
    } catch {
      setState((current) => ({ ...current, message: 'เปิดการตั้งค่าความเป็นส่วนตัวไม่สำเร็จ' }));
    }
  };

  const canPurchase = state.status === 'free' && !busyAction;

  return (
    <section className={`support-section ${state.status === 'supporter' ? 'is-supporter' : ''}`} aria-labelledby="support-title">
      <div className="support-copy">
        <span className="section-kicker">SUPPORT QR LAB</span>
        <h2 id="support-title">สนับสนุนแอป<br />พร้อมปิดโฆษณาถาวร</h2>
        <p>เลือกสนับสนุน 49 หรือ 100 บาท ทั้งสองระดับซื้อครั้งเดียวและได้รับสิทธิ์ไม่มีโฆษณาเหมือนกัน</p>
        <p className="support-status" aria-live="polite">{state.message}</p>
      </div>

      {state.status === 'supporter' ? (
        <div className="supporter-unlocked"><span>✓</span><strong>SUPPORTER</strong><small>ไม่มีโฆษณาถาวร</small></div>
      ) : (
        <div className="support-actions">
          {state.products.map((product, index) => (
            <button
              type="button"
              key={product.id}
              className={index === 1 ? 'support-plus' : ''}
              disabled={!canPurchase}
              onClick={() => purchase(product.id)}
            >
              <span>{index === 0 ? 'สนับสนุน' : 'สนับสนุนพิเศษ'}</span>
              <strong>{busyAction === product.id ? 'กำลังเปิด Store…' : product.price}</strong>
              <small>ปลดโฆษณาถาวร</small>
            </button>
          ))}
          <button className="restore-button" type="button" disabled={Boolean(busyAction) || state.status === 'loading'} onClick={restore}>
            {busyAction === 'restore' ? 'กำลังกู้คืน…' : 'กู้คืนการซื้อ'}
          </button>
          {state.privacyOptionsRequired && (
            <button className="privacy-options-button" type="button" onClick={openPrivacyOptions}>
              ตั้งค่าความเป็นส่วนตัวโฆษณา
            </button>
          )}
        </div>
      )}
    </section>
  );
}
