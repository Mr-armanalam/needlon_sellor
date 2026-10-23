import SellersManager from "./sellers-manager";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminSellersPage() {
  return (
    <AdminPageShell
      title="Sellers"
      description="Verify seller stores and suspend or reactivate accounts. Suspended sellers are rejected at login immediately."
    >
      <SellersManager />
    </AdminPageShell>
  );
}
