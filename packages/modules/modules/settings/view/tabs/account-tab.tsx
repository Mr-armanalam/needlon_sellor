"use client";

import React, { useState } from "react";
import { 
  User, ShieldAlert, Download, Palmtree, Trash2, 
  X, AlertTriangle, CheckCircle 
} from "lucide-react";
import { useSellerSettings } from "../../hooks/use-seller-settings";
import { toast } from "sonner";

export default function AccountTab() {
  const { settings } = useSellerSettings();
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(settings || {}, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `needlon-seller-settings-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Settings snapshot exported successfully!");
    } catch {
      toast.error("Failed to export settings snapshot");
    }
  };

  const handleToggleVacation = () => {
    setIsVacationMode(!isVacationMode);
    toast.success(
      !isVacationMode
        ? "Vacation mode enabled: Product listings temporarily paused from discovery."
        : "Store resumed: Product listings are now active."
    );
  };

  const handleDeleteAccount = async () => {
    if (confirmPhrase !== "DELETE MY ACCOUNT") {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm.');
      return;
    }

    setIsDeleting(true);
    // Safety delay simulation
    setTimeout(() => {
      setIsDeleting(false);
      setShowDeleteModal(false);
      toast.error("Account closure request submitted for compliance review.");
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Store Management & Access Controls
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Export store telemetry snapshots, toggle store operational states, or request merchant account closure.
          </p>
        </div>
      </div>

      {/* 1. Vacation Mode Card */}
      <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                Store Vacation & Maintenance Mode
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed max-w-md">
                Temporarily pause incoming checkouts while fulfilling existing orders. Your store branding remains visible, but buyers cannot place new orders until resumed.
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleVacation}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isVacationMode
                ? "bg-amber-500 text-white"
                : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
            }`}
          >
            {isVacationMode ? "Active on Vacation" : "Enable Vacation"}
          </button>
        </div>
      </div>

      {/* 2. Configuration Data Export */}
      <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                Export System Configuration
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed max-w-md">
                Download a machine-readable JSON snapshot of your current localization, delivery channels, and platform settings.
              </p>
            </div>
          </div>
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download JSON
          </button>
        </div>
      </div>

      {/* 3. Danger Zone */}
      <div className="border border-rose-100 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300">
              Danger Zone: Account Closure
            </h4>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-400 leading-relaxed">
              Deleting your store profile initiates permanent catalog unlisting, terminates active subscription tiers, and closes customer communication channels.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Close Merchant Account
        </button>
      </div>

      {/* Safety Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Confirm Account Closure
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              This action cannot be undone. To prevent accidental closure, please type{" "}
              <span className="font-mono font-bold text-rose-600">DELETE MY ACCOUNT</span> in the box below:
            </p>

            <input
              type="text"
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="w-full bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl text-xs px-3.5 py-2.5 font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmPhrase !== "DELETE MY ACCOUNT" || isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 transition-all flex items-center gap-1.5"
              >
                {isDeleting ? "Submitting..." : "Confirm & Close Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
