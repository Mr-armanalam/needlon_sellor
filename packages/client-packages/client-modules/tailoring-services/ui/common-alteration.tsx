"use client";
import { alterationType } from "@/data/service-data";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CommonAlteration = () => {
  const router = useRouter();
  return (
    <section className="bg-white dark:bg-white/3 py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-[#1A1D2E] dark:text-white mb-4 text-4xl md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Most Requested Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Quick turnaround on everyday alterations that make the biggest
            difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alterationType.map((item, i) => (
            <div key={i} className="p-6 bg-[#F5F3EF] dark:bg-white/3 rounded-sm">
              <h4
                className="text-[#1A1D2E] mb-2 dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </h4>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <p className="text-[#D4AF37]">From ₹{item.price}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Don't see what you need?</p>
          <button
            onClick={() => router.push("/pricing")}
            className="text-[#D4AF37] cursor-pointer hover:text-[#C5A028] transition-colors inline-flex items-center gap-2"
          >
            <span>View Full Price List</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommonAlteration;
