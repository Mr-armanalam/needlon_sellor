import React from 'react';
import { ShieldAlert, History, CheckCircle2, AlertCircle, Key, Mail } from 'lucide-react';

export default function SecurityLogs() {
  const alertLogs = [
    { id: 'ALT-01', type: 'device', text: 'New browser login detected from Chrome (macOS)', date: 'June 25, 2026', severity: 'low' },
    { id: 'ALT-02', type: 'security', text: 'Account password changed successfully', date: 'May 12, 2026', severity: 'medium' }
  ];

  const loginHistory = [
    { id: 'LGN-902', type: 'Success', method: 'OTP Verification', date: 'June 25, 2026', desc: 'Login from New York, USA' },
    { id: 'LGN-901', type: 'Failed', method: 'Password Attempt', date: 'June 22, 2026', desc: 'Incorrect credentials provided from 84.22.10.***' },
    { id: 'LGN-900', type: 'Update', method: 'Email Changed', date: 'April 02, 2026', desc: 'Updated to arman@example.com' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
      
      {/* 1. Proactive Security Alerts Panel */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Recent Security Alerts</h3>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {alertLogs.map((alert) => (
            <div key={alert.id} className={`border rounded-xl p-3 flex gap-2.5 items-start ${
              alert.severity === 'high' ? 'bg-rose-50/40 border-rose-100 text-rose-900' : 'bg-blue-50/20 border-blue-100 text-blue-900'
            }`}>
              <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.severity === 'high' ? 'text-rose-500' : 'text-blue-500'}`} />
              <div className="text-[11px] leading-relaxed">
                <p className="font-semibold">{alert.text}</p>
                <span className="text-[10px] text-gray-400 block mt-0.5">{alert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Unified Audit Login History Ledger */}
      <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-bold text-gray-900">Security Audit Trail Log</h3>
        </div>

        <div className="overflow-x-auto border border-gray-50 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="p-3">Event Type</th>
                <th className="p-3">Verification Method</th>
                <th className="p-3">Event Description</th>
                <th className="p-3 text-right">Date Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
              {loginHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.type === 'Success' ? 'bg-green-50 text-green-700 border border-green-100' : 
                      row.type === 'Failed' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-900">{row.method}</td>
                  <td className="p-3 text-gray-500 max-w-xs truncate">{row.desc}</td>
                  <td className="p-3 text-right text-gray-400 whitespace-nowrap">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}