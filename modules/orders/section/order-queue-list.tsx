import React from 'react';
import OrderQueue from "@/modules/orders/components/order-queue";

const OrderQueueList = (
    {
        onInspectOrder,
        setSelectedPreviewOrder,
        setIsPreviewModalOpen,
        loading,
        error,
        orders,
    } : {
        onInspectOrder: (order: string) => void;
        setSelectedPreviewOrder:  React.Dispatch<React.SetStateAction<any | null>>;
        setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
        loading: boolean;
        error: string | null;
        orders: any[];
    }
) => {
    return (
        <div className="flex flex-col gap-3.5 mt-1 min-h-37.5">
            {loading ? (
                <div className="w-full py-16 flex items-center justify-center text-[13px] font-semibold text-neutral-400">
                    Loading orders pipeline...
                </div>
            ) : error ? (
                <div className="w-full py-16 flex items-center justify-center text-[13px] font-semibold text-red-500">
                    {error}
                </div>
            ) : orders.length === 0 ? (
                <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-[14px] font-bold text-neutral-800">No Orders Found</span>
                    <span className="text-[12px] text-neutral-400">There are no orders matching your current criteria.</span>
                </div>
            ) : (
                orders.map((order) => (
                   <OrderQueue
                        key={order.id}
                        order={order}
                        onInspectOrder={onInspectOrder}
                        setSelectedPreviewOrder={setSelectedPreviewOrder}
                        setIsPreviewModalOpen={setIsPreviewModalOpen}
                   />
                ))
            )}
        </div>
    );
};

export default OrderQueueList;