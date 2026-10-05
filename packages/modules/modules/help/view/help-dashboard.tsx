import React, { useState } from 'react';
import { Search, PlayCircle, CheckCircle2, Circle, ArrowRight, BookOpen, GraduationCap, FileText, Ticket } from 'lucide-react';
import { useHelpCenter } from '../hooks/use-help-center';
import { useRouter } from 'next/navigation';

interface HelpDashboardProps {
  onNavigateToSection?: (section: string) => void;
  onCreateTicketClick?: () => void;
}

export default function HelpDashboard({ onNavigateToSection, onCreateTicketClick }: HelpDashboardProps) {
  const { dashboardData, searchHelp, searchResults, isSearching } = useHelpCenter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();

  const learningProgress = dashboardData?.learningProgress ?? 65;
  const setupChecklist = dashboardData?.setupChecklist ?? [
    { id: 1, text: 'Complete your business profile', done: true, route: '/seller-profile' },
    { id: 2, text: 'Add your first marketplace product', done: true, route: '/products/new' },
    { id: 3, text: 'Configure local delivery charges', done: false, route: '/delivery' },
    { id: 4, text: 'Set up primary payment settlement route', done: false, route: '/settings' },
  ];
  const popularVideos = dashboardData?.popularVideos ?? [
    { id: 'vid-1', title: 'Boutique Product Photography Tips', duration: '4 min', level: 'Beginner', progress: '100%' },
    { id: 'vid-2', title: 'Mastering Customer Communication Layouts', duration: '7 min', level: 'Intermediate', progress: '40%' }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      searchHelp(q);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleStartTask = (route: string) => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1 min-h-0">
      
      {/* 1. Universal Smart Search Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-sm relative overflow-visible flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-20 w-full relative">
          <h2 className="text-xl font-bold tracking-tight">How can we help you succeed today?</h2>
          <p className="text-xs text-blue-100 leading-relaxed">Search plain-language tutorials, explore setup checklists, or view video guides engineered to scale your boutique velocity.</p>
          
          <div className="relative pt-2">
            <Search className="absolute left-3 top-5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim().length > 1 && setShowSearchResults(true)}
              placeholder="Search guides, video tutorials, or ticket topics..."
              className="w-full pl-9 pr-4 py-2.5 bg-white text-gray-800 border-0 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
            />

            {/* Smart Search Results Dropdown Overlay */}
            {showSearchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-100 p-3 z-50 max-h-80 overflow-y-auto space-y-3 animate-in fade-in duration-150">
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 border-b pb-1.5">
                  <span>Search Matches for "{searchQuery}"</span>
                  <button onClick={() => setShowSearchResults(false)} className="text-gray-400 hover:text-gray-700">Close ✕</button>
                </div>

                {isSearching ? (
                  <p className="text-xs text-gray-400 p-2 text-center">Searching database...</p>
                ) : (searchResults.articles.length === 0 && searchResults.tickets.length === 0) ? (
                  <p className="text-xs text-gray-400 p-2 text-center">No articles or tickets matching "{searchQuery}"</p>
                ) : (
                  <>
                    {searchResults.articles.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400 block px-2">Knowledge Base Articles</span>
                        {searchResults.articles.map((art: any) => (
                          <div 
                            key={art.id} 
                            onClick={() => {
                              setShowSearchResults(false);
                              onNavigateToSection?.('kb');
                            }}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2 text-xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-gray-800 truncate">{art.title}</p>
                              <p className="text-[11px] text-gray-400 truncate">{art.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.tickets.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400 block px-2">Your Support Tickets</span>
                        {searchResults.tickets.map((t: any) => (
                          <div 
                            key={t.id} 
                            onClick={() => {
                              setShowSearchResults(false);
                              onNavigateToSection?.('support');
                            }}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2 text-xs"
                          >
                            <Ticket className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-gray-800 truncate">{t.subject}</p>
                              <p className="text-[11px] text-gray-400">{t.ticketNumber} • Status: {t.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col justify-between min-w-[200px] z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
            <GraduationCap className="w-4 h-4" /> Seller Academy
          </div>
          <p className="text-2xl font-black mt-2">{learningProgress}%</p>
          <div className="w-full h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${learningProgress}%` }} />
          </div>
          <span className="text-[10px] text-blue-200 mt-2 block">Complete 2 more lessons to clear intermediate level</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Onboarding Task Checklist */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Your Setup Milestone Checklist</h3>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">
              Step {setupChecklist.filter((t: any) => t.done).length} of {setupChecklist.length} Cleared
            </span>
          </div>
          
          <div className="divide-y divide-gray-50 border border-gray-50 rounded-xl overflow-hidden">
            {setupChecklist.map((task: any) => (
              <div key={task.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-xs">
                <div className="flex items-center gap-3">
                  {task.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.text}</span>
                </div>
                {!task.done && (
                  <button 
                    onClick={() => handleStartTask(task.route)}
                    className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 transition-colors"
                  >
                    Start <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Short Video Tutorials */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Trending Video Lessons</h3>
            </div>
            <p className="text-xs text-gray-400">Bite-sized visual strategies for scaling catalog sales volume.</p>
            
            <div className="space-y-3 pt-1">
              {popularVideos.map((vid: any, idx: number) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl space-y-1.5 cursor-pointer hover:border-gray-200 transition-all">
                  <div className="flex justify-between items-start text-xs">
                    <h4 className="font-bold text-gray-800 truncate mr-2">{vid.title}</h4>
                    <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 border rounded whitespace-nowrap">{vid.duration}</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: vid.progress }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}