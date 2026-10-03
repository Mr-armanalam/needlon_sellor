'use client';

import React, { useState } from 'react';
import { Megaphone, Users, Eye, ArrowUpRight, Plus } from 'lucide-react';
import { useCampaigns } from '../hooks/use-marketing';
import CreateCampaignModal from './modals/create-campaign-modal';

interface CampaignPerformanceProps {
  onOpenCampaignModal?: () => void;
}

export default function CampaignPerformance({ onOpenCampaignModal }: CampaignPerformanceProps) {
  const { campaigns, loading, createCampaign } = useCampaigns();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCampaigns = campaigns.length > 0 ? campaigns : [
    { id: '1', name: 'Summer Launch Promotion', reach: '12,400 views', conversions: '84 sales', trend: '+14.5%', status: 'Active' },
    { id: '2', name: 'WhatsApp Referral Push', reach: '3,200 clicks', conversions: '41 signups', trend: '+8.2%', status: 'Active' }
  ];

  const handleCreate = async (dto: any) => {
    await createCampaign(dto);
  };

  return (
    <>
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Campaign Performance</h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New Campaign
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCampaigns.map((camp) => (
            <div key={camp.id} className="border border-gray-100 bg-gray-50/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{camp.name}</h4>
                  <p className="text-[10px] text-green-600 font-medium flex items-center gap-0.5 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" /> {camp.trend || '+10.0%'} performance shift
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                  {camp.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white px-3 py-2 rounded-lg border border-gray-100 text-xs">
                  <span className="text-gray-400 block text-[10px] mb-0.5">Audience Reach</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1"><Eye className="w-3 h-3 text-gray-400" /> {camp.reach}</span>
                </div>
                <div className="bg-white px-3 py-2 rounded-lg border border-gray-100 text-xs">
                  <span className="text-gray-400 block text-[10px] mb-0.5">Conversions</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /> {camp.conversions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  );
}