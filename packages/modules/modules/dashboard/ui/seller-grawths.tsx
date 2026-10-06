import GamifiedCard from '../view/gamified-card';
import { SellerGrowthOverviewDto } from '../dto/dashboard.dto';

interface SellerGrowthProps {
  sellerGrowth?: SellerGrowthOverviewDto;
}

export default function SellerGrowth({ sellerGrowth }: SellerGrowthProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Seller Growth
        </h3>
      </div>

      {/* Main Gamified Card */}
      <GamifiedCard sellerGrowth={sellerGrowth} />
    </div>
  );
}