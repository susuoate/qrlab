'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '../app/lib/types';
import { translations } from '../app/lib/i18n';
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
  message: '',
};

function getErrorMessage(error: unknown, lang: Language): string {
  const t = translations[lang];
  if (typeof error === 'object' && error && 'userCancelled' in error && error.userCancelled) {
    return t.supportCancelled;
  }
  if (error instanceof Error) {
    if (error.message.includes('product-unavailable')) {
      return t.supportSyncingWait;
    }
    return `${t.supportFailed}: ${error.message}`;
  }
  return t.supportConnectionFailed;
}

interface SupportPanelProps {
  lang?: Language;
}

export default function SupportPanel({ lang = 'th' }: SupportPanelProps) {
  const t = translations[lang];
  const moduleRef = useRef<MonetizationModule | null>(null);
  const [state, setState] = useState<MonetizationState>(initialState);
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
            message: t.supportStoreUnavailable,
          }));
        }
      });
    return () => { active = false; };
  }, [t.supportStoreUnavailable]);

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
      setState((current) => ({ ...current, message: getErrorMessage(error, lang) }));
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
      setState((current) => ({ ...current, message: getErrorMessage(error, lang) }));
    } finally {
      setBusyAction('');
    }
  };

  const openPrivacyOptions = async () => {
    if (!moduleRef.current) return;
    try {
      await moduleRef.current.showAdPrivacyOptions();
    } catch {
      setState((current) => ({ ...current, message: t.supportPrivacyFailed }));
    }
  };

  const canPurchase = state.status === 'free' && !busyAction;
  const displayMessage =
    state.status === 'loading'
      ? t.supportChecking
      : state.message || (state.status === 'unavailable' ? t.supportStoreUnavailable : '');

  return (
    <section className={`support-section ${state.status === 'supporter' ? 'is-supporter' : ''}`} aria-labelledby="support-title">
      <div className="support-copy">
        <span className="section-kicker">{t.supportKicker}</span>
        <h2 id="support-title">{t.supportTitle}</h2>
        <p>{t.supportDesc}</p>
        {displayMessage && (
          <p className="support-status" aria-live="polite">{displayMessage}</p>
        )}
      </div>

      {state.status === 'supporter' ? (
        <div className="supporter-unlocked">
          <span>✓</span>
          <strong>{t.supportUnlockedTitle}</strong>
          <small>{t.supportUnlockedDesc}</small>
        </div>
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
              <span>{index === 0 ? t.supportBtn1 : t.supportBtn2}</span>
              <strong>{busyAction === product.id ? t.supportOpeningStore : product.price}</strong>
              <small>{t.supportAdFreeBadge}</small>
            </button>
          ))}
          <button
            className="restore-button"
            type="button"
            disabled={Boolean(busyAction) || state.status === 'loading'}
            onClick={restore}
          >
            {busyAction === 'restore' ? t.supportRestoring : t.supportRestoreBtn}
          </button>
          {state.privacyOptionsRequired && (
            <button className="privacy-options-button" type="button" onClick={openPrivacyOptions}>
              {t.supportAdPrivacyBtn}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
