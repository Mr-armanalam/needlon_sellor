"use client";

import { ArrowRight, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { recommendations as defaultRecommendations } from "../data/buisinessInsightData";
import { BusinessInsightDto } from "../dto/dashboard.dto";

interface RecommendationStackProps {
  insights?: BusinessInsightDto[];
}

const RecommendationStack = ({ insights }: RecommendationStackProps) => {
  const router = useRouter();

  const items = insights && insights.length > 0
    ? insights.map((ins, idx) => ({
        id: ins.id,
        message: ins.message,
        actionLabel: ins.actionLabel,
        actionUrl: ins.actionUrl,
        icon: ins.type === "alert" ? AlertCircle : TrendingUp,
        cardStyles: ins.type === "alert"
          ? "bg-amber-50/40 border-amber-100/70 text-amber-900"
          : "bg-blue-50/40 border-blue-100/70 text-blue-900",
        iconStyles: ins.type === "alert"
          ? "bg-amber-500 text-white"
          : "bg-blue-500 text-white",
        buttonStyles: ins.type === "alert"
          ? "bg-amber-900 text-white hover:bg-amber-800"
          : "bg-blue-900 text-white hover:bg-blue-800",
      }))
    : defaultRecommendations.map((r, idx) => ({
        ...r,
        actionUrl: idx === 0 ? "/products" : "/products",
      }));

  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`
                p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 
                transition-all duration-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.01)]
                ${item.cardStyles}
              `}
          >
            {/* Left Wing: Informational Text */}
            <div className="flex items-start gap-3.5">
              <div className={`p-2 rounded-xl shrink-0 ${item.iconStyles}`}>
                <Icon size={16} strokeWidth={2.5} />
              </div>
              <p className="text-[14px] font-medium tracking-tight leading-relaxed pt-0.5">
                {item.message}
              </p>
            </div>

            {/* Right Wing: Inline Action Button */}
            <button
              onClick={() => router.push(item.actionUrl)}
              className={`
                  px-4 py-2 text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 
                  transition-all duration-200 shrink-0 select-none outline-none group cursor-pointer
                  ${item.buttonStyles}
                `}
            >
              <span>{item.actionLabel}</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendationStack;

