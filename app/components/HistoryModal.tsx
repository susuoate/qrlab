'use client';

import type { HistoryItem } from '../lib/types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  lang: 'th' | 'en';
}

function formatTimestamp(ts: number, lang: 'th' | 'en'): string {
  const date = new Date(ts);
  return date.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTypeBadge(type: string, isTh: boolean): string {
  switch (type) {
    case 'promptpay':
      return 'พร้อมเพย์';
    case 'wifi':
      return 'Wi-Fi';
    case 'social':
      return isTh ? 'โซเชียล' : 'Social';
    case 'tel':
      return isTh ? 'เบอร์โทร' : 'Phone';
    case 'vcard':
      return isTh ? 'นามบัตร' : 'vCard';
    case 'text':
      return isTh ? 'ข้อความ' : 'Text';
    default:
      return 'URL';
  }
}

export default function HistoryModal({
  isOpen,
  onClose,
  items,
  onSelect,
  onDelete,
  onClearAll,
  lang,
}: HistoryModalProps) {
  const isTh = lang === 'th';

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{isTh ? 'ประวัติการสร้างล่าสุด' : 'Recent QR History'}</h3>
            <p className="modal-subtitle">
              {isTh
                ? 'จัดเก็บในอุปกรณ์ของคุณสูงสุด 20 รายการ'
                : 'Stored privately on this device (up to 20 items)'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="history-empty-state">
            <span className="empty-icon">📂</span>
            <p>{isTh ? 'ยังไม่มีประวัติการสร้าง QR Code' : 'No saved QR codes found.'}</p>
            <small>
              {isTh
                ? 'เมื่อคุณดาวน์โหลดหรือบันทึก QR Code ระบบจะจำรายการล่าสุดไว้ที่นี่'
                : 'Whenever you download or save a QR code, it will appear here.'}
            </small>
          </div>
        ) : (
          <>
            <div className="history-list">
              {items.map((item) => (
                <div key={item.id} className="history-item-row">
                  <div className="history-item-info" onClick={() => onSelect(item)}>
                    <div className="history-item-head">
                      <span className="history-type-badge">{getTypeBadge(item.type, isTh)}</span>
                      <span className="history-date">{formatTimestamp(item.createdAt, lang)}</span>
                    </div>
                    <strong className="history-item-title">{item.title}</strong>
                    <p className="history-item-payload" title={item.payload}>
                      {item.payload}
                    </p>
                  </div>
                  <div className="history-item-actions">
                    <button
                      type="button"
                      className="btn-history-load"
                      onClick={() => onSelect(item)}
                      title={isTh ? 'นำกลับมาแก้ไข' : 'Load in Maker'}
                    >
                      {isTh ? 'แก้ไข' : 'Load'}
                    </button>
                    <button
                      type="button"
                      className="btn-history-del"
                      onClick={() => onDelete(item.id)}
                      title={isTh ? 'ลบรายการนี้' : 'Delete'}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="history-modal-footer">
              <button
                type="button"
                className="btn-clear-history"
                onClick={() => {
                  if (confirm(isTh ? 'ต้องการล้างประวัติทั้งหมดหรือไม่?' : 'Clear all saved history?')) {
                    onClearAll();
                  }
                }}
              >
                {isTh ? 'ล้างประวัติทั้งหมด' : 'Clear All History'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
