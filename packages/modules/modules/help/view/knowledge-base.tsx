import React, { useState } from 'react';
import { BookOpen, Camera, FileText, DollarSign, Truck, ShoppingBag, Globe, ArrowLeft, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useHelpCenter } from '../hooks/use-help-center';

const iconMap: Record<string, any> = {
  Camera: <Camera className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  selling: "text-blue-600 bg-blue-50 border-blue-100",
  delivery: "text-emerald-600 bg-emerald-50 border-emerald-100",
  payment: "text-purple-600 bg-purple-50 border-purple-100",
};

export default function KnowledgeBase({ onBack }: { onBack?: () => void }) {
  const { kbArticles, loading } = useHelpCenter();
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [votedArticleId, setVotedArticleId] = useState<string | null>(null);

  const handleVote = async (articleId: string, isHelpful: boolean) => {
    try {
      await fetch(`/api/seller/help/kb/articles/${articleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHelpful }),
      });
      setVotedArticleId(articleId);
    } catch (err) {
      console.error("Failed to submit vote:", err);
    }
  };

  // Group articles by category
  const groupedArticles = kbArticles.reduce((acc: any, art: any) => {
    const cat = art.category || 'selling';
    if (!acc[cat]) {
      acc[cat] = {
        title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Guide`,
        color: categoryColors[cat] || "text-blue-600 bg-blue-50 border-blue-100",
        articles: []
      };
    }
    acc[cat].articles.push(art);
    return acc;
  }, {});

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
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
              {selectedArticle.category}
            </span>
            <span className="text-xs text-gray-400">• {selectedArticle.readTime || '4 min read'}</span>
          </div>
          <h2 className="text-base font-bold text-gray-900">{selectedArticle.title}</h2>
        </div>

        <div className="text-xs text-gray-600 space-y-4 leading-relaxed max-w-2xl">
          <p className="font-semibold text-gray-800 text-sm leading-relaxed">{selectedArticle.description}</p>
          <div className="text-gray-700 space-y-3 pt-2 whitespace-pre-line">
            {selectedArticle.content}
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-blue-800 mt-4">
            <strong>Pro Tip:</strong> Re-using components and structure sets keeps the application layout clean and lowers your buyers' cognitive load during interactions.
          </div>

          {/* Was this article helpful? feedback widget */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Was this article helpful?</span>
            {votedArticleId === selectedArticle.id ? (
              <span className="font-bold text-emerald-600">✓ Thank you for your feedback!</span>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleVote(selectedArticle.id, true)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-1.5 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Yes
                </button>
                <button 
                  onClick={() => handleVote(selectedArticle.id, false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-1.5 transition-all"
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> No
                </button>
              </div>
            )}
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

      {loading ? (
        <div className="p-8 text-center text-xs text-gray-400">Loading knowledge base articles...</div>
      ) : Object.keys(groupedArticles).length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-400">No knowledge base articles found.</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedArticles).map(([key, value]: [string, any]) => (
            <div key={key} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> {value.title}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {value.articles.map((art: any, index: number) => (
                  <div 
                    key={art.id || index}
                    onClick={() => setSelectedArticle(art)}
                    className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all cursor-pointer group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl border flex-shrink-0 ${value.color}`}>
                          {iconMap[art.icon] || <BookOpen className="w-4 h-4" />}
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{art.title}</h5>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{art.description}</p>
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
      )}
    </div>
  );
}