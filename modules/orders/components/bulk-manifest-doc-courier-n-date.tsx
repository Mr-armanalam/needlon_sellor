import React from 'react';
import {Calendar, Truck} from "lucide-react";

const BulkManifestDocCourierNDate = (
    {
        courierName,
        setCourierName,
        pickupDate,
        setPickupDate,
    }:{
        courierName: string;
        setCourierName: (courierName: string) => void;
        pickupDate: string;
        setPickupDate: (pickupDate: string) => void;
    }
) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-neutral-700 flex items-center gap-1.5">
                    <Truck size={14} className="text-neutral-500" />
                    <span>Logistics Carrier Courier</span>
                </label>
                <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[13px] font-medium text-neutral-800 outline-none focus:border-neutral-400"
                >
                    <option value="Express Courier">Express Courier</option>
                    <option value="BlueDart Logistics">BlueDart Logistics</option>
                    <option value="Delhivery Surface">Delhivery Surface</option>
                    <option value="Shadowfax Local">Shadowfax Local</option>
                    <option value="DTDC Express">DTDC Express</option>
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-neutral-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-neutral-500" />
                    <span>Pickup Date</span>
                </label>
                <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[13px] font-medium text-neutral-800 outline-none focus:border-neutral-400"
                />
            </div>
        </div>

    );
};

export default BulkManifestDocCourierNDate;