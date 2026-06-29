import React from 'react';
import { 
  User, Shop, MapPin, Globe, Sun, Shield, 
  Bell, CreditCard, Truck, Settings, Trash2 
} from 'lucide-react';

export default function SettingsNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'shop', label: 'Shop Information', icon: <Settings className="w-4 h-4" /> },
    { id: 'address', label: 'Address', icon: <MapPin className="w-4 h-4" /> },
    { id: 'language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme', icon: <Sun className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment Settings', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'delivery', label: 'Delivery Settings', icon: <Truck className="w-4 h-4" /> },
    { id: 'account', label: 'Account Management', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full md:w-64 border-r border-gray-200 bg-white h-full flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-900">Control Panel</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}