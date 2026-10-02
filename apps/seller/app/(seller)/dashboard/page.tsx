import PerformanceSnapshot from "@/modules/dashboard/ui/performance-snapshot";
import ProductsOverview from "@/modules/dashboard/ui/products-overview";
import RecentOrders from "@/modules/dashboard/ui/recent-orders";
import SellerGrowth from "@/modules/dashboard/ui/seller-grawths";
import BusinessInsights from "@/modules/dashboard/ui/BuisinessInsights";
import Earnings from "@/modules/dashboard/ui/Earnings";
import QuickActions from "@/modules/dashboard/ui/quickActions";
import WelcomeCard from "@/modules/dashboard/ui/welcomeCard";

export default function DashboardHome() {
  return (
    <main className="flex-1 bg-[#FAFAFA] p-6 md:p-8 overflow-y-auto flex flex-col gap-8 no-scrollbar animate-fade-in">
      <section className="w-full">
        <WelcomeCard />
      </section>

      <section className="w-full">
        <QuickActions />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start w-full">
        <div className="xl:col-span-2 w-full">
          <Earnings />
        </div>

        <div className="xl:col-span-1 w-full">
          <BusinessInsights />
        </div>
      </section>

      <section className="w-full">
        <PerformanceSnapshot />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start w-full">
        <div className="xl:col-span-3 w-full">
          <RecentOrders />
        </div>

        <div className="xl:col-span-2 w-full">
          <SellerGrowth />
        </div>
      </section>

      <section className="w-full">
        <ProductsOverview />
      </section>
    </main>
  );
}
