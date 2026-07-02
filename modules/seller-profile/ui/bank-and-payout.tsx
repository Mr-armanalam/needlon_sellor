"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  Building,
  Layers,
  CheckCircle,
} from "lucide-react";
import { SaveStatus } from "../section/seller-foundation-page";

export default function BankAndPayoutSection({
  triggerDrawer,
  setSaveStatus,
}: {
  triggerDrawer: (contentNode: React.ReactNode) => void;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}) {
  // Database split arrays matching structural schema configurations
  const [bankAccounts] = useState([
    {
      id: "bnk_1",
      bankName: "HDFC Bank Ltd",
      accNo: "XXXXXXXX4321",
      type: "Savings",
      isPrimary: true,
      status: "Verified",
    },
  ]);

  const [payoutMethods, setPayoutMethods] = useState([
    {
      id: "pay_1",
      type: "UPI Route",
      handler: "arman@upi",
      isDefault: true,
      status: "Verified",
    },
  ]);

  const handleRegisterUPI = (payload: { handler: string}) => {
    setPayoutMethods((prev) => [
      ...prev,
      {
        id: `pay_${Date.now()}`,
        type: "UPI Route",
        handler: payload.handler,
        isDefault: false,
        status: "Pending",
      },
    ]);
    setSaveStatus("Saved ✓");
  };

  // DRAWER LAYOUT FOR REGISTERING A NEW PAYOUT CHANNEL
  const renderPayoutDrawerForm = () => {
    let inputVal = "";
    return (
      <div className="space-y-6 h-full flex flex-col justify-between text-xs font-semibold">
        <div className="space-y-5">
          <div className="border-b border-gray-50 pb-3">
            <h3 className="text-sm font-bold text-gray-900">
              Add UPI Payout Route
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-normal">
              Link a Virtual Payment Address for fast digital checkout
              settlements.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              UPI ID / VPA Handle
            </label>
            <input
              type="text"
              placeholder="e.g., username@bank"
              onChange={(e) => {
                inputVal = e.target.value;
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={() => handleRegisterUPI({ handler: inputVal })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs text-center"
          >
            Verify & Link UPI
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      {/* SECTION TITLE HEADER */}
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-gray-900">Payouts & Banking</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage settlement routing engines safely under advanced encryption
          keys.
        </p>
      </div>

      {/* DUAL COLUMN SPLIT FRAMEWORK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COMPONENT COLUMN (BANK AND UPI CARDS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* CATEGORY BLOCK 1: IMMUTABLE BANK ACCOUNT TILES */}
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Bank Accounts
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs space-y-4 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-900">
                          {bank.bankName}
                        </h4>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100 uppercase">
                          Primary
                        </span>
                      </div>
                      <p className="text-gray-500 font-mono tracking-wide pt-1">
                        {bank.accNo}
                      </p>
                      <span className="text-[11px] text-gray-400 block pt-0.5">
                        {bank.type} Account
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />{" "}
                      {bank.status}
                    </span>
                  </div>

                  {/* IMMUTABLE INLINE WARNING MESSAGE BLOCK */}
                  <div className="pt-3 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
                    To adjust account values, please add a new verification
                    profile target. Legacy connections are archived
                    automatically to maintain audit trail compliance.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORY BLOCK 2: FLEXIBLE PAYOUT METHOD PIPELINES */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Payout Configurations
              </h3>
              <button
                type="button"
                onClick={() => triggerDrawer(renderPayoutDrawerForm())}
                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" /> Link UPI Handle
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {payoutMethods.map((pay) => (
                <div
                  key={pay.id}
                  className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
                >
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-bold bg-slate-50 border px-2 py-0.5 rounded-md text-gray-600 tracking-wide uppercase">
                        {pay.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pay.status === "Verified"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {pay.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-mono font-bold text-gray-900 truncate">
                        {pay.handler}
                      </h4>
                      {pay.isDefault && (
                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">
                          Configured for active payouts
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DYNAMIC TIMELINE STEPS INNER VIEWPORT EMBED */}
                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <div className="flex items-center gap-1 text-blue-600">
                      <CheckCircle className="w-3 h-3 text-blue-600" /> Linked
                    </div>
                    <div className="h-px bg-gray-200 flex-1 mx-2" />
                    <div
                      className={
                        pay.status === "Verified"
                          ? "text-blue-600 flex items-center gap-1"
                          : "text-gray-400"
                      }
                    >
                      {pay.status === "Verified" && (
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                      )}{" "}
                      Verified
                    </div>
                    <div className="h-px bg-gray-200 flex-1 mx-2" />
                    <span
                      className={
                        pay.isDefault ? "text-blue-600" : "text-gray-400"
                      }
                    >
                      Primary
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: SECURITY AND COMPLIANCE CUES */}
        <div className="space-y-4 sticky top-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-gray-900">
                  Encrypted Financial Vault
                </h4>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Needlon Hub hashes payment routes securely using bank-grade
                  transit standards. Complete internal account digits are never
                  exposed to public interface views.
                </p>
              </div>
            </div>
          </div>

          {/* DYNAMIC METRIC HOOK BOX */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Settlement Cycle
            </span>
            <p className="font-medium text-slate-300 leading-normal">
              Verified Primary streams push earnings into registered vaults
              every Tuesday at{" "}
              <strong className="text-white">12:00 PM IST</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
