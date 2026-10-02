'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Download, FileText, FileCode, AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { bulkUploadProductsClient } from '../api/product-client';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkUploadModal({ isOpen, onClose, onSuccess }: BulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const parseAndValidateText = (text: string, fileName: string) => {
    try {
      let items: any[] = [];
      if (fileName.endsWith('.json')) {
        items = JSON.parse(text);
      } else {
        const lines = text.split('\n').filter(l => l.trim() !== '');
        if (lines.length < 2) {
          setValidationErrors(['The uploaded CSV file is empty or missing data rows.']);
          setParsedItems([]);
          return;
        }
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          const row: any = {};
          headers.forEach((h, idx) => {
            row[h] = cols[idx] || '';
          });
          items.push(row);
        }
      }

      if (!Array.isArray(items) || items.length === 0) {
        setValidationErrors(['File contains no valid product rows.']);
        setParsedItems([]);
        return;
      }

      // Validate required fields per row
      const errors: string[] = [];
      items.forEach((item, index) => {
        const rowNum = index + 1;
        const name = item.name || item.title || item.productName;
        const price = item.retailPrice || item.price;
        const stock = item.boutiqueStockCount ?? item.stock ?? item.quantity;

        if (!name) {
          errors.push(`Row ${rowNum}: Missing product name ('name').`);
        }
        if (!price || isNaN(Number(String(price).replace(/[^0-9.]/g, '')))) {
          errors.push(`Row ${rowNum}: Invalid or missing price ('retailPrice').`);
        }
        if (stock === undefined || stock === '' || isNaN(Number(stock))) {
          errors.push(`Row ${rowNum}: Invalid or missing stock count ('boutiqueStockCount').`);
        }
      });

      setValidationErrors(errors);
      setParsedItems(items);
    } catch (err: any) {
      setValidationErrors([`Failed to parse file: ${err.message}`]);
      setParsedItems([]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      setValidationErrors(['Only .csv and .json file formats are supported.']);
      setSelectedFile(null);
      setParsedItems([]);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseAndValidateText(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (parsedItems.length === 0 || validationErrors.length > 0) return;

    try {
      setIsUploading(true);
      await bulkUploadProductsClient(parsedItems);
      alert(`Successfully imported ${parsedItems.length} products to your boutique shelf!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setValidationErrors([`Upload failed: ${err.message}`]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white border border-neutral-100 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[18px] font-bold text-neutral-900 tracking-tight">Bulk Upload Product Catalog</h3>
            <p className="text-[12px] text-neutral-400">Import multiple boutique items at once using CSV or JSON files.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Guidelines & Download Sample Templates Card */}
        <div className="bg-neutral-50/80 border border-neutral-200/60 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-neutral-800 text-[13px] font-bold">
            <Info size={16} className="text-neutral-600" />
            <span>Supported Format & Download Templates</span>
          </div>

          <p className="text-[12px] text-neutral-500 leading-relaxed">
            Your file must include headers for: <strong className="text-neutral-800">name</strong>, <strong className="text-neutral-800">retailPrice</strong>, <strong className="text-neutral-800">category</strong>, and <strong className="text-neutral-800">boutiqueStockCount</strong>. Optional headers: <span className="text-neutral-600 font-mono text-[11px]">subcategory, brandLabel, sizesMatrix, colorsTrack, fabricMaterial, uniqueSku, packageWeight, searchKeywords, descriptionStory</span>.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <a 
              href="/sample-products.csv" 
              download="sample-products.csv"
              className="px-3.5 py-2 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 text-[12px] font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <FileText size={14} className="text-emerald-600" />
              <span>Download Sample CSV</span>
              <Download size={12} className="text-neutral-400" />
            </a>

            <a 
              href="/sample-products.json" 
              download="sample-products.json"
              className="px-3.5 py-2 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 text-[12px] font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <FileCode size={14} className="text-blue-600" />
              <span>Download Sample JSON</span>
              <Download size={12} className="text-neutral-400" />
            </a>
          </div>
        </div>

        {/* Dropzone Area */}
        <input 
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        <div 
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDraggingOver(false); }}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            isDraggingOver 
              ? "border-neutral-900 bg-neutral-100/80" 
              : "border-neutral-200 hover:border-neutral-400 bg-neutral-50/40"
          }`}
        >
          <div className="p-3 rounded-2xl bg-white text-neutral-600 shadow-sm border border-neutral-100">
            <Upload size={20} />
          </div>

          {selectedFile ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-[13px] font-bold text-neutral-900">{selectedFile.name}</span>
              <span className="text-[11px] text-neutral-400 font-medium">
                {(selectedFile.size / 1024).toFixed(1)} KB • {parsedItems.length} products parsed
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-[13px] font-bold text-neutral-800">
                {isDraggingOver ? "Drop CSV or JSON file here" : "Click to select CSV or JSON catalog file"}
              </span>
              <span className="text-[11px] text-neutral-400">Supports .csv or .json formatted catalog exports</span>
            </div>
          )}
        </div>

        {/* Validation Errors Box */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200/80 rounded-2xl p-4 flex flex-col gap-2 animate-fade-in">
            <div className="flex items-center gap-2 text-red-700 text-[13px] font-bold">
              <AlertTriangle size={15} />
              <span>Validation Issues Found ({validationErrors.length})</span>
            </div>
            <div className="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
              {validationErrors.map((err, i) => (
                <span key={i} className="text-[11px] text-red-600 font-medium font-mono">• {err}</span>
              ))}
            </div>
          </div>
        )}

        {/* Success Preview Notice */}
        {parsedItems.length > 0 && validationErrors.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-2.5 text-emerald-800 text-[12px] font-bold animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Ready to import {parsedItems.length} products into your boutique database.</span>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4 mt-2">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={parsedItems.length === 0 || validationErrors.length > 0 || isUploading}
            onClick={handleUploadSubmit}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm outline-none disabled:opacity-50 disabled:pointer-events-none"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{isUploading ? "Importing Products..." : "Import Products Now"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
