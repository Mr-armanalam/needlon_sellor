"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import EarningCalcHeader from "../components/earning-calc-header";
import ProductSold from "../components/ProductSold";
import ProductRevenue from "../components/product-revenue";

export default function EarningsCalculator() {
  const [productsSold, setProductsSold] = useState(30);
  const [avgProfit, setAvgProfit] = useState(150);

  const monthlyIncome = productsSold * avgProfit;
  const yearlyIncome = monthlyIncome * 12;

  return (
    <section className="py-24 px-4 max-w-5xl mx-auto">
      <EarningCalcHeader />

      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-1 md:grid-cols-12">
        <div className="p-8 md:p-12 md:col-span-7 flex flex-col justify-between space-y-8">
          <ProductSold
            sliderValue={productsSold}
            setSliderValue={setProductsSold}
            label="Products sold per month"
            value={productsSold.toString() + " pcs"}
            low="5"
            mid="100"
            high="200"
            step="5"
          />
          <ProductSold
            sliderValue={avgProfit}
            setSliderValue={setAvgProfit}
            label="Average profit per product"
            value={"₹" + avgProfit.toLocaleString("en-IN")}
            low="50"
            mid="500"
            high="1000"
            step="10"
            isPrice={true}
          />

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500 font-medium">
            <Sparkles size={14} className="text-amber-500 shrink-0" />
            <p>Based on 0% marketplace commission deduction rules.</p>
          </div>
        </div>

        <ProductRevenue
          monthlyIncome={monthlyIncome}
          yearlyIncome={yearlyIncome}
        />
      </div>
    </section>
  );
}
