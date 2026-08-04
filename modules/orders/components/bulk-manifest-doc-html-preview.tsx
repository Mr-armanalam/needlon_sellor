import React from 'react';
import {Printer} from "lucide-react";

const BulkManifestDocHtmlPreview = (
    {
        manifestHtml,
        handlePrintManifest,
        setManifestHtml,
    }:{
        manifestHtml: string;
        handlePrintManifest: () => void;
        setManifestHtml: (manifestHtml: string) => void;
    }
) => {
    return (
        <div className="flex-1 bg-neutral-100/70 p-6 overflow-auto flex flex-col items-center justify-start gap-4">
            <div className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-xl shadow-lg overflow-hidden">
                <iframe
                    srcDoc={manifestHtml}
                    title="Manifest Preview"
                    className="w-full h-[550px] border-none"
                />
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={handlePrintManifest}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm outline-none"
                >
                    <Printer size={16} />
                    <span>Print Manifest Document</span>
                </button>
                <button
                    onClick={() => setManifestHtml(null)}
                    className="px-4 py-2.5 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-[13px] font-semibold rounded-xl outline-none"
                >
                    Back to Selection
                </button>
            </div>
        </div>

    );
};

export default BulkManifestDocHtmlPreview;