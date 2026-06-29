import React, { useState } from 'react';
import { CreditCard, FileText, Download, CheckCircle2 } from 'lucide-react';

export default function BillingLedger() {
  const [ledgerTab, setLedgerTab] = useState('history'); // history or invoices

  const statements = ledgerTab === 'history' ? [
    { id: 'PAY-9012', date: 'June 07, 2026', method: 'Visa ending in 4921', total: '$49.00', status: 'Succeeded' },
    { id: 'PAY-8821', date: 'May 07, 2026', method: 'Visa ending in 4921', total: '$49.00', status: 'Succeeded' }
  ] : [
    { id: 'INV-2026-004', date: 'June 07, 2026', period: 'May 07 - June 07', total: '$49.00', status: 'Paid' },
    { id: 'INV-2026-003', date: 'May 07, 2026', period: 'Apr 07 - May 07', total: '$49.00', status: 'Paid' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col min-h-0 flex-1 overflow-hidden">
      {/* Segment Controllers */}
      <div className="p-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex gap-4">
          <button
            onClick={() => setLedgerTab('history')}
            className={`text-xs font-bold pb-1 border-b-2 transition-all flex items-center gap-1.5 ${
              ledgerTab === 'history' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Payment History
          </button>
          <button
            onClick={() => setLedgerTab('invoices')}
            className={`text-xs font-bold pb-1 border-b-2 transition-all flex items-center gap-1.5 ${
              ledgerTab === 'invoices' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Invoices & Receipts
          </button>
        </div>
      </div>

      {/* Ledger Workspace Frame */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4">{ledgerTab === 'history' ? 'Transaction ID' : 'Invoice Number'}</th>
              <th className="p-4">Date</th>
              <th className="p-4">{ledgerTab === 'history' ? 'Payment Method' : 'Billing Period'}</th>
              <th className="p-4">Amount</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
            {statements.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">{row.id}</td>
                <td className="p-4 text-gray-400 whitespace-nowrap">{row.date}</td>
                <td className="p-4 text-gray-500">{row.method || row.period}</td>
                <td className="p-4 font-bold text-gray-900">{row.total}</td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-blue-600 p-1.5 inline-flex items-center gap-1 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-[11px]">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}