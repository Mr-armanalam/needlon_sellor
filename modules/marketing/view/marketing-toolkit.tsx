import React from 'react';
import { Share2, Users2, Ticket, QrCode, CreditCard, MessageSquare, ExternalLink } from 'lucide-react';

export default function MarketingToolkit() {
  const tools = [
    {
      title: 'Share Shop Link',
      desc: 'Copy and distribute your public store path URL across networks.',
      icon: <Share2 className="w-4 h-4 text-blue-600" />,
      actionLabel: 'Copy Link'
    },
    {
      title: 'WhatsApp Sharing',
      desc: 'Instantly blast current shop collections to individual buyer threads.',
      icon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
      actionLabel: 'Open WhatsApp'
    },
    {
      title: 'Referral Program',
      desc: 'Configure invite structures giving customers rewards for driving sales.',
      icon: <Users2 className="w-4 h-4 text-purple-600" />,
      actionLabel: 'Manage Invites'
    },
    {
      title: 'Coupons & Promos',
      desc: 'Generate unique alphanumeric percentage-off discount tokens.',
      icon: <Ticket className="w-4 h-4 text-amber-600" />,
      actionLabel: 'Create Coupon'
    },
    {
      title: 'Dynamic QR Codes',
      desc: 'Export high-definition print graphics routing clients directly to products.',
      icon: <QrCode className="w-4 h-4 text-indigo-600" />,
      actionLabel: 'Generate PNG'
    },
    {
      title: 'Digital Business Cards',
      desc: 'Create print-ready layouts complete with contact info and store branding.',
      icon: <CreditCard className="w-4 h-4 text-rose-600" />,
      actionLabel: 'Export PDF'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Growth & Distribution Tools</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0">
                  {tool.icon}
                </div>
                <h4 className="text-xs font-bold text-gray-900">{tool.title}</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
            </div>
            
            <button className="mt-4 pt-3 border-t border-gray-50 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-between group">
              {tool.actionLabel}
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}