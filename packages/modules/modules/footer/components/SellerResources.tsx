import React from "react";

const SellerResources = () => {
  return (
    <div className="space-y-4 pt-4 md:pt-0 md:pl-8 lg:pl-12">
      <h5 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
        Seller Resources
      </h5>
      <ul className="space-y-2.5 text-sm font-medium">
        {[
          "Seller Guide",
          "Selling Tips",
          "Subscription Plans",
          "Community Guidelines",
        ].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-white transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerResources;
