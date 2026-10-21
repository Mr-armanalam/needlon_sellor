import { DollarSign, ShoppingBag, MessageSquare } from "lucide-react";

export const metrics = [
  {
    title: "Today's Sales",
    value: "₹4,850",
    change: "+12%",
    isPositive: true,
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Orders",
    value: "18",
    change: "+4",
    isPositive: true,
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Pending Messages",
    value: "5",
    change: "Action needed",
    isImgDanger: true,
    icon: MessageSquare,
    color: "bg-amber-50 text-amber-600",
  },
];

export type metricsType = typeof metrics[number];
