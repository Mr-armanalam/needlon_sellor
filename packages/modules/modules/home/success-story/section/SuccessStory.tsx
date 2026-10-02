import { testimonials } from "../../data/testimonialData";
import TestimonialHeader from "../components/TestimonialHeader";
import TestimonialCard from "../components/TestimonialCard";

export default function SuccessStories() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <TestimonialHeader />

      {/* Testimonials Responsive Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
