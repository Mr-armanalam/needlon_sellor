"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDashboard } from "@/modules/dashboard/hooks/use-dashboard";
import PerformanceSnapshot from "@/modules/dashboard/ui/performance-snapshot";
import ProductsOverview from "@/modules/dashboard/ui/products-overview";
import RecentOrders from "@/modules/dashboard/ui/recent-orders";
import SellerGrowth from "@/modules/dashboard/ui/seller-grawths";
import BusinessInsights from "@/modules/dashboard/ui/BuisinessInsights";
import Earnings from "@/modules/dashboard/ui/Earnings";
import QuickActions from "@/modules/dashboard/ui/quickActions";
import WelcomeCard from "@/modules/dashboard/ui/welcomeCard";

export default function DashboardHome() {
  const router = useRouter();
  const {
    data,
    confirmOrder,
    declineOrder,
    duplicateProduct,
    actionLoadingMap,
  } = useDashboard();

  const handleConfirmOrder = async (orderId: string) => {
    const res = await confirmOrder(orderId);
    if (res.success) {
      toast.success("Order confirmed successfully!");
    } else {
      toast.error(res.message || "Failed to confirm order.");
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    const res = await declineOrder(orderId);
    if (res.success) {
      toast.success("Order declined.");
    } else {
      toast.error(res.message || "Failed to decline order.");
    }
  };

  const handleDuplicateProduct = async (productId: string) => {
    const res = await duplicateProduct(productId);
    if (res.success) {
      toast.success("Product duplicated successfully!");
    } else {
      toast.error(res.message || "Failed to duplicate product.");
    }
  };

  const handleChat = (orderId: string) => {
    router.push(`/messages?orderId=${orderId}`);
  };

  return (
    <main className="flex-1 bg-[#FAFAFA] p-6 md:p-8 overflow-y-auto flex flex-col gap-8 no-scrollbar animate-fade-in">
      <section className="w-full">
        <WelcomeCard metrics={data?.welcomeMetrics} />
      </section>

      <section className="w-full">
        <QuickActions storeSlug={data?.storeSlug} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start w-full">
        <div className="xl:col-span-2 w-full">
          <Earnings earnings={data?.earnings} />
        </div>

        <div className="xl:col-span-1 w-full">
          <BusinessInsights insights={data?.insights} />
        </div>
      </section>

      <section className="w-full">
        <PerformanceSnapshot performance={data?.performance} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start w-full">
        <div className="xl:col-span-3 w-full">
          <RecentOrders
            orders={data?.recentOrders}
            onAccept={handleConfirmOrder}
            onDecline={handleDeclineOrder}
            onChat={handleChat}
            actionLoadingMap={actionLoadingMap}
          />
        </div>

        <div className="xl:col-span-2 w-full">
          <SellerGrowth sellerGrowth={data?.sellerGrowth} />
        </div>
      </section>

      <section className="w-full">
        <ProductsOverview
          products={data?.products}
          onDuplicate={handleDuplicateProduct}
          actionLoadingMap={actionLoadingMap}
        />
      </section>
    </main>
  );
}

