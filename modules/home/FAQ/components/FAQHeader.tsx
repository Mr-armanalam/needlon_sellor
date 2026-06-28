
const FAQHeader = () => {
  return (
    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-4 text-center lg:text-left">
      <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full inline-block">
        Support
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-serif">
        Frequently Asked Questions
      </h2>
      <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
        Have questions about setting up your clothing shop? We have gathered
        answers to the most common queries from local vendors.
      </p>
    </div>
  );
};

export default FAQHeader;
