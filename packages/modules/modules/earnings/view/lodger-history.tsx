'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { LedgerResponseDto } from '../dto/finance.dto';
import { useEarnings } from '../hooks/use-earnings';

interface LedgerHistoryProps {
  ledger?: LedgerResponseDto | null;
  viewType?: 'transactions' | 'settlements';
  loading?: boolean;
  onViewTypeChange?: (vt: 'transactions' | 'settlements') => void;
  onExportCsv?: () => void;
}

export default function LedgerHistory({
  ledger: propLedger,
  viewType: propViewType,
  loading: propLoading,
  onViewTypeChange,
  onExportCsv,
}: LedgerHistoryProps) {
  const fallbackHook = useEarnings();
  const [localViewType, setLocalViewType] = useState<'transactions' | 'settlements'>('transactions');

  const viewType = propViewType !== undefined ? propViewType : localViewType;
  const ledger = propLedger !== undefined ? propLedger : fallbackHook.ledger;
  const loading = propLoading !== undefined ? propLoading : fallbackHook.ledgerLoading;

  const handleTabChange = (vt: 'transactions' | 'settlements') => {
    setLocalViewType(vt);
    if (onViewTypeChange) {
      onViewTypeChange(vt);
    } else {
      fallbackHook.setViewType(vt);
    }
  };

  const handleExport = () => {
    if (onExportCsv) {
      onExportCsv();
    } else {
      fallbackHook.exportCsv();
    }
  };

  const tableData = ledger?.items && ledger.items.length > 0 ? ledger.items : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0 flex-1 overflow-hidden">
      {/* Ledger Operational Toolbar */}
      <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
        <div className="flex gap-4 border-b border-gray-100 sm:border-0 pb-2 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => handleTabChange('transactions')}
            className={`text-xs font-bold pb-2 sm:pb-0 border-b-2 sm:border-0 transition-all cursor-pointer ${
              viewType === 'transactions' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => handleTabChange('settlements')}
            className={`text-xs font-bold pb-2 sm:pb-0 border-b-2 sm:border-0 transition-all cursor-pointer ${
              viewType === 'settlements' ? 'text-blue-600 border-blue-600' : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            Settlement History
          </button>
        </div>

        <button 
          onClick={handleExport}
          className="text-xs text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 self-end sm:self-center transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Ledger Feed Rows Layout Frame */}
      <div className="flex-1 overflow-y-auto  min-h-0">
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
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400 text-xs">
                  Loading ledger entries...
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400 text-xs">
                  {viewType === 'transactions' ? 'No transactions found.' : 'No settlements requested yet.'}
                </td>
              </tr>
            ) : (
              tableData.map((row) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}