'use client';


import { apiFetch } from "@/modules/auth/lib/auth-client";
import React, { useState } from 'react';
import { X, Scissors, Ruler, Loader2 } from 'lucide-react';

interface RecordMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  onMeasurementSaved: () => void;
}

const GARMENT_OPTIONS = [
  { value: 'shirt', label: 'Shirt', gender: 'menswear' },
  { value: 'pant', label: 'Trousers / Pant', gender: 'menswear' },
  { value: 'kurta', label: 'Kurta', gender: 'menswear' },
  { value: 'safari_suit', label: 'Safari Suit Jacket', gender: 'menswear' },
  { value: 'blazer', label: 'Suit Jacket / Blazer', gender: 'menswear' },
  { value: 'waistcoat', label: 'Waistcoat', gender: 'menswear' },
  { value: 'coat', label: 'Overcoat', gender: 'menswear' },
  { value: 'lehenga', label: 'Lehenga', gender: 'womenswear' },
  { value: 'blouse', label: 'Blouse (Saree/Lehenga)', gender: 'womenswear' },
  { value: 'ladies_jacket', label: 'Ladies Jacket', gender: 'womenswear' },
  { value: 'ladies_coat', label: 'Ladies Coat', gender: 'womenswear' },
];

const DEFAULT_METRICS: Record<string, string[]> = {
  shirt: [
    'neck_circumference',
    'chest_circumference',
    'waist_circumference',
    'shoulder_width',
    'sleeve_length',
    'shirt_length',
    'bicep_circumference',
  ],
  pant: [
    'waist_circumference',
    'hip_seat_circumference',
    'outseam_length',
    'inseam_length',
    'crotch_rise_depth',
    'thigh_circumference',
    'bottom_hem_opening',
  ],
  kurta: [
    'collar_neck_circumference',
    'chest_circumference',
    'waist_stomach_circumference',
    'shoulder_width',
    'sleeve_length',
    'kurta_full_length',
  ],
  blazer: [
    'chest_circumference',
    'waist_circumference',
    'hip_seat_circumference',
    'shoulder_width',
    'sleeve_length',
    'jacket_length',
  ],
  safari_suit: [
    'neck_circumference',
    'shoulder_width',
    'chest_circumference',
    'waist_circumference',
    'sleeve_length',
    'safari_jacket_length',
  ],
  waistcoat: [
    'chest_circumference',
    'waist_stomach_circumference',
    'front_length_to_point',
    'back_length',
  ],
  lehenga: [
    'waist_wear_point_circumference',
    'high_hip_circumference',
    'full_hip_circumference',
    'lehenga_length_waist_to_floor',
    'flare_ghera_target_width',
  ],
  blouse: [
    'upper_bust_circumference',
    'bust_circumference',
    'under_bust_circumference',
    'waist_blouse_hem_circumference',
    'shoulder_width',
    'blouse_length',
    'sleeve_length',
  ],
};

export default function RecordMeasurementModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  onMeasurementSaved,
}: RecordMeasurementModalProps) {
  const [garmentType, setGarmentType] = useState('shirt');
  const [gender, setGender] = useState<'menswear' | 'womenswear'>('menswear');
  const [unit, setUnit] = useState<'INCHES' | 'CM'>('INCHES');
  const [fitPreference, setFitPreference] = useState<'SLIM' | 'REGULAR' | 'COMFORT'>('REGULAR');
  const [essentialMetrics, setEssentialMetrics] = useState<Record<string, string>>({});
  const [tailorNotes, setTailorNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMetricKeys = DEFAULT_METRICS[garmentType] || [
    'chest_circumference',
    'waist_circumference',
    'shoulder_width',
    'length',
  ];

  const handleMetricChange = (key: string, val: string) => {
    setEssentialMetrics((prev) => ({ ...prev, [key]: val }));
  };

  const handleGarmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setGarmentType(val);
    const found = GARMENT_OPTIONS.find((g) => g.value === val);
    if (found) {
      setGender(found.gender as 'menswear' | 'womenswear');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Build numeric object
    const numericMetrics: Record<string, number> = {};
    for (const [k, v] of Object.entries(essentialMetrics)) {
      const num = parseFloat(v);
      if (!isNaN(num) && num > 0) {
        numericMetrics[k] = num;
      }
    }

    if (Object.keys(numericMetrics).length === 0) {
      setError('Please enter at least one measurement metric');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/seller/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customerId,
          gender,
          garmentType,
          measurementUnit: unit,
          essentialMeasurements: numericMetrics,
          fitPreference,
          tailorNotes: tailorNotes.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to save measurement');
      }

      onMeasurementSaved();
      onClose();
      setEssentialMetrics({});
      setTailorNotes('');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message || 'Error recording measurements' : 'Error recording measurements',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-900 text-white rounded-xl">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Record In-Store Measurement</h3>
              <p className="text-xs text-gray-500">Master cutter entry for {customerName}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Garment & Category Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Garment Type
              </label>
              <select
                value={garmentType}
                onChange={handleGarmentChange}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
              >
                {GARMENT_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Gender Classification
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'menswear' | 'womenswear')}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
              >
                <option value="menswear">Menswear</option>
                <option value="womenswear">Womenswear</option>
              </select>
            </div>
          </div>

          {/* Unit & Fit Preference Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Measurement Unit
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUnit('INCHES')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    unit === 'INCHES'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('CM')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    unit === 'CM'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Fit Silhouette
              </label>
              <select
                value={fitPreference}
                onChange={(e) => setFitPreference(e.target.value as 'SLIM' | 'REGULAR' | 'COMFORT')}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
              >
                <option value="SLIM">Slim Fit</option>
                <option value="REGULAR">Regular Classic Fit</option>
                <option value="COMFORT">Comfort / Relaxed Fit</option>
              </select>
            </div>
          </div>

          {/* Essential Measurements Inputs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" /> Essential Metrics ({unit === 'INCHES' ? 'in' : 'cm'})
              </label>
              <span className="text-[10px] text-gray-400">Master Tape Values</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              {currentMetricKeys.map((key) => (
                <div key={key}>
                  <label className="block text-[11px] font-medium text-gray-600 capitalize mb-0.5 truncate">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="0.0"
                    value={essentialMetrics[key] || ''}
                    onChange={(e) => handleMetricChange(key, e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tailor Cutting Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tailor Master Instructions & Posture Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Right shoulder sloping by 0.5 in; add 1 inch ease around bicep..."
              value={tailorNotes}
              onChange={(e) => setTailorNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
            />
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Saving...' : 'Save In-Store Measurement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
