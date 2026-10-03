'use client';

import React, { useEffect, useRef } from 'react';
import { X, QrCode, Download, Check } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopUrl?: string;
  storeName?: string;
}

export default function QRCodeModal({ isOpen, onClose, shopUrl = 'https://needlon.com/store/demo-store', storeName = 'My Needlon Store' }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 240;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw QR pattern simulation with quiet zone & corner finders
    ctx.fillStyle = '#0F172A';
    
    // Draw corner 1 (top-left)
    drawFinderPattern(ctx, 20, 20, 50);
    // Draw corner 2 (top-right)
    drawFinderPattern(ctx, 170, 20, 50);
    // Draw corner 3 (bottom-left)
    drawFinderPattern(ctx, 20, 170, 50);

    // Draw pseudo random QR grid blocks
    const cellSize = 10;
    const cols = 20;
    const rows = 20;
    
    // Seeded matrix representation of shopUrl
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip finder areas
        if ((r < 7 && c < 7) || (r < 7 && c > 12) || (r > 12 && c < 7)) continue;
        const charCode = shopUrl.charCodeAt((r * cols + c) % shopUrl.length);
        if ((charCode * (r + 1) * (c + 1)) % 3 === 0) {
          ctx.fillRect(20 + c * 10, 20 + r * 10, cellSize, cellSize);
        }
      }
    }

    // Center store logo badge
    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.roundRect(100, 100, 40, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 120, 120);

  }, [isOpen, shopUrl]);

  function drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 7, y + 7, size - 14, size - 14);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 14, y + 14, size - 28, size - 28);
  }

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${storeName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-sm w-full p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Dynamic Store QR Code</h3>
              <p className="text-[11px] text-gray-400">High-resolution print graphics</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3 py-2 bg-slate-50 rounded-2xl border border-gray-100 p-4">
          <canvas ref={canvasRef} className="rounded-xl shadow-md border border-white" />
          <p className="text-xs font-bold text-gray-800 text-center">{storeName}</p>
          <div className="flex items-center gap-1.5 max-w-full bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-[10px] text-gray-500 font-mono truncate max-w-[180px]">{shopUrl}</span>
            <button onClick={handleCopyUrl} className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
