'use client'
import React, { useState } from 'react';
import SettingsNav from '../view/setting-nav';
import SettingsContent from '../view/setting-content';


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    /* Constrained height parameters ensure the sidebar and content scroll isolated from each other */
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-6 bg-slate-50 flex-col space-y-6 min-h-0">
      
      {/* Page Header */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Configure platform themes, manage verification security profiles, and define fulfillment rules.</p>
      </div>

      {/* Main Split Grid Wrapper Container */}
      <div className="flex flex-1 w-full bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 min-h-0 flex-col md:flex-row">
        
        {/* Left Side: Category Navigator Rail Menu */}
        <SettingsNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Right Side: Form Configuration Content Workspace */}
        <SettingsContent 
          activeTab={activeTab} 
        />

      </div>
    </div>
  );
}