import { getAdminOverviewService } from "@/modules/admin/services/admin.service";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function BreakdownCard({
  title,
  entries,
}: {
  title: string;
  entries: Record<string, number>;
}) {
  const rows = Object.entries(entries).sort(([a], [b]) => a.localeCompare(b));
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">No data yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map(([status, total]) => (
            <li
              key={status}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500">{status}</span>
              <span className="font-medium text-gray-900">
                {total.toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminOverviewPage() {
  const overview = await getAdminOverviewService();

  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Platform Overview</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Live counts from the platform database.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Sellers" value={overview.sellers} />
        <StatCard label="Stores" value={overview.stores} />
        <StatCard label="Buyers" value={overview.buyers} />
        <StatCard label="Products" value={overview.products} />
        <StatCard label="Orders" value={overview.orders} />
        <StatCard label="Open support tickets" value={overview.openSupportTickets} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BreakdownCard
          title="Delivery executives by status"
          entries={overview.executivesByStatus}
        />
        <BreakdownCard
          title="Shipments by status"
          entries={overview.shipmentsByStatus}
        />
      </div>
    </div>
  );
}
