import React from "react";
import {
  Monitor,
  Smartphone,
  ShieldCheck,
  XCircle,
  LogOut,
} from "lucide-react";

export type SessionItem = {
  id: string;
  deviceName?: string;
  os?: string;
  browser?: string;
  location?: string;
  ip?: string;
  loginTime?: string;
  lastActive?: string;
  isCurrent?: boolean;
  isTrusted?: boolean;
};

interface ActiveSessionsProps {
  sessions?: SessionItem[];
  isLoading?: boolean;
  onRevokeSession: (sessionId: string) => void;
  onLogoutOthers: () => void;
}

const defaultSessions: SessionItem[] = [
  {
    id: "SES-001",
    deviceName: 'MacBook Pro 14"',
    os: "macOS Sonoma",
    browser: "Google Chrome",
    location: "New York, USA",
    ip: "192.168.1.***",
    loginTime: "June 25, 2026",
    lastActive: "Just now",
    isCurrent: true,
    isTrusted: true,
  },
  {
    id: "SES-002",
    deviceName: "iPhone 15 Pro",
    os: "iOS 17",
    browser: "Mobile Safari",
    location: "London, UK",
    ip: "84.22.10.***",
    loginTime: "June 22, 2026",
    lastActive: "2 hours ago",
    isCurrent: false,
    isTrusted: true,
  },
];

export default function ActiveSessions({
  sessions,
  isLoading,
  onRevokeSession,
  onLogoutOthers,
}: ActiveSessionsProps) {
  const currentSessions = sessions && sessions.length > 0 ? sessions : defaultSessions;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex-shrink-0">
      {/* Container Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-gray-900">
            Active Logged-In Devices
          </h3>
          <p className="text-xs text-gray-400">
            These devices are currently logged into your Needlon Hub account.
            Revoke any unfamiliar devices instantly.
          </p>
        </div>
        <button
          onClick={onLogoutOthers}
          className="text-xs font-bold border border-rose-200 bg-rose-50/30 text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out Other Devices
        </button>
      </div>

      {/* Grid Stream Wrapper */}
      <div className="divide-y divide-gray-50 border border-gray-50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-xs text-gray-400 font-medium">Loading active sessions...</div>
        ) : (
          currentSessions.map((session) => {
            const osName = session.os || "Unknown OS";
            const browserName = session.browser || "Unknown Browser";
            const deviceName = session.deviceName || "Unknown Device";
            const isMobile = osName.includes("iOS") || osName.includes("Android");

            return (
              <div
                key={session.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/30 transition-all text-xs font-medium"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 bg-gray-50 border rounded-xl text-gray-400 mt-0.5 flex-shrink-0">
                    {isMobile ? (
                      <Smartphone className="w-4 h-4" />
                    ) : (
                      <Monitor className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 truncate">
                        {deviceName}
                      </h4>
                      {session.isCurrent && (
                        <span className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                          This Device
                        </span>
                      )}
                      {session.isTrusted && (
                        <span className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Trusted
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-[11px] leading-normal">
                      {browserName} • {osName}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-400 font-normal">
                      <span>
                        Location:{" "}
                        <strong className="font-medium text-gray-600">
                          {session.location || "Active Location"}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>IP: {session.ip || "192.168.1.***"}</span>
                      <span>•</span>
                      <span>Active: {session.lastActive || "Just now"}</span>
                    </div>
                  </div>
                </div>

                {/* Micro Session Action Button Trigger */}
                {!session.isCurrent && (
                  <button
                    onClick={() => onRevokeSession(session.id)}
                    className="text-xs font-semibold text-gray-400 hover:text-rose-600 flex items-center gap-1 border border-gray-100 px-2.5 py-1.5 rounded-xl hover:bg-white hover:shadow-sm transition-all self-start sm:self-auto flex-shrink-0"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Revoke Access
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
