import PartnersManager from "./partners-manager";

export const dynamic = "force-dynamic";

export default function AdminDeliveryPartnersPage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Delivery Partners</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Platform shipping partners and their rate cards. Sellers connect
          their own carrier accounts to these partners; partners and methods
          themselves are managed here, never created at request time.
        </p>
      </div>
      <PartnersManager />
    </div>
  );
}
