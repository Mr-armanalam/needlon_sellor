'use client';

import React, { useState } from 'react';
import { CreditCard, FileText, Download } from 'lucide-react';
import {
  BillingLedgerResponseDto,
  BillingPaymentItemDto,
  BillingInvoiceItemDto,
} from '../dto/subscription.dto';
import { useSubscription } from '../hooks/use-subscription';

interface BillingLedgerProps {
  ledger?: BillingLedgerResponseDto | null;
  ledgerTab?: 'history' | 'invoices';
  loading?: boolean;
  onTabChange?: (tab: 'history' | 'invoices') => void;
  onDownloadInvoice?: (invoiceId: string) => void;
}

export default function BillingLedger({
  ledger: propLedger,
  ledgerTab: propLedgerTab,
  loading: propLoading,
  onTabChange,
  onDownloadInvoice,
}: BillingLedgerProps) {
  const fallbackHook = useSubscription();
  const [localTab, setLocalTab] = useState<'history' | 'invoices'>('history');

  const ledgerTab = propLedgerTab !== undefined ? propLedgerTab : localTab;
  const ledger = propLedger !== undefined ? propLedger : fallbackHook.ledger;
  const loading = propLoading !== undefined ? propLoading : fallbackHook.ledgerLoading;

  const handleTabSwitch = (tab: 'history' | 'invoices') => {
    setLocalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    } else {
      fallbackHook.setLedgerTab(tab);
    }
  };

  const handleDownload = (invoiceId?: string) => {
    if (!invoiceId) return;
    if (onDownloadInvoice) {
      onDownloadInvoice(invoiceId);
    } else {
      fallbackHook.downloadInvoice(invoiceId);
    }
  };

  const statements = ledger?.items && ledger.items.length > 0 ? ledger.items : [];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col min-h-0 flex-1 overflow-hidden">
      {/* Segment Controllers */}
      <div className="p-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex gap-4">
          <button
            onClick={() => handleTabSwitch('history')}
            className={`text-xs font-bold pb-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              ledgerTab === 'history'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-400 hover:text-gray-900 border-transparent'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Payment History
          </button>
          <button
            onClick={() => handleTabSwitch('invoices')}
            className={`text-xs font-bold pb-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              ledgerTab === 'invoices'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-400 hover:text-gray-900 border-transparent'
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
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400 text-xs">
                  Loading billing ledger records...
                </td>
              </tr>
            ) : statements.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400 text-xs">
                  {ledgerTab === 'history'
                    ? 'No subscription payment transactions found.'
                    : 'No invoices issued yet.'}
                </td>
              </tr>
            ) : (
              statements.map((row) => {
                const subLabel = 'method' in row ? row.method : (row as BillingInvoiceItemDto).period;
                const downloadTarget = 'invoiceId' in row && row.invoiceId ? row.invoiceId : row.id;

                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{row.id}</td>
                    <td className="p-4 text-gray-400 whitespace-nowrap">{row.date}</td>
                    <td className="p-4 text-gray-500">{subLabel}</td>
                    <td className="p-4 font-bold text-gray-900">{row.total}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDownload(downloadTarget)}
                        className="text-gray-400 hover:text-blue-600 p-1.5 inline-flex items-center gap-1 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-[11px] cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}