'use client'
import React, { useState } from 'react';
import { Shield, Key, ShieldAlert, LogOut, X } from 'lucide-react';
import ActiveSessions from '../view/active-sessions';
import SecurityLogs from '../view/security-log';


export default function SecurityPage() {
  const [modalState, setModalState] = useState({ show: false, mode: '' }); // mode: 'current', 'others', 'all'
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const openConfirmationModal = (modeString) => {
    setModalState({ show: true, mode: modeString });
  };

  const handleConfirmLogout = () => {
    const mode = modalState.mode;
    setModalState({ show: false, mode: '' });
    
    if (mode === 'current' || mode === 'all') {
      alert("Invalidating access tokens, revoking refresh tokens, and redirecting to login...");
      // Production navigation hook: window.location.href = '/login';
    } else if (mode === 'others') {
      alert("All other device refresh tokens have been revoked. Other devices successfully logged out.");
    }
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-y-auto p-6 bg-slate-50 flex-col space-y-6 min-h-0 relative">
      
      {/* 1. SECURITY CONFIRMATION OVERLAY MODAL */}
      {modalState.show && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <button 
                onClick={() => setModalState({ show: false, mode: '' })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-gray-900">
                {modalState.mode === 'current' && 'Log Out of Current Session?'}
                {modalState.mode === 'others' && 'Log Out of Other Devices?'}
                {modalState.mode === 'all' && 'Log Out of All Active Sessions?'}
              </h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {modalState.mode === 'current' && 'This will invalidate your current session access token. You will need to re-verify your identity to log back in.'}
                {modalState.mode === 'others' && 'This keeps your current device active but revokes access for all other phones, tablets, or computers instantly.'}
                {modalState.mode === 'all' && 'This is an absolute account reset. Every single linked connection will be dropped and trusted devices cleared.'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={() => setModalState({ show: false, mode: '' })}
                className="flex-1 bg-gray-100 text-gray-600 font-bold py-2 px-4 rounded-xl hover:bg-gray-200 transition-all text-center"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="flex-1 bg-rose-600 text-white font-bold py-2 px-4 rounded-xl shadow-md shadow-rose-600/10 hover:bg-rose-700 transition-all text-center"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Session & Security Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Monitor active authenticated sessions, look over system change logs, and terminate hardware connections.</p>
        </div>
        <button
          onClick={() => openConfirmationModal('current')}
          className="text-xs font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5 text-gray-400" /> Log Out
        </button>
      </div>

      {/* 2. TOP PANEL: ACTIVE SESSIONS LIST */}
      <ActiveSessions 
        onRevokeSession={(id) => openConfirmationModal('current')} 
        onLogoutOthers={() => openConfirmationModal('others')} 
      />

      {/* 3. MID PANEL: AUDIT HISTORY TRAIL */}
      <SecurityLogs />

      {/* 4. LOWER PANEL: PLAIN ENGLISH SECURITY PREFERENCES */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex-shrink-0 max-w-3xl">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-bold text-gray-900">Security Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inactivity Session Timeout</label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="15">Log out after 15 minutes of inactivity</option>
              <option value="30">Log out after 30 minutes of inactivity</option>
              <option value="60">Log out after 1 hour of inactivity</option>
            </select>
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <button 
              onClick={() => openConfirmationModal('all')}
              className="w-full border border-rose-200 bg-rose-50/10 hover:bg-rose-50 text-rose-600 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              Terminate Every Active Session
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}