import {
  UserPlus,
  UploadCloud,
  MapPin,
  Wallet,
  TrendingUp,
} from "lucide-react";

export const stepsData = [
  {
    id: 1,
    icon: UserPlus,
    title: "Register",
    description: "Create your free account in less than 2 minutes.",
  },
  {
    id: 2,
    icon: UploadCloud,
    title: "Upload Products",
    description: "Snap photos of your clothing items and add prices.",
  },
  {
    id: 3,
    icon: MapPin,
    title: "Customers Nearby Find You",
    description: "Local buyers discover your storefront effortlessly.",
  },
  {
    id: 4,
    icon: Wallet,
    title: "Receive Payment Directly",
    description: "Keep 100% of your earnings straight to your account.",
  },
  {
    id: 5,
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Build a loyal local customer base over time.",
  },
];

export type stepDataType = (typeof stepsData)[number];
