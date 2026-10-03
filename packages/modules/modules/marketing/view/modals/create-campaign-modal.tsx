'use client';

import React, { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { CreateCampaignDto } from '../../dto/marketing.dto';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateCampaignDto) => Promise<void>;
}

export default function CreateCampaignModal({ isOpen, onClose, onSubmit }: CreateCampaignModalProps) {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'WHATSAPP' | 'INSTAGRAM' | 'GOOGLE' | 'EMAIL' | 'CUSTOM'>('WHATSAPP');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name, channel, description });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Launch Growth Campaign</h3>
              <p className="text-[11px] text-gray-400">Deploy marketing pushes across channels</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Campaign Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Festival Blast Promo"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Channel</label>
            <select
              value={channel}
              onChange={(e: any) => setChannel(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="WHATSAPP">WhatsApp Blast</option>
              <option value="INSTAGRAM">Instagram Ads</option>
              <option value="GOOGLE">Google Search</option>
              <option value="EMAIL">Direct Email</option>
              <option value="CUSTOM">Custom Social</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Target audience or messaging strategy..."
              rows={3}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Launching...' : 'Launch Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
