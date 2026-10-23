import SettingsForm from "./settings-form";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <AdminPageShell
      title="Platform Settings"
      description="Platform-wide values applied across every seller — the commission rate feeds the seller dashboard and earnings ledger directly."
    >
      <SettingsForm />
    </AdminPageShell>
  );
}
