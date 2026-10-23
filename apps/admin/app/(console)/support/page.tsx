import SupportInbox from "./support-inbox";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminSupportPage() {
  return (
    <AdminPageShell
      title="Support Inbox"
      description="Every seller support ticket across the platform. Replies posted here land in the seller's own support thread immediately."
    >
      <SupportInbox />
    </AdminPageShell>
  );
}
