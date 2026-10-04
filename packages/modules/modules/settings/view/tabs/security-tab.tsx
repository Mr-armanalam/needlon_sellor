"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, KeyRound, Eye, EyeOff, Laptop, Smartphone, 
  Check, AlertCircle, LogOut, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";

interface SessionInfo {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  isCurrent: boolean;
}

export default function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOthers, setRevokeOthers] = useState(true);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);

  // Fetch active sessions
  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const res = await fetch("/api/auth/sessions");
      const json = await res.json();
      if (json.success && json.data) {
        setSessions(json.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(newPassword);

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: "", color: "bg-gray-200" };
    if (strength <= 2) return { label: "Weak", color: "bg-rose-500" };
    if (strength <= 3) return { label: "Moderate", color: "bg-amber-500" };
    return { label: "Strong", color: "bg-emerald-500" };
  };

  const strengthInfo = getStrengthLabel();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/seller/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
          revokeOtherSessions: revokeOthers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      fetchSessions();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Password update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminateOtherSessions = async () => {
    setIsTerminating(true);
    try {
      const res = await fetch("/api/auth/sessions/logout-others", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to terminate sessions");

      toast.success("Other active sessions logged out successfully!");
      fetchSessions();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to terminate sessions");
    } finally {
      setIsTerminating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Security & Authentication Credentials
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Keep your merchant storefront credentials secure and inspect active authenticated sessions.
          </p>
        </div>
      </div>

      {/* 1. Update Password Form */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-gray-400" />
            Change Master Password
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Passwords must contain at least 8 characters with a combination of letters, numbers, and symbols.
          </p>
        </div>

        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-xs px-3.5 py-2.5 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password & Strength */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              New Password
            </label>
            {strengthInfo.label && (
              <span className="text-[10px] font-bold text-gray-500">
                Strength: <span className="font-black text-gray-900 dark:text-white">{strengthInfo.label}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-xs px-3.5 py-2.5 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength Bar */}
          {newPassword && (
            <div className="h-1.5 w-full bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full flex-1 rounded-full ${strength >= 1 ? strengthInfo.color : "bg-transparent"}`} />
              <div className={`h-full flex-1 rounded-full ${strength >= 3 ? strengthInfo.color : "bg-transparent"}`} />
              <div className={`h-full flex-1 rounded-full ${strength >= 4 ? strengthInfo.color : "bg-transparent"}`} />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-xs px-3.5 py-2.5 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Checkbox option */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={revokeOthers}
            onChange={(e) => setRevokeOthers(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span>Log out from all other active browser sessions upon password update</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Master Password"}
        </button>
      </form>

      {/* 2. Active Logged-in Sessions */}
      <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              Active Authorized Sessions
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Devices currently signed in with your merchant credentials.
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleTerminateOtherSessions}
              disabled={isTerminating}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              {isTerminating ? "Terminating..." : "Terminate Other Sessions"}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {isLoadingSessions ? (
            <div className="p-4 text-xs text-gray-400">Loading session telemetry...</div>
          ) : sessions.length === 0 ? (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-xs text-gray-500">
              Only your current session is active.
            </div>
          ) : (
            sessions.map((sess) => {
              const isMobile = /mobile|android|iphone/i.test(sess.userAgent || "");
              return (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300">
                      {isMobile ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {sess.userAgent?.split(" ")[0] || "Browser Session"}
                        </span>
                        {sess.isCurrent && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> This Device
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        IP: {sess.ipAddress || "Localhost / Protected"} • Signed in: {new Date(sess.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
