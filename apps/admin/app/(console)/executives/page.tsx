import ExecutivesManager from "./executives-manager";

export const dynamic = "force-dynamic";

export default function AdminExecutivesPage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Delivery Executives
        </h1>
        <p className="mt-0.5 text-xs text-gray-400">
          The platform delivery roster. Sellers assign shipments to ACTIVE
          executives; executives sign in with their phone number and
          password to work their deliveries.
        </p>
      </div>
      <ExecutivesManager />
    </div>
  );
}
