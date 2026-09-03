'use client';

import { useRef } from 'react';
import { PRESET_LOGOS } from '../lib/presetLogos';
import type { LogoConfig } from '../lib/types';

interface LogoSelectorProps {
  logoConfig: LogoConfig;
  onChange: (config: LogoConfig) => void;
  title: string;
  noLogoText: string;
  uploadCustomText: string;
  removeLogoText: string;
}

export default function LogoSelector({
  logoConfig,
  onChange,
  title,
  noLogoText,
  uploadCustomText,
  removeLogoText,
}: LogoSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพ เช่น PNG, JPG หรือ SVG');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          type: 'custom',
          customDataUri: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be chosen again if desired
    event.target.value = '';
  };

  return (
    <div className="logo-selector-wrapper">
      <div className="logo-selector-header">
        <label className="field-label">{title}</label>
        {logoConfig.type !== 'none' && (
          <button
            type="button"
            className="text-btn-remove"
            onClick={() => onChange({ type: 'none' })}
          >
            {removeLogoText}
          </button>
        )}
      </div>

      <div className="logo-options-grid">
        <button
          type="button"
          className={`logo-option-btn ${logoConfig.type === 'none' ? 'active' : ''}`}
          onClick={() => onChange({ type: 'none' })}
          title={noLogoText}
        >
          <span className="logo-none-mark">∅</span>
          <small>{noLogoText}</small>
        </button>

        {PRESET_LOGOS.map((preset) => {
          const isSelected = logoConfig.type === 'preset' && logoConfig.presetId === preset.id;
          return (
            <button
              type="button"
              key={preset.id}
              className={`logo-option-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onChange({ type: 'preset', presetId: preset.id })}
              title={preset.name}
            >
              <img src={preset.iconSvg} alt={preset.name} className="logo-preset-icon" />
              <small>{preset.name}</small>
            </button>
          );
        })}

        <button
          type="button"
          className={`logo-option-btn upload-btn ${logoConfig.type === 'custom' ? 'active' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          title={uploadCustomText}
        >
          {logoConfig.type === 'custom' && logoConfig.customDataUri ? (
            <img src={logoConfig.customDataUri} alt="Custom Logo" className="logo-preset-icon custom-preview" />
          ) : (
            <span className="logo-upload-mark">📁</span>
          )}
          <small>{logoConfig.type === 'custom' ? 'เปลี่ยนภาพ' : uploadCustomText}</small>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}
