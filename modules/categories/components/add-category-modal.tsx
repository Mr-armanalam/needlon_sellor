'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { createCategoryClient } from '../api/category-client';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await createCategoryClient({ name, description });
      setName('');
      setDescription('');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-neutral-100 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-neutral-900" />
            <h3 className="text-[16px] font-bold text-neutral-900">Add New Category</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category Name</label>
            <input 
              type="text" 
              placeholder="e.g. Ethnic Wear, Footwear" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
            <textarea 
              rows={3} 
              placeholder="Brief description of the catalog category..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 rounded-xl">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-neutral-800 transition-all">
              <Plus size={14} />
              <span>{isSubmitting ? 'Saving...' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
