"use client";

import { useRouter } from "next/navigation";
import PerformanceHeaderTrendInd from "../components/performance-header-trend-indicator";
import SparkInlineCont from "../components/spark-inline-container";
import { metricsType } from "../data/performance-snapData";
import { PerformanceMetricDto } from "../dto/dashboard.dto";

const PerformanceMetricCard = ({ metric }: { metric: PerformanceMetricDto | metricsType }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/analytics")}
      className="bg-white border border-neutral-100/80 p-5 rounded-2xl flex flex-col justify-between gap-2 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)] cursor-pointer"
    >
      <PerformanceHeaderTrendInd metric={metric as any} />
      <SparkInlineCont metric={metric as any} />
    </div>
  );
};

export default PerformanceMetricCard;

