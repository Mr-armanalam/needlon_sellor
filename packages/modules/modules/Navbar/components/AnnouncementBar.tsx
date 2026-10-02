export default function AnnouncementBar() {
  return (
    <div className="bg-[#FFF0F2] text-[#D11A3D] border-b border-[#FDD6DC] px-6 py-2 text-sm font-medium flex justify-between items-center w-full">
      {/* Centered promo text */}
      <div className="flex-1 text-center flex justify-center items-center gap-2">
        <span>🎉</span>
        <span>Start free for 40 days • No commission • No hidden charges</span>
      </div>
    </div>
  );
}
