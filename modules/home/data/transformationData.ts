import { Globe, BadgePercent, Smartphone, Home } from "lucide-react";

export const transformationData = [
  {
    id: 1,
    icon: Globe,
    problem: "No online presence",
    solution: "Local customers find you easily on the web",
  },
  {
    id: 2,
    icon: Smartphone,
    problem: "Depend entirely on WhatsApp orders",
    solution: "A simple, mobile-friendly dedicated app",
  },
  {
    id: 3,
    icon: BadgePercent,
    problem: "High marketplace commissions eating profits",
    solution: "Keep 100% of your revenue - 0% commission",
  },
  {
    id: 4,
    icon: Home,
    problem: "Complex, difficult setup software",
    solution: "Launch and sell directly from your home",
  },
];

export type TransformationDataType = typeof transformationData[number];
