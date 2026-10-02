import { faqData } from "../../data/faqData";
import FAQHeader from "../components/FAQHeader";
import CustomAccordian from "../components/CustomAccordian";

export default function FAQSection() {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto border-t border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        <FAQHeader />

        <div className="lg:col-span-8 space-y-3">
          {faqData.map((item) => {
            return <CustomAccordian item={item} key={item.id} />;
          })}
        </div>
      </div>
    </section>
  );
}
