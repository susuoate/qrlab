'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseInMaker: (text: string) => void;
  lang: 'th' | 'en';
}

export default function QrScannerModal({
  isOpen,
  onClose,
  onUseInMaker,
  lang,
}: QrScannerModalProps) {
  const [tab, setTab] = useState<'camera' | 'upload'>('camera');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTh = lang === 'th';

  // Camera cleanup helper
  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start live camera stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        requestScan();
      }
    } catch {
      setCameraError(
        isTh
          ? 'ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการเข้าถึงกล้องในเบราว์เซอร์ หรือใช้วิธีอัปโหลดรูปภาพ'
          : 'Could not access camera. Please allow camera permissions or upload an image.'
      );
    }
  };

  // Live video frame scanning loop
  const requestScan = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(requestScan);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      setScanResult(code.data);
      stopCamera();
      return;
    }

    animFrameRef.current = requestAnimationFrame(requestScan);
  };

  useEffect(() => {
    if (isOpen && tab === 'camera' && !scanResult) {
      void startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, tab, scanResult]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });

      if (code && code.data) {
        setScanResult(code.data);
      } else {
        setUploadError(
          isTh
            ? 'ไม่พบ QR Code ในรูปภาพนี้ กรุณาลองรูปภาพที่เห็น QR Code ชัดเจนขึ้น'
            : 'No QR Code found in this image. Please try a clearer photo.'
        );
      }
    };
    img.src = URL.createObjectURL(file);
    e.target.value = '';
  };

  const handleCopy = async () => {
    if (!scanResult) return;
    await navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = Boolean(scanResult && /^https?:\/\//i.test(scanResult.trim()));

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card scanner-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{isTh ? 'สแกน QR Code' : 'Scan QR Code'}</h3>
            <p className="modal-subtitle">
              {isTh
                ? 'สแกนผ่านกล้องสด หรือเลือกรูปภาพจากคลังภาพ'
                : 'Scan via live camera or upload an image file'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {!scanResult ? (
          <>
            <div className="scanner-tabs">
              <button
                type="button"
                className={`scanner-tab-btn ${tab === 'camera' ? 'active' : ''}`}
                onClick={() => {
                  setTab('camera');
                  setCameraError(null);
                }}
              >
                📹 {isTh ? 'กล้องสด' : 'Live Camera'}
              </button>
              <button
                type="button"
                className={`scanner-tab-btn ${tab === 'upload' ? 'active' : ''}`}
                onClick={() => {
                  setTab('upload');
                  stopCamera();
                }}
              >
                🖼️ {isTh ? 'อัปโหลดรูปภาพ' : 'Upload Image'}
              </button>
            </div>

            {tab === 'camera' && (
              <div className="camera-viewport-wrap">
                {cameraError ? (
                  <div className="scanner-error-card">
                    <p>{cameraError}</p>
                    <button type="button" className="btn-secondary" onClick={() => void startCamera()}>
                      {isTh ? 'ลองใหม่อีกครั้ง' : 'Retry'}
                    </button>
                  </div>
                ) : (
                  <div className="camera-viewport">
                    <video ref={videoRef} playsInline muted className="scanner-video" />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className="scanner-target-box">
                      <div className="scanner-laser" />
                    </div>
                  </div>
                )}
                <p className="scanner-hint">
                  {isTh ? 'ส่องกล้องไปที่ QR Code ให้พอดีกับกรอบ' : 'Point camera at the QR code to scan'}
                </p>
              </div>
            )}

            {tab === 'upload' && (
              <div className="upload-viewport-wrap">
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="dropzone-icon">📷</span>
                  <strong>{isTh ? 'คลิกเพื่อเลือกรูปภาพ QR Code' : 'Click to select QR Code image'}</strong>
                  <small>{isTh ? 'รองรับ PNG, JPG, WEBP, SVG' : 'Supports PNG, JPG, WEBP, SVG'}</small>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </div>
                {uploadError && <p className="field-error mt-3">{uploadError}</p>}
              </div>
            )}
          </>
        ) : (
          <div className="scan-result-card">
            <div className="result-badge">
              <span>✓</span> {isTh ? 'ถอดรหัสสำเร็จ' : 'Decoded Successfully'}
            </div>
            <div className="result-content-box">
              <pre>{scanResult}</pre>
            </div>

            <div className="result-actions">
              <button type="button" className="btn-primary" onClick={handleCopy}>
                {copied ? (isTh ? 'คัดลอกแล้ว ✓' : 'Copied! ✓') : (isTh ? 'คัดลอกข้อความ' : 'Copy Text')}
              </button>

              {isUrl && (
                <a
                  href={scanResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {isTh ? 'เปิดลิงก์ ↗' : 'Open Link ↗'}
                </a>
              )}

              <button
                type="button"
                className="btn-accent"
                onClick={() => {
                  onUseInMaker(scanResult);
                  onClose();
                }}
              >
                {isTh ? 'นำไปสร้าง QR ใหม่' : 'Load in QR Maker'}
              </button>
            </div>

            <button
              type="button"
              className="btn-link mt-3"
              onClick={() => {
                setScanResult(null);
                if (tab === 'camera') void startCamera();
              }}
            >
              {isTh ? '← สแกนอีกครั้ง' : '← Scan Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
