"use client";

import { ArrowUpRight, DollarSign, ShoppingBag, Users, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { metrics as defaultMetrics } from "../data/welcomeData";
import { WelcomeMetricDto } from "../dto/dashboard.dto";
import WelcomeIconBadge from "../components/welcome-icon-badge";
import WelcomeBottomTextMetric from "../components/welcome-bottom-text-metric";

interface WelcomeCardProps {
  metrics?: WelcomeMetricDto[];
}

const iconMap = {
  sales: DollarSign,
  orders: ShoppingBag,
  visitors: Users,
  messages: MessageSquare,
};

const routeMap = {
  sales: "/earnings",
  orders: "/orders",
  visitors: "/analytics",
  messages: "/orders?status=PENDING",
};

export default function WelcomeCard({ metrics }: WelcomeCardProps) {
  const router = useRouter();

  const displayMetrics = metrics && metrics.length > 0
    ? metrics.map((m, idx) => ({
        title: m.title,
        value: m.value,
        change: m.change,
        isPositive: m.isPositive,
        isImgDanger: m.isImgDanger,
        icon: iconMap[m.type] || DollarSign,
        color: defaultMetrics[idx % defaultMetrics.length]?.color || "bg-emerald-50 text-emerald-600",
        targetUrl: routeMap[m.type] || "/dashboard",
      }))
    : defaultMetrics.map((m, idx) => ({
        ...m,
        targetUrl: ["/earnings", "/orders", "/analytics", "/orders?status=PENDING"][idx] || "/dashboard",
      }));

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayMetrics.map((metric, index) => {
          return (
            <div
              key={index}
              onClick={() => router.push(metric.targetUrl)}
              className="group relative bg-white border border-neutral-100/80 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.02),0_4px_8px_rgba(0,0,0,0.01)] cursor-pointer"
            >
              <WelcomeIconBadge metric={metric as any} />
              <WelcomeBottomTextMetric metric={metric as any} />

              {/* Soft aesthetic background accent link on hover */}
              <div className="absolute right-4 bottom-4 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                <ArrowUpRight size={14} className="text-neutral-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

