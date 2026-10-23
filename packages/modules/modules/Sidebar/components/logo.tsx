
const Logo = () => {
  return (
    <div className="px-3 py-2 flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-iris-400 to-iris-700 flex items-center justify-center shadow-[0_8px_18px_-6px_rgba(61,60,181,0.6)]">
        <span className="text-primary-foreground font-semibold text-lg">Ω</span>
      </div>
      <span className="font-semibold text-neutral-800 text-[17px] tracking-tight">
        Needlon Hub
      </span>
    </div>
  );
};

export default Logo;
