import React from "react";

const SocialMedia = () => {
  return (
    <div className="space-y-4 pt-4 md:pt-0">
      <h5 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
        Connect With Us
      </h5>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
        {["Facebook", "Instagram", "YouTube", "LinkedIn"].map((platform) => (
          <a
            key={platform}
            href={`#${platform.toLowerCase()}`}
            className="hover:text-indigo-400 text-slate-400 transition-colors"
          >
            {platform}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
