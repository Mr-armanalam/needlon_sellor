"use client";
import React from "react";
import { Globe, Sun, Moon, Monitor, BellPlus } from "lucide-react";
import { SaveStatus } from "../section/seller-foundation-page";
import { useEffect } from "react";
import { useSellerSettingsForm } from "../hooks/use-seller-settings-form";

interface SellerSettingsProps {
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}

type ThemeMode = "light" | "dark" | "system";

export default function SellerSettingsSection({
  setSaveStatus,
}: SellerSettingsProps) {
  const { form, save, isSaving, isLoading, isError, error, isDirty, setField, toggleField } =
    useSellerSettingsForm();
    


  useEffect(() => {
    setSaveStatus(isDirty ? "Changes pending" : "Saved ✓");
  }, [isDirty, setSaveStatus]);

  if (isLoading || !form) {
    return (
      <div className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Unable to load settings."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* HEADER ROW */}
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-gray-900">
          Workspace Preferences
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Customize localization configurations and notification rule engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* BLOCK 1: LOCALIZATION AND REGION */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-gray-400" /> Regional Settings
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Primary Language Dialect
              </label>
              <select
                value={form.languageCode}
                onChange={(e) => setField("languageCode", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="en">English (US)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="bn">Bengali (বাংলা)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Settlement Currency
              </label>
              <input
                type="text"
                disabled
                value={form.currencyCode}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* BLOCK 2: VISUAL APPEARANCE DIALS (RADIO CARDS) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-gray-400" /> Interface Appearance
          </h3>

          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            {[
              {
                id: "light" as ThemeMode,
                label: "Light",
                icon: <Sun className="w-4 h-4" />,
              },
              {
                id: "dark" as ThemeMode,
                label: "Dark",
                icon: <Moon className="w-4 h-4" />,
              },
              {
                id: "system" as ThemeMode,
                label: "System",
                icon: <Monitor className="w-4 h-4" />,
              },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() =>
                  setField("theme", mode.id.toUpperCase() as typeof form.theme)
                }
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 font-bold transition-all ${
                  form.theme === mode.id.toUpperCase()
                    ? "border-blue-600 bg-blue-50/20 text-blue-600"
                    : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* BLOCK 3: IOS-STYLE ALERTS TOGGLE MATRIX */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <BellPlus className="w-4 h-4 text-gray-400" /> Notification Channels
          </h3>

          <div className="divide-y divide-gray-50 border border-gray-50 rounded-xl overflow-hidden">
            {[
              {
                id: "emailNotifications" as const,
                title: "Email Order Dispatches",
                desc: "Receive instant breakdown maps when checkouts finish successfully.",
              },
              {
                id: "smsNotifications" as const,
                title: "SMS Transaction Alerts",
                desc: "Get SMS text logs as soon as weekly revenue settles into your bank account.",
              },
              {
                id: "lowInventoryNotifications" as const,
                title: "Low Stock Push Notifications",
                desc: "Receive browser alert updates when fabric supplies drop below threshold parameters.",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-4 text-xs font-medium"
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 font-medium leading-normal">
                    {item.desc}
                  </p>
                </div>

                {/* IOS SWITCH SLIDER SCROLL ENGINE */}
                <button
                  type="button"
                  onClick={() => toggleField(item.id)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex-shrink-0 ${
                    form[item.id] ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transform duration-200 ease-in-out ${
                      form[item.id] ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all shadow-blue-600/10"
            >
              Apply Configurations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





// "use client";
// import React, { useState } from "react";
// import { Globe, Sun, Moon, Monitor, BellPlus } from "lucide-react";
// import { SaveStatus } from "../section/seller-foundation-page";

// interface SellerSettingsProps {
//   setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
// }

// type ThemeMode = "light" | "dark" | "system";

// export default function SellerSettingsSection({
//   setSaveStatus,
// }: SellerSettingsProps) {
//  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
//   const [notifications, setNotifications] = useState({
//     email_orders: true,
//     sms_payouts: true,
//     push_inventory: false,
//     marketing: false
//   });
//   // value={settings?.timezone ?? ""}

//   const handleToggle = (key: keyof typeof notifications) => {
//     setNotifications((prev) => {
//       const updated = { ...prev, [key]: !prev[key] };
//       setSaveStatus("Changes pending");
//       return updated;
//     });
//   };

//   const handleThemeChange = (mode: ThemeMode) => {
//     setThemeMode(mode);
//     setSaveStatus("Changes pending");
//   };


//   return (
//     <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
//       {/* HEADER ROW */}
//       <div className="border-b border-gray-100 pb-3">
//         <h2 className="text-sm font-bold text-gray-900">
//           Workspace Preferences
//         </h2>
//         <p className="text-xs text-gray-400 mt-0.5">
//           Customize localization configurations and notification rule engines.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//         {/* BLOCK 1: LOCALIZATION AND REGION */}
//         <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
//           <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
//             <Globe className="w-4 h-4 text-gray-400" /> Regional Settings
//           </h3>

//           <div className="space-y-3 text-xs font-semibold">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">
//                 Primary Language Dialect
//               </label>
//               <select  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
//                 <option value="en">English (US)</option>
//                 <option value="hi">Hindi (हिंदी)</option>
//                 <option value="bn">Bengali (বাংলা)</option>
//               </select>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">
//                 Settlement Currency
//               </label>
//               <input
//                 type="text"
//                 disabled
//                 defaultValue="INR (₹)"
//                 className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-500 cursor-not-allowed"
//               />
//             </div>
//           </div>
//         </div>

//         {/* BLOCK 2: VISUAL APPEARANCE DIALS (RADIO CARDS) */}
//         <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
//           <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
//             <Sun className="w-4 h-4 text-gray-400" /> Interface Appearance
//           </h3>

//           <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
//             {[
//               {
//                 id: "light" as ThemeMode,
//                 label: "Light",
//                 icon: <Sun className="w-4 h-4" />,
//               },
//               {
//                 id: "dark" as ThemeMode,
//                 label: "Dark",
//                 icon: <Moon className="w-4 h-4" />,
//               },
//               {
//                 id: "system" as ThemeMode,
//                 label: "System",
//                 icon: <Monitor className="w-4 h-4" />,
//               },
//             ].map((mode) => (
//               <button
//                 key={mode.id}
//                 type="button"
//                 onClick={() => handleThemeChange(mode.id)}
//                 className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 font-bold transition-all ${
//                   themeMode === mode.id
//                     ? "border-blue-600 bg-blue-50/20 text-blue-600"
//                     : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//                 }`}
//               >
//                 {mode.icon}
//                 {mode.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* BLOCK 3: IOS-STYLE ALERTS TOGGLE MATRIX */}
//         <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
//           <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
//             <BellPlus className="w-4 h-4 text-gray-400" /> Notification Channels
//           </h3>

//           <div className="divide-y divide-gray-50 border border-gray-50 rounded-xl overflow-hidden">
//             {[
//               {
//                 id: "email_orders" as const,
//                 title: "Email Order Dispatches",
//                 desc: "Receive instant breakdown maps when checkouts finish successfully.",
//               },
//               {
//                 id: "sms_payouts" as const,
//                 title: "SMS Transaction Alerts",
//                 desc: "Get SMS text logs as soon as weekly revenue settles into your bank account.",
//               },
//               {
//                 id: "push_inventory" as const,
//                 title: "Low Stock Push Notifications",
//                 desc: "Receive browser alert updates when fabric supplies drop below threshold parameters.",
//               },
//             ].map((item) => (
//               <div
//                 key={item.id}
//                 className="p-4 flex items-center justify-between gap-4 text-xs font-medium"
//               >
//                 <div className="space-y-0.5">
//                   <h4 className="font-bold text-gray-900">{item.title}</h4>
//                   <p className="text-[11px] text-gray-400 font-medium leading-normal">
//                     {item.desc}
//                   </p>
//                 </div>

//                 {/* IOS SWITCH SLIDER SCROLL ENGINE */}
//                 <button
//                   type="button"
//                   onClick={() => handleToggle(item.id)}
//                   className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex-shrink-0 ${
//                     notifications[item.id] ? "bg-blue-600" : "bg-gray-200"
//                   }`}
//                 >
//                   <div
//                     className={`w-5 h-5 rounded-full bg-white shadow-xs transform duration-200 ease-in-out ${
//                       notifications[item.id]
//                         ? "translate-x-4"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end pt-2">
//             <button
//               type="button"
//               onClick={() => setSaveStatus("Saved ✓")}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all shadow-blue-600/10"
//             >
//               Apply Configurations
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
