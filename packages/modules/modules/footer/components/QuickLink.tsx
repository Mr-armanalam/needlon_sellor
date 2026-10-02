
const QuickLink = () => {
  return (
    <div className="space-y-4 md:pl-8 lg:pl-12">
      <h5 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
        Quick Links
      </h5>
      <ul className="space-y-2.5 text-sm font-medium">
        {["Features", "How It Works", "Pricing", "Success Stories", "FAQs"].map(
          (link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-white transition-colors duration-200 flex items-center gap-1 group"
              >
                {link}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default QuickLink;
