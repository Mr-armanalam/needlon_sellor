import React from 'react';
import {Building2, CreditCard, MapPin, Settings, Store} from "lucide-react";
import {WorkspaceTab} from "@/modules/seller-profile/view/seller-foundation-page";


const profile_nav = [
    { id: 'overview' as const, label: 'Overview', icon: <Building2 className="w-4 h-4" /> },
    { id: 'identity' as const, label: 'Business Identity', icon: <Building2 className="w-4 h-4" /> },
    { id: 'store' as const, label: 'Storefront', icon: <Store className="w-4 h-4" /> },
    { id: 'locations' as const, label: 'Business Locations', icon: <MapPin className="w-4 h-4" /> },
    { id: 'payouts' as const, label: 'Payouts & Banking', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'preferences' as const, label: 'Preferences', icon: <Settings className="w-4 h-4" /> }
];


const ProfileNavItems = ({ handleTabSwitch, activeTab }: { handleTabSwitch: (id: WorkspaceTab) => void; activeTab: string }) => {

    return (
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
            {profile_nav.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleTabSwitch(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                        activeTab === item.id
                            ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/10'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </nav>
    );
};

export default ProfileNavItems;