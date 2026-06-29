import React, { useState } from 'react';
import { BookOpen, Camera, FileText, DollarSign, Truck, ShoppingBag, Globe, ArrowLeft, ArrowRight } from 'lucide-react';

const guideSections = {
  selling: {
    title: "Selling Guide",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    articles: [
      { title: "Product Photography Tips", desc: "How to use optimal lighting to make your boutique catalog stand out.", icon: <Camera className="w-4 h-4" /> },
      { title: "Product Description Guide", desc: "Write copy that answers buyer questions before they even ask.", icon: <FileText className="w-4 h-4" /> },
      { title: "Pricing & Margin Strategy", desc: "Position your custom tailoring competitively in international shipping zones.", icon: <DollarSign className="w-4 h-4" /> }
    ]
  },
  delivery: {
    title: "Delivery Guide",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    articles: [
      { title: "Setting Up Local Delivery Radius", desc: "Define rules for regional vehicle courier fleets.", icon: <Truck className="w-4 h-4" /> },
      { title: "Self Pickup Configuration", desc: "Allow local clients to collect purchases from physical fulfillment hubs.", icon: <ShoppingBag className="w-4 h-4" /> },
      { title: "Packaging Strategy Guide", desc: "Protect custom apparel from damage during national transit routes.", icon: <Globe className="w-4 h-4" /> }
    ]
  },
  payment: {
    title: "Payment Guide",
    color: "text-purple-600 bg-purple-50 border-purple-100",
    articles: [
      { title: "UPI & Digital Settlement Routing", desc: "Link active merchant accounts to receive earnings effortlessly.", icon: <DollarSign className="w-4 h-4" /> },
      { title: "Refund Policy Blueprints", desc: "Manage store returns cleanly while preserving buyer trust.", icon: <FileText className="w-4 h-4" /> }
    ]
  }
};

export default function KnowledgeBase({ onBack }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (selectedArticle) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 flex-1 overflow-y-auto min-h-0 animate-in fade-in duration-200">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Knowledge Base
        </button>
        <div className="space-y-2 border-b border-gray-50 pb-4">
          <h2 className="text-base font-bold text-gray-900">{selectedArticle.title}</h2>
          <p className="text-xs text-gray-400">Published or updated recently • 4 min read</p>
        </div>
        <div className="text-xs text-gray-600 space-y-4 leading-relaxed max-w-2xl">
          <p className="font-semibold text-gray-800">{selectedArticle.desc}</p>
          <p>When preparing your store resources, high scannability is vital. Use consistent white balance layers and high-contrast styling to present metadata lines reliably to browsing client profiles.</p>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-blue-800">
            <strong>Pro Tip:</strong> Re-using components and structure sets keeps the application layout clean and lowers your buyers' cognitive load during interactions.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1 min-h-0 animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors md:hidden">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Knowledge Base Directories</h3>
          <p className="text-xs text-gray-400 mt-0.5">Explore standard operating playbooks tailored to scale merchant operations.</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(guideSections).map(([key, value]) => (
          <div key={key} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> {value.title}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {value.articles.map((art, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedArticle(art)}
                  className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border flex-shrink-0 ${value.color}`}>
                        {art.icon}
                      </div>
                      <h5 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{art.title}</h5>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{art.desc}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[11px] font-bold text-gray-400 group-hover:text-blue-600 flex items-center justify-between transition-colors">
                    Read Full Article
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}