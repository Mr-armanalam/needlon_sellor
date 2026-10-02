"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqDataType } from "../../data/faqData";

const CustomAccordian = ({ item }: { item: faqDataType }) => {
  const [openId, setOpenId] = useState<string | number | null>(null);

  const isOpen = openId === item.id;

  const toggleAccordion = (id: string | number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div
      key={item.id}
      className={`border rounded-2xl transition-all duration-200 overflow-hidden bg-white
        ${isOpen ? "border-indigo-100 shadow-[0_10px_25px_-12px_rgba(79,70,229,0.08)]" : "border-slate-100/90 hover:border-slate-200"}`}
    >
      {/* Trigger Button Header */}
      <button
        onClick={() => toggleAccordion(item.id)}
        className="w-full p-5 flex items-center justify-between text-left gap-4 font-semibold text-slate-800 hover:text-slate-900 transition-colors group select-none"
      >
        <div className="flex items-center gap-3">
          <HelpCircle
            size={18}
            className={`shrink-0 transition-colors ${isOpen ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"}`}
          />
          <span className="text-sm md:text-base tracking-tight font-medium">
            {item.question}
          </span>
        </div>

        <div
          className={`p-1 rounded-lg transition-transform duration-300 shrink-0
            ${isOpen ? "bg-indigo-50 text-indigo-600 rotate-180" : "bg-slate-50 text-slate-400 group-hover:text-slate-500"}`}
        >
          <ChevronDown size={16} />
        </div>
      </button>

      {/* Animated Dropdown Body Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out font-medium
          ${isOpen ? "max-h-60 border-t border-slate-50 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <div className="p-5 text-xs md:text-sm text-slate-500 leading-relaxed bg-slate-50/40">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

export default CustomAccordian;
