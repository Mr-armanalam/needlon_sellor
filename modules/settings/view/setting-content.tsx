import React, { useState } from 'react';
import { ShieldAlert, Moon, Sun, Monitor, Trash2, Shield, Bell, CreditCard, MapPin, Globe } from 'lucide-react';

export default function SettingsContent({ activeTab }) {
  const [themeMode, setThemeMode] = useState('light');

  return (
    <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-white">
      
      {/* 1. PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Profile Information</h3>
            <p className="text-xs text-gray-400">Update your account identity configurations and registration keys.</p>
          </div>
          <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="" className="w-14 h-14 rounded-full object-cover border" />
            <button className="text-xs font-bold text-blue-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all">Change Avatar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
              <input type="text" defaultValue="Arman Alam" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input type="email" defaultValue="arman@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>
        </div>
      )}

      {/* 2. SHOP INFORMATION (This will fix your current view) */}
      {activeTab === 'shop' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Shop Information</h3>
            <p className="text-xs text-gray-400">Configure your public-facing marketplace details.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Boutique Name</label>
              <input type="text" defaultValue="Needlon Hub Boutique" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shop Description</label>
              <textarea rows={3} defaultValue="Premium custom apparel, high-end config tailoring, and custom print configurations." className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* 3. ADDRESS SETTINGS */}
      {activeTab === 'address' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Pickup & Business Address</h3>
            <p className="text-xs text-gray-400">Used for courier routing dispatch logs.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Street Address</label>
              <input type="text" defaultValue="Warehouse Block-C, Industrial Electronics Sector" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">City</label>
                <input type="text" defaultValue="Pimpri-Chinchwad" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Postal Code</label>
                <input type="text" defaultValue="411018" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. LANGUAGE SETTINGS */}
      {activeTab === 'language' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Language & Localization</h3>
            <p className="text-xs text-gray-400">Select your preferred default presentation dialect.</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Language</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      )}

      {/* 5. THEME CONFIGURATION */}
      {activeTab === 'theme' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Interface Display Theme</h3>
            <p className="text-xs text-gray-400">Customize visual appearance modes across the layout workspace.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
              { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
              { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setThemeMode(mode.id)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 font-semibold text-xs transition-all ${
                  themeMode === mode.id
                    ? 'border-blue-600 bg-blue-50/20 text-blue-600'
                    : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:text-gray-900'
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. SECURITY SETTINGS */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Security Credentials</h3>
            <p className="text-xs text-gray-400">Keep your store access authentication secure.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Password</label>
              <input type="password" placeholder="Minimum 8 characters" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all">Update Password</button>
          </div>
        </div>
      )}

      {/* 7. NOTIFICATIONS SETTINGS */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Notification Alerts</h3>
            <p className="text-xs text-gray-400">Choose when and where you want to be alerted.</p>
          </div>
          <div className="space-y-3">
            {[
              { id: 'email_orders', title: 'Email Alerts on New Orders', desc: 'Receive instant breakdowns when checkouts complete.' },
              { id: 'chat_push', title: 'Browser Chat Push Notifications', desc: 'Be alerted when buyers trigger active messages.' }
            ].map((notify) => (
              <label key={notify.id} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <div>
                  <p className="text-xs font-bold text-gray-900">{notify.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{notify.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 8. PAYMENT SETTINGS */}
      {activeTab === 'payment' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Payout Configurations</h3>
            <p className="text-xs text-gray-400">Link your active merchant accounts to receive earnings.</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><CreditCard className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-bold text-gray-900">Bank Wire Account (•••• 4921)</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Primary transfer routing target.</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
          </div>
        </div>
      )}

      {/* 9. DELIVERY SETTINGS REDIRECT CARD */}
      {activeTab === 'delivery' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Fulfillment Preferences</h3>
            <p className="text-xs text-gray-400">Manage base logistics controls for delivery operations.</p>
          </div>
          <p className="text-xs text-gray-500">
            Logistics, fee tiers, and radius controls are configured inside the dedicated <strong>Delivery Section</strong> on your main left dashboard menu list layout.
          </p>
        </div>
      )}

      {/* 10. ACCOUNT DESTRUCTION */}
      {activeTab === 'account' && (
        <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Account Management</h3>
            <p className="text-xs text-gray-400">Control data permissions or remove store access lines permanently.</p>
          </div>
          <div className="border border-rose-100 bg-rose-50/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-900">Danger Zone: Delete Account</h4>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  Deleting your profile immediately purges custom store catalogs, pending order processing logs, and active client messaging histories. This structural action is absolute and cannot be reversed.
                </p>
              </div>
            </div>
            <button className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-rose-600/10 transition-all flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Permanently Delete Account
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


// import React, { useState } from 'react';
// import { ShieldAlert, Moon, Sun, Monitor, Trash2 } from 'lucide-react';

// export default function SettingsContent({ activeTab }) {
//   const [themeMode, setThemeMode] = useState('light');

//   return (
//     <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-white">
//       {/* 1. PROFILE SETTINGS PANEL */}
//       {activeTab === 'profile' && (
//         <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
//           <div className="space-y-1">
//             <h3 className="text-sm font-bold text-gray-900">Profile Information</h3>
//             <p className="text-xs text-gray-400">Update your account identity configurations and registration keys.</p>
//           </div>
          
//           <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
//             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="" className="w-14 h-14 rounded-full object-cover border" />
//             <button className="text-xs font-bold text-blue-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all">Change Avatar</button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
//               <input type="text" defaultValue="Arman Alam" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
//               <input type="email" defaultValue="arman@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 2. THEME CONFIGURATION PANEL */}
//       {activeTab === 'theme' && (
//         <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
//           <div className="space-y-1">
//             <h3 className="text-sm font-bold text-gray-900">Interface Display Theme</h3>
//             <p className="text-xs text-gray-400">Customize visual appearance modes across the layout workspace.</p>
//           </div>

//           <div className="grid grid-cols-3 gap-3">
//             {[
//               { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
//               { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
//               { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
//             ].map((mode) => (
//               <button
//                 key={mode.id}
//                 onClick={() => setThemeMode(mode.id)}
//                 className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 font-semibold text-xs transition-all ${
//                   themeMode === mode.id
//                     ? 'border-blue-600 bg-blue-50/20 text-blue-600'
//                     : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:text-gray-900 hover:border-gray-200'
//                 }`}
//               >
//                 {mode.icon}
//                 {mode.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 3. ACCOUNT DESTRUCTION PANEL */}
//       {activeTab === 'account' && (
//         <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
//           <div className="space-y-1">
//             <h3 className="text-sm font-bold text-gray-900">Account Management</h3>
//             <p className="text-xs text-gray-400">Control data permissions or remove store access lines permanently.</p>
//           </div>

//           <div className="border border-rose-100 bg-rose-50/20 rounded-2xl p-5 space-y-4">
//             <div className="flex items-start gap-3">
//               <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
//               <div className="space-y-1">
//                 <h4 className="text-xs font-bold text-rose-900">Danger Zone: Delete Account</h4>
//                 <p className="text-[11px] text-rose-800 leading-relaxed">
//                   Deleting your profile immediately purges custom store catalogs, pending order processing logs, and active client messaging histories. This structural action is absolute and cannot be reversed.
//                 </p>
//               </div>
//             </div>
            
//             <button className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-rose-600/10 transition-all flex items-center gap-1.5">
//               <Trash2 className="w-3.5 h-3.5" /> Permanently Delete Account
//             </button>
//           </div>
//         </div>
//       )}

//       {/* FALLBACK PLACEHOLDER FOR REMAINING FORM LABELS */}
//       {!['profile', 'theme', 'account'].includes(activeTab) && (
//         <div className="h-full flex flex-col items-center justify-center text-center p-12 text-xs text-gray-400 animate-in fade-in duration-200">
//           <p className="font-semibold text-gray-700 mb-1">Form Layer Configured</p>
//           <p>The "{activeTab}" module inputs map directly into standard setting databases here.</p>
//         </div>
//       )}
//     </div>
//   );
// }