import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Download } from 'lucide-react';

export default function LedgerHistory() {
  const [viewType, setViewType] = useState('transactions'); // transactions or settlements

  const tableData = viewType === 'transactions' ? [
    { id: 'TXN-9081', date: 'June 28, 2026', desc: 'Payment for ORD-1024', amount: '+$120.00', type: 'credit' },
    { id: 'TXN-8921', date: 'June 24, 2026', desc: 'Material Surcharge Ref.', amount: '-$15.00', type: 'debit' }
  ] : [
    { id: 'SET-0041', date: 'June 20, 2026', desc: 'Bank Wire Transfer x-4921', amount: '$4,200.00', type: 'settled' },
    { id: 'SET-0040', date: 'June 01, 2026', desc: 'Bank Wire Transfer x-4921', amount: '$8,100.00', type: 'settled' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0 flex-1 overflow-hidden">
      {/* Ledger Operational Toolbar */}
      <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
        <div className="flex gap-4 border-b border-gray-100 sm:border-0 pb-2 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setViewType('transactions')}
            className={`text-xs font-bold pb-2 sm:pb-0 border-b-2 sm:border-0 transition-all ${
              viewType === 'transactions' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setViewType('settlements')}
            className={`text-xs font-bold pb-2 sm:pb-0 border-b-2 sm:border-0 transition-all ${
              viewType === 'settlements' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            Settlement History
          </button>
        </div>

        <button className="text-xs text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 self-end sm:self-center transition-all">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Ledger Feed Rows Layout Frame */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4">Reference ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
            {tableData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">{row.id}</td>
                <td className="p-4 text-gray-400 whitespace-nowrap">{row.date}</td>
                <td className="p-4 font-medium text-gray-600">{row.desc}</td>
                <td className={`p-4 text-right font-bold whitespace-nowrap ${
                  row.type === 'credit' ? 'text-green-600' : row.type === 'debit' ? 'text-rose-600' : 'text-gray-900'
                }`}>
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}