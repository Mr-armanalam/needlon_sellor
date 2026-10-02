import React from 'react';
import {Printer} from "lucide-react";

const HeaderControls = ({ setIsManifestModalOpen }: { setIsManifestModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
                <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight">Orders</h2>
                <p className="text-[13px] text-neutral-400 font-normal">Monitor your pipeline, package items, and track live boutique dispatch states.</p>
            </div>

            {/* Quick Bulk Action */}
            <button
                onClick={() => setIsManifestModalOpen(true)}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm outline-none cursor-pointer"
            >
                <Printer size={15} />
                <span>Print Manifests</span>
            </button>
        </div>
    );
};

export default HeaderControls;