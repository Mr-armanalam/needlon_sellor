import { testMonialDataType } from "../../data/testimonialData";
import { Quote } from "lucide-react";
import RatingStar from "./RatingStar";
import AuthInfo from "./AuthInfo";

const TestimonialCard = ({ item }: { item: testMonialDataType }) => {
  return (
    <div
      className={`relative rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between h-full
      ${
        item.isFeatured
          ? "bg-linear-to-b from-slate-900 to-indigo-950 text-white border-slate-800 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.25)] md:scale-105 z-10"
          : "bg-white text-slate-800 border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] hover:border-slate-200"
      }`}
    >
      <Quote
        size={56}
        className={`absolute right-6 top-6 opacity-[0.03] pointer-events-none transform rotate-180
        ${item.isFeatured ? "text-white opacity-[0.07]" : "text-slate-900"}`}
      />
      <RatingStar
        rating={item.rating}
        isFeatured={item.isFeatured}
        quote={item.quote}
      />

      <AuthInfo item={item} />
    </div>
  );
};

export default TestimonialCard;
