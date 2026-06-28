import React from 'react';
import { Globe, BadgePercent, Smartphone, Home } from 'lucide-react';
import ProblemSolutionHeading from '../components/Heading';
import HeaderIconTitleIndicator from '../components/HeaderIconTitleIndicator';
import Differentiator from '../components/Differentiator';

const transformationData = [
  {
    id: 1,
    icon: Globe,
    problem: "No online presence",
    solution: "Local customers find you easily on the web"
  },
  {
    id: 2,
    icon: Smartphone,
    problem: "Depend entirely on WhatsApp orders",
    solution: "A simple, mobile-friendly dedicated app"
  },
  {
    id: 3,
    icon: BadgePercent,
    problem: "High marketplace commissions eating profits",
    solution: "Keep 100% of your revenue - 0% commission"
  },
  {
    id: 4,
    icon: Home,
    problem: "Complex, difficult setup software",
    solution: "Launch and sell directly from your home"
  }
];

export type TransformationDataType = typeof transformationData;

export default function ProblemSolutionSection() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto bg-slate-50/50 rounded-3xl my-12">
      <ProblemSolutionHeading />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {transformationData.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              className="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0,05)] hover:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group"
            >
              <HeaderIconTitleIndicator Icon={Icon}/>

             <Differentiator item={item} />
            </div>
          );
        })}
      </div>
    </section>
  );
}