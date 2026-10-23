import PartnersManager from "./partners-manager";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminDeliveryPartnersPage() {
  return (
    <AdminPageShell
      title="Delivery Partners"
      description="Platform shipping partners and their rate cards. Sellers connect their own carrier accounts to these partners; partners and methods themselves are managed here, never created at request time."
    >
      <PartnersManager />
    </AdminPageShell>
  );
}
