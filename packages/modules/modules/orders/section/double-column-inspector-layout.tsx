import React from 'react';
import OrderMetaNLineItems from "@/modules/orders/components/order-meta-n-line-items";
import PipelineTracking from "@/modules/orders/components/pipeline-tracking";
import type {OrderDetailAddressDto, OrderDetailResponseDto, OrderListItemLineDto} from "@/modules/orders/dto";

const DoubleColumnInspectorLayout = (
    {
        data,
        currentStatus,
        items,
        formatCurrency,
        deliveryAddress,
        stepsTimeline,
        currentStepIdx,
        handleAdvance,
        isFinalState,
        actionLoading,
        handleCancel,
        isBespoke,
        reload,
    }:{
        data: OrderDetailResponseDto;
        currentStatus: string;
        items: OrderListItemLineDto[];
        formatCurrency: (val: number | string) => string ;
        deliveryAddress: OrderDetailAddressDto | undefined;
        stepsTimeline:{
            label: string
            time: string
            description: string
        }[];
        currentStepIdx: number;
        handleAdvance:  () => Promise<void>;
        isFinalState: boolean;
        actionLoading:  boolean;
        handleCancel:  () => Promise<void>;
        isBespoke?: boolean;
        reload?: () => Promise<void>;
    }
) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
            {/* LEFT COMPONENT COLUMN: Order Meta & Line Items  */}
            <OrderMetaNLineItems
                data={data}
                currentStatus={currentStatus}
                items={items}
                formatCurrency={formatCurrency}
                deliveryAddress={deliveryAddress}
                reload={reload}
            />
            {/* RIGHT COMPONENT COLUMN: Comprehensive Pipeline Tracking */}
            <PipelineTracking
                stepsTimeline={stepsTimeline}
                currentStepIdx={currentStepIdx}
                handleAdvance={handleAdvance}
                isFinalState={isFinalState}
                actionLoading={actionLoading}
                handleCancel={handleCancel}
                isBespoke={isBespoke}
            />
        </div>

    );
};

export default DoubleColumnInspectorLayout;