import React from 'react';
import {ShieldCheck} from "lucide-react";

const SecurityComplianceCues = () => {
    return (
        <div className="space-y-4 sticky top-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-gray-900">
                            Encrypted Financial Vault
                        </h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Needlon Hub hashes payment routes securely using bank-grade
                            transit standards. Complete internal account digits are never
                            exposed to public interface views.
                        </p>
                    </div>
                </div>
            </div>

            {/* DYNAMIC METRIC HOOK BOX */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Settlement Cycle
            </span>
                <p className="font-medium text-slate-300 leading-normal">
                    Verified Primary streams push earnings into registered vaults
                    every Tuesday at{" "}
                    <strong className="text-white">12:00 PM IST</strong>.
                </p>
            </div>
        </div>
    );
};

export default SecurityComplianceCues;