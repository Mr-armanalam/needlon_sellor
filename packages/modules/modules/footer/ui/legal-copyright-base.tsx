import { Heart } from "lucide-react";
import React from "react";

const LegalAndCopyrightBase = () => {
  return (
    <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
      {/* Copyright Meta */}
      <div className="text-center md:text-left space-y-1">
        <p>© 2026 Needlon. Empowering Local Sellers.</p>
        <p className="flex items-center justify-center md:justify-start gap-1 text-[11px] opacity-75">
          Made with{" "}
          <Heart
            size={10}
            className="fill-rose-500 text-rose-500 animate-pulse"
          />{" "}
          in India
        </p>
      </div>

      {/* Legal Docs Navigation Links */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <a href="#privacy" className="hover:text-slate-300 transition-colors">
          Privacy Policy
        </a>
        <a href="#terms" className="hover:text-slate-300 transition-colors">
          Terms & Conditions
        </a>
        <a href="#refund" className="hover:text-slate-300 transition-colors">
          Refund Policy
        </a>
        <a href="#cookies" className="hover:text-slate-300 transition-colors">
          Cookie Policy
        </a>
      </div>
    </div>
  );
};

export default LegalAndCopyrightBase;
