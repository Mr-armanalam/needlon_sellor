'use client'
import React, { useState } from 'react';
import { Layers, PlusCircle, History } from 'lucide-react';
import FeedbackRoadmap from '../view/feedback-roadmap';
import FeedbackForm from '../view/feedback-form';
import FeedbackTracker from '../view/feedback-tacker';

export default function FeedbackCenterPage() {
  const [activeTab, setActiveTab] = useState('roadmap'); // roadmap, form, tracker

  const handleFormSubmitSuccess = (payload) => {
    // Production integration hook: send payload to database route here
    alert(`Thank you! Feedback logged successfully under "${payload.category}" tab.`);
    setActiveTab('tracker');
  };

  return (
    /* Strictly constrained layout sizing to fit dashboard view boundaries perfectly */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* 1. Global Page Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Feedback & Feature Ecosystem</h1>
          <p className="text-xs text-gray-400 mt-0.5">Vote for features, track bug fixes, or submit optimization ideas directly into the core roadmap.</p>
        </div>

        {/* 2. Top-Level Section Tab Selectors */}
        <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Feature Roadmap
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'form' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Share Feedback
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'tracker' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Tracker Status
          </button>
        </div>
      </div>

      {/* 3. Main Dynamic Content Frame (Scroll Isolated Area) */}
      <div className="flex-1 flex flex-col min-h-0 w-full relative">
        {activeTab === 'roadmap' && (
          <FeedbackRoadmap 
            onCreateFeedbackClick={() => setActiveTab('form')} 
          />
        )}

        {activeTab === 'form' && (
          <FeedbackForm 
            onBack={() => setActiveTab('roadmap')} 
            onSubmitSuccess={handleFormSubmitSuccess}
          />
        )}

        {activeTab === 'tracker' && (
          <FeedbackTracker />
        )}
      </div>

    </div>
  );
}