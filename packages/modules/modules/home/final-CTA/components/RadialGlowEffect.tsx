
const RadialGlowEffect = () => {
  return (
    <>
      <div className="absolute -left-1/4 -bottom-1/2 w-150 h-150 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-1/4 -top-1/2 w-150 h-150 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
    </>
  );
};

export default RadialGlowEffect;
