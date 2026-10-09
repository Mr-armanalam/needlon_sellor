import { weddingTimelinedata } from "@/data/service-data";

const WeddingTimeline = () => {
  return (
    <section id="timeline" className="bg-[#F5F3EF] dark:bg-white/3 py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-[#1A1D2E] dark:text-white mb-4 text-4xl md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Wedding Timeline
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We recommend beginning the tailoring process well in advance to
            ensure a stress-free experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {weddingTimelinedata?.map((data, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border-2 border-[#D4AF37]">
                    <span
                      className="text-[#D4AF37]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {data.time}
                    </span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h4
                    className="text-[#1A1D2E] dark:text-white/80 mb-2 text-xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {data.title}
                  </h4>
                  <p className="text-gray-600">{data.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingTimeline;
