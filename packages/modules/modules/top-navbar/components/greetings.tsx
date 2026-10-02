const Greetings = () => {
  return (
    <div className="flex flex-col gap-0.5">
      <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight flex items-center gap-2">
        Good Morning, Arman{" "}
        <span className="animate-wave origin-[70%_70%] inline-block">👋</span>
      </h1>
      <p className="text-[13px] text-neutral-400 font-normal tracking-tight">
        Your boutique is looking great today.
      </p>
    </div>
  );
};

export default Greetings;
