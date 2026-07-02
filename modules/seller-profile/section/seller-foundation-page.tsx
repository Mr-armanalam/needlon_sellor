'use client'
import React, { useState, useTransition, ReactNode } from 'react';
import { Building2, Store, MapPin, CreditCard, Settings, ArrowRight } from 'lucide-react';
import BusinessIdentitySection from '../ui/buisiness-identity-section';
import StoreManagementSection from '../ui/store-management';
import AddressManagementSection from '../ui/address-management';
import BankAndPayoutSection from '../ui/bank-and-payout';
import SellerSettingsSection from '../ui/seller-setting';


export type WorkspaceTab = 'overview' | 'identity' | 'store' | 'locations' | 'payouts' | 'preferences';
export type SaveStatus = 'Saved ✓' | 'Saving...' | 'Changes pending';

export default function SellerFoundationPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('Saved ✓');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerContent, setDrawerContent] = useState<ReactNode | null>(null);

  const setupPercent = 72;
  const missingStepsCount = 3;

  const handleTabSwitch = (id: WorkspaceTab) => {
    startTransition(() => {
      setActiveTab(id);
    });
  };

  const triggerDrawer = (contentNode: ReactNode) => {
    setDrawerContent(contentNode);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden font-sans antialiased bg-slate-50/50 p-4 relative min-h-0">
      
      {/* 1. SLIDE-OVER DRAWER OVERLAY */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-gray-100 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300 min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              {drawerContent}
            </div>
          </div>
        </div>
      )}

      {/* Main Structural Boundary */}
      <div className="flex flex-1 w-full bg-white rounded-3xl shadow-xs overflow-hidden border border-gray-200/80 min-h-0">
        
        {/* DESKTOP SIDEBAR RAIL */}
        <aside className="w-64 border-r border-gray-200 bg-white h-full flex flex-col justify-between flex-shrink-0 hidden md:flex min-h-0">
          <div className="p-4 border-b border-gray-50 flex-shrink-0">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Setup Workspace</h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
            {[
              { id: 'overview' as const, label: 'Overview', icon: <Building2 className="w-4 h-4" /> },
              { id: 'identity' as const, label: 'Business Identity', icon: <Building2 className="w-4 h-4" /> },
              { id: 'store' as const, label: 'Storefront', icon: <Store className="w-4 h-4" /> },
              { id: 'locations' as const, label: 'Business Locations', icon: <MapPin className="w-4 h-4" /> },
              { id: 'payouts' as const, label: 'Payouts & Banking', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'preferences' as const, label: 'Preferences', icon: <Settings className="w-4 h-4" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabSwitch(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/10' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* STICKY SETUP PROGRESS CARD */}
          <div className="p-4 border-t border-gray-50 bg-slate-50/50 flex-shrink-0 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-gray-700">
                <span>Total Progress</span>
                <span>{setupPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${setupPercent}%` }} />
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-[11px] space-y-1">
              <span className="font-bold text-gray-800 block">Next Recommended Step:</span>
              <p className="text-gray-500 font-medium">Upload your custom store banner graphic.</p>
              <span className="text-blue-600 font-bold block pt-1">Estimated: 30 sec</span>
            </div>
          </div>
        </aside>

        {/* WORKSPACE FRAME CONTENT PANEL */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/40">
          <header className="h-16 px-6 border-b border-gray-200/80 bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-gray-900 capitalize">{activeTab}</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                saveStatus === 'Saved ✓' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>{saveStatus}</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 min-h-0 relative">
            {isPending ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-gray-200 rounded-2xl w-full" />
                <div className="h-40 bg-gray-200 rounded-2xl w-full" />
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <h2 className="text-lg font-black text-gray-900">Welcome back, Arman 👋</h2>
                        <p className="text-xs text-gray-500 font-medium">You only need {missingStepsCount} more steps to activate verification metrics and start selling.</p>
                      </div>
                      <button 
                        onClick={() => handleTabSwitch('identity')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs shadow-blue-600/10 flex items-center gap-1.5 transition-all"
                      >
                        Continue Setup <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-3 cursor-pointer hover:border-blue-200 transition-all" onClick={() => handleTabSwitch('identity')}>
                        <h3 className="text-xs font-bold text-gray-900">Business Identity</h3>
                        <div className="text-[11px] space-y-1.5 font-semibold">
                          <p className="text-green-600">✔ Profile Added</p>
                          <p className="text-amber-600">⚠ GST Documents Missing</p>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-3 cursor-pointer hover:border-blue-200 transition-all" onClick={() => handleTabSwitch('store')}>
                        <h3 className="text-xs font-bold text-gray-900">Storefront Overview</h3>
                        <div className="text-[11px] space-y-1.5 font-semibold">
                          <p className="text-green-600">✔ Store Name & Logo Configured</p>
                          <p className="text-amber-600">⚠ Banner Graphics Missing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'identity' && <BusinessIdentitySection setSaveStatus={setSaveStatus} />}
                {activeTab === 'store' && <StoreManagementSection setSaveStatus={setSaveStatus} />}
                {activeTab === 'locations' && <AddressManagementSection triggerDrawer={triggerDrawer} setSaveStatus={setSaveStatus} />}
                {activeTab === 'payouts' && <BankAndPayoutSection triggerDrawer={triggerDrawer} setSaveStatus={setSaveStatus} />}
                {activeTab === 'preferences' && <SellerSettingsSection setSaveStatus={setSaveStatus} />}
              </>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}