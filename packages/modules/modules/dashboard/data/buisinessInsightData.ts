import { AlertCircle, TrendingUp } from "lucide-react";

 
 
 export const recommendations = [
    {
      id: 1,
      type: "alert",
      message:
        "Your Kurti was viewed 500 times this week, but only 2 items are left in stock.",
      actionLabel: "Restock now",
      icon: AlertCircle,
      cardStyles: "bg-amber-50/40 border-amber-100/70 text-amber-900",
      iconStyles: "bg-amber-500 text-white",
      buttonStyles: "bg-amber-900 text-white hover:bg-amber-800",
    },
    {
      id: 2,
      type: "growth",
      message:
        "Adding 5 more products this week can increase your shop visibility by up to 25%.",
      actionLabel: "Add item",
      icon: TrendingUp,
      cardStyles: "bg-blue-50/40 border-blue-100/70 text-blue-900",
      iconStyles: "bg-blue-500 text-white",
      buttonStyles: "bg-blue-900 text-white hover:bg-blue-800",
    },
  ];

  export type recommendationType = typeof recommendations[number];