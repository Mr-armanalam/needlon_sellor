import { stepsData } from "../../data/stepsData";
import HowItWorkHeader from "../components/how-it-work-header";
import TimeLineGridComp from "../components/timeline-grid-comp";

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <HowItWorkHeader />

      <div className="relative">
        {/* Desktop Connecting Line (Hidden on Mobile) */}
        <div className="hidden lg:block absolute top-9.5 left-[5%] right-[5%] h-0.5 bg-linear-to-r from-slate-100 via-indigo-100 to-slate-100 -z-10" />

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-6">
          {stepsData.map((step, index) => {
            const Icon = step.icon;
            return (
              <TimeLineGridComp
                key={step.id}
                Icon={Icon}
                step={step}
                index={index}
                stepsLength={stepsData.length}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
