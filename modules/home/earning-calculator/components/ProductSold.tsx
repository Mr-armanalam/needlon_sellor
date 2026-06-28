import React from "react";

const ProductSold = ({
  sliderValue,
  setSliderValue,
  label,
  value,
  low,
  mid,
  high,
  step,
  isPrice,
}: {
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  label: string;
  value: string;
  low: string;
  mid: string;
  high: string;
  step: string;
  isPrice?: boolean;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>
        <span className="bg-slate-100 text-slate-800 text-sm font-bold px-3 py-1 rounded-lg border border-slate-200/60 font-mono">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={low}
        max={high}
        step={step}
        value={sliderValue}
        onChange={(e) => setSliderValue(Number(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between text-[11px] font-medium text-slate-400">
        <span>{isPrice ? "₹" : ""}{low}</span>
        <span>{isPrice ? "₹" : ""}{mid}</span>
        <span>{isPrice ? "₹" : ""}{high}</span>
      </div>
    </div>
  );
};

export default ProductSold;
