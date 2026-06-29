'use client'
import React, { useState } from 'react';
import { HelpCircle, BookOpen, LifeBuoy } from 'lucide-react';
import HelpDashboard from '../view/help-dashboard';
import KnowledgeBase from '../view/knowledge-base';
import SupportCenter from '../view/support-center';


export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, kb, support

  return (
    /* Strictly constrained layout sizing to fit layout view boundaries perfectly */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* 1. Global Page Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Partner Support & Academy</h1>
          <p className="text-xs text-gray-400 mt-0.5">Learn store optimization tactics, track system checklists, or manage open support tickets.</p>
        </div>

        {/* 2. Top-Level Section Tab Selectors */}
        <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('kb')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'kb' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Guides
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'support' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" /> Support Center
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Display Area (Scroll Isolated Container) */}
      <div className="flex-1 flex flex-col min-h-0 w-full relative">
        {activeTab === 'dashboard' && (
          <HelpDashboard 
            onNavigateToSection={(target) => setActiveTab(target)} 
          />
        )}

        {activeTab === 'kb' && (
          <KnowledgeBase 
            onBack={() => setActiveTab('dashboard')} 
          />
        )}

        {activeTab === 'support' && (
          <SupportCenter 
            onBack={() => setActiveTab('dashboard')} 
          />
        )}
      </div>

    </div>
  );
}