import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Terminal, Info } from 'lucide-react';

const categories = [
  'Bug Report', 'Feature Request', 'General Feedback', 
  'Improvement Suggestion', 'Compliment', 'Complaint', 
  'Payment Issue', 'Delivery Issue', 'Product Management Issue', 'Other'
];

export default function FeedbackForm({ onBack, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Feature Request',
    priority: 'Medium',
    language: 'English (US)'
  });

  // Auto-collected System Telemetry Metadata
  const [systemMeta, setSystemMeta] = useState({
    device: 'Loading telemetry...',
    browser: 'Loading telemetry...',
    appVersion: 'v2.4.1-build-2026'
  });

  useEffect(() => {
    // Safely capture system strings inside the client browser window
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      let browserName = "Unknown Browser";
      
      if (userAgent.match(/chrome|chromium|crios/i)) browserName = "Google Chrome";
      else if (userAgent.match(/firefox|fxios/i)) browserName = "Mozilla Firefox";
      else if (userAgent.match(/safari/i)) browserName = "Apple Safari";

      setSystemMeta({
        device: navigator.platform || "Desktop Workspace",
        browser: browserName,
        appVersion: 'v2.4.1-build-2026'
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;
    
    // Bundle user inputs with telemetry data strings for the backend API route
    const completePayload = { ...formData, ...systemMeta };
    onSubmitSuccess(completePayload);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex-1 overflow-y-auto min-h-0 max-w-2xl mx-auto w-full animate-in fade-in duration-200 space-y-6">
      {/* Form Navigation Header */}
      <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
        <button onClick={onBack} className="p-1.5 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Share Your Experience</h3>
          <p className="text-xs text-gray-400 mt-0.5">Your design critiques directly direct the roadmap trajectory of Needlon.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Short Summary / Title</label>
          <input
            type="text"
            required
            placeholder="e.g., Requesting a multi-currency payment checkout toggle"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Category & Priority Grid split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Feedback Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Severity Priority</label>
            <div className="bg-gray-50 border border-gray-200 p-1 rounded-xl flex items-center gap-1">
              {['Low', 'Medium', 'High'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: lvl })}
                  className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${
                    formData.priority === lvl 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Description Text Area */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detailed Description</label>
          <textarea
            rows={4}
            required
            placeholder="Please detail out your specific context, suggestion parameters, or steps to reproduce structural browser issues..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Asset Attachments Zone */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Media attachments (Optional)</label>
          <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-slate-50/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1">
            <Paperclip className="w-4 h-4 text-gray-400" />
            <p className="text-[11px] font-medium text-gray-500">Drop files here to link screenshots or screen recording logs</p>
          </div>
        </div>

        {/* Automatic Telemetry Metadata Log Banner Block */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2.5 items-start text-gray-500">
          <Terminal className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-[10px] font-mono leading-relaxed space-y-0.5">
            <span className="font-sans font-bold text-gray-700 block text-xs mb-1">Diagnostically Transmitted Telemetry Meta</span>
            <p>● Environment: {systemMeta.device}</p>
            <p>● UserAgent Client: {systemMeta.browser}</p>
            <p>● App Core Version: {systemMeta.appVersion}</p>
          </div>
        </div>

        {/* Submit Interaction Bar */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 pt-3"
        >
          <Send className="w-3.5 h-3.5" /> Submit Feedback Log
        </button>
      </form>
    </div>
  );
}