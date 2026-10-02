import { ArrowUpRight } from "lucide-react";

const Support = () => {
  return (
    <div className="space-y-4">
      <h5 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
        Support
      </h5>
      <ul className="space-y-2.5 text-sm font-medium">
        <li>
          <a href="#help" className="hover:text-white transition-colors">
            Help Center
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact Us
          </a>
        </li>
        <li>
          <a
            href="mailto:support@needlon.com"
            className="hover:text-white transition-colors"
          >
            Email Support
          </a>
        </li>
        <li>
          <a
            href="#whatsapp"
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-bold"
          >
            WhatsApp Support <ArrowUpRight size={14} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Support;
