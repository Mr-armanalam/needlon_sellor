import { Plus, Share2, ShoppingBag, ArrowUpRight } from "lucide-react";
 
 export const actions = [
    {
      title: "Add Product",
      description: "List a new item to your storefront",
      icon: Plus,
      isPrimary: true,
      styles:
        "bg-neutral-900 text-white hover:bg-neutral-800 shadow-[0_8px_20px_rgba(0,0,0,0.06)]",
      iconStyles: "bg-white/10 text-white",
    },
    {
      title: "Share Shop",
      description: "Grow visibility on WhatsApp & Socials",
      icon: Share2,
      isPrimary: false,
      styles:
        "bg-blue-50/50 text-blue-900 border border-blue-100/70 hover:bg-blue-50 hover:border-blue-200/80",
      iconStyles: "bg-blue-500 text-white shadow-sm shadow-blue-200",
    },
    {
      title: "View Orders",
      description: "Manage packaging and ship packages",
      icon: ShoppingBag,
      isPrimary: false,
      styles:
        "bg-purple-50/50 text-purple-900 border border-purple-100/70 hover:bg-purple-50 hover:border-purple-200/80",
      iconStyles: "bg-purple-500 text-white shadow-sm shadow-purple-200",
    },
    {
      title: "Withdraw Earnings",
      description: "Transfer available funds to your bank",
      icon: ArrowUpRight,
      isPrimary: false,
      styles:
        "bg-emerald-50/50 text-emerald-900 border border-emerald-100/70 hover:bg-emerald-50 hover:border-emerald-200/80",
      iconStyles: "bg-emerald-500 text-white shadow-sm shadow-emerald-200",
    },
  ];

  export type actionType = typeof actions[number];