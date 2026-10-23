import ExecutivesManager from "./executives-manager";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminExecutivesPage() {
  return (
    <AdminPageShell
      title="Delivery Executives"
      description="The platform delivery roster. Sellers assign shipments to ACTIVE executives; executives sign in with their phone number and password to work their deliveries."
    >
      <ExecutivesManager />
    </AdminPageShell>
  );
}
