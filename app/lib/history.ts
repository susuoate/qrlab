import type { HistoryItem, ImageFormat, QrType } from './types';

const STORAGE_KEY = 'qrlab_history_v1';
const MAX_ITEMS = 20;

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_ITEMS);
    }
  } catch {
    // Ignore storage parse errors
  }
  return [];
}

export function saveHistoryItem(item: {
  type: QrType;
  title: string;
  payload: string;
  darkColor: string;
  lightColor: string;
  format: ImageFormat;
}): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getHistory();
    // Prevent immediate duplicate of same payload
    const filtered = current.filter((it) => it.payload !== item.payload);
    const newItem: HistoryItem = {
      ...item,
      id: `qr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getHistory();
    const updated = current.filter((it) => it.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
