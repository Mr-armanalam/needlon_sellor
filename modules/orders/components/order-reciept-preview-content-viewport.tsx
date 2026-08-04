import React from 'react';

const OrderRecieptPreviewContentViewport = (
    {
        loading,
        error,
        zoom,
        activeTab,
        htmlContent,
    }:{
        activeTab: "INVOICE" | "PACKING_SLIP" | "SHIPPING_LABEL";
        zoom: number;
        loading: boolean;
        error: string | null;
        htmlContent: string | null;
    }
) => {
    return (
        <div className="flex-1 bg-neutral-100/70 p-6 overflow-auto flex justify-center items-start">
            {loading ? (
                <div className="py-24 text-center text-[13px] font-semibold text-neutral-400 animate-pulse">
                    Generating document preview...
                </div>
            ) : error ? (
                <div className="py-24 text-center text-[13px] font-semibold text-red-500">
                    {error}
                </div>
            ) : (
                <div
                    className="transition-transform duration-200 bg-white shadow-xl rounded-lg overflow-hidden border border-neutral-200/80"
                    style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: "top center",
                        width: activeTab === "SHIPPING_LABEL" ? "420px" : "800px",
                    }}
                >
                    <iframe
                        srcDoc={htmlContent}
                        title="Document View"
                        className="w-full border-none"
                        style={{
                            height: activeTab === "SHIPPING_LABEL" ? "620px" : "1050px",
                        }}
                    />
                </div>
            )}
        </div>

    );
};

export default OrderRecieptPreviewContentViewport;