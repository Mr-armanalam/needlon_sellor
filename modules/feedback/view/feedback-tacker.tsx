import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  Hourglass,
  HelpCircle,
  KanbanSquare,
  Send,
} from "lucide-react";

const mockTrackLogs = [
  {
    id: "FB-9021",
    title: "Tax Invoice Download button crashes",
    type: "Bug Report",
    status: "Resolved",
    date: "June 28, 2026",
  },
  {
    id: "FB-8840",
    title: "Add thread count parameter selector",
    type: "Feature Request",
    status: "Under Review",
    date: "June 14, 2026",
  },
];

export default function FeedbackTracker() {
  const [logs] = useState(mockTrackLogs);
  const [surveyRating, setSurveyRating] = useState(0);
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1 min-h-0 animate-in fade-in duration-200">
      {/* 1. Occasional Customer Satisfaction Micro-Survey (Builds Trust) */}
      {!surveySubmitted && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md border border-slate-700/50 space-y-4 max-w-xl mx-auto w-full relative overflow-hidden">
          <div className="space-y-1">
            <h4 className="text-xs font-bold tracking-wide uppercase text-blue-400">
              Quick Check-in
            </h4>
            <h3 className="text-sm font-bold">
              How easy was it to manage your product listings today?
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSurveyRating(star)}
                className="transition-transform active:scale-95 p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= surveyRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>

          {surveyRating > 0 && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <textarea
                rows={2}
                placeholder="Optional: What can we improve to make your workflow smoother?"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl text-xs px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-500 resize-none leading-relaxed"
              />
              <button
                onClick={() => setSurveySubmitted(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 ml-auto"
              >
                Submit <Send className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {surveySubmitted && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center text-xs text-emerald-800 max-w-xl mx-auto font-medium animate-in fade-in duration-200 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Thank you! Your
          feedback helps us build a better experience.
        </div>
      )}

      {/* 2. Personal Submission Status History Tracker Ledger */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <KanbanSquare className="w-4 h-4" /> Track Feedback Status
        </h3>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium"
            >
              <div className="space-y-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{log.title}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-700">{log.id}</span>
                  <span>•</span>
                  <span>Type: {log.type}</span>
                  <span>•</span>
                  <span>Logged: {log.date}</span>
                </div>
              </div>

              {/* Functional Dynamic Status Badges */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-center flex items-center gap-1 flex-shrink-0 ${
                  log.status === "Resolved"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}
              >
                {log.status === "Resolved" ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Hourglass className="w-3 h-3 animate-spin-slow" />
                )}
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
