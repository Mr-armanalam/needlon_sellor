import { getAdminOverviewService } from "@/modules/admin/services/admin.service";

import { AdminPageShell } from "./page-shell";

export const dynamic = "force-dynamic";

const cardClass =
  "rounded-2xl border border-border bg-card shadow-[0_18px_40px_-24px_rgba(38,32,24,0.25)]";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={`${cardClass} relative overflow-hidden p-5`}>
      <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brass-400 via-brass-500 to-brass-600/40" />
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2.5 font-garamond text-4xl leading-none text-foreground">
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
    <div className={`${cardClass} p-6`}>
      <p className="font-garamond text-xl text-foreground">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-border/70">
          {rows.map(([status, total]) => (
            <li
              key={status}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <span className="flex items-center gap-2.5 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brass-500" />
                {status}
              </span>
              <span className="font-garamond text-lg leading-none text-foreground">
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
    <AdminPageShell
      title="Platform Overview"
      description="Live counts from the platform database."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Sellers" value={overview.sellers} />
        <StatCard label="Stores" value={overview.stores} />
        <StatCard label="Buyers" value={overview.buyers} />
        <StatCard label="Products" value={overview.products} />
        <StatCard label="Orders" value={overview.orders} />
        <StatCard
          label="Open support tickets"
          value={overview.openSupportTickets}
        />
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
    </AdminPageShell>
  );
}
