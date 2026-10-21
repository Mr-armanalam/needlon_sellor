import HeroBannersManager from "./hero-banners-manager";

export const dynamic = "force-dynamic";

export default function AdminHeroBannersPage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hero Banners</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Storefront homepage hero banners. Only active banners are shown,
          in display order.
        </p>
      </div>
      <HeroBannersManager />
    </div>
  );
}
