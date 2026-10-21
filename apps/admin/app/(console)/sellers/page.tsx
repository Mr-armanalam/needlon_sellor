import SellersManager from "./sellers-manager";

export const dynamic = "force-dynamic";

export default function AdminSellersPage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Sellers</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Verify seller stores and suspend or reactivate accounts. Suspended
          sellers are rejected at login immediately.
        </p>
      </div>
      <SellersManager />
    </div>
  );
}
