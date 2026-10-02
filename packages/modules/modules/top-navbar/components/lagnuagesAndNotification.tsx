'use client';
import { useState } from "react";
import { Bell, Globe, CheckCheck, Info, Package, MessageSquare } from "lucide-react";
import { useNotifications } from "@/modules/shared/hooks/use-notifications";

const LagnuagesAndNotification = () => {
  const { notifications, unreadCount, markRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 relative">
      {/* Language Selector */}
      <button className="p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60 transition-all duration-200 flex items-center justify-center cursor-pointer">
        <Globe size={18} />
      </button>

      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60 transition-all duration-200 flex items-center justify-center cursor-pointer"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 min-w-[16px] h-[16px] px-1 bg-red-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <span className="text-xs font-bold text-neutral-900">Notifications ({unreadCount} unread)</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markRead(undefined, true)}
                className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto flex flex-col gap-2 no-scrollbar">
            {notifications.length === 0 ? (
              <div className="text-[12px] text-neutral-400 text-center py-6">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`p-3 rounded-xl border text-xs flex flex-col gap-1 transition-all cursor-pointer ${
                    n.isRead ? "bg-white border-neutral-100 text-neutral-600" : "bg-neutral-50 border-neutral-200 text-neutral-900 font-medium"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[12px]">
                    <span className="flex items-center gap-1.5">
                      {n.notificationType === "NEW_ORDER" ? <Package size={14} className="text-emerald-600" /> : <MessageSquare size={14} className="text-indigo-600" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LagnuagesAndNotification;

