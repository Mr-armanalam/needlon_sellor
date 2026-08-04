import React from 'react';

const OrderStages = (
    {
        orderTabs,
        setActiveTab,
        activeTab,
    }
) => {
    return (
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {orderTabs.map((tab) => (
                <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all duration-200 outline-none shrink-0 ${
                        activeTab === tab.label
                            ? 'bg-neutral-900 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60'
                    }`}
                >
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                            activeTab === tab.label ? 'bg-white text-neutral-950' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                  {tab.count}
                </span>
                    )}
                </button>
            ))}
        </div>

    );
};

export default OrderStages;