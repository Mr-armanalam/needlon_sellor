import KnowledgeBaseManager from "./knowledge-base-manager";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminKnowledgeBasePage() {
  return (
    <AdminPageShell
      title="Knowledge Base"
      description="Help-centre articles shown to sellers. Drafts (unpublished) are hidden from the seller help centre until you publish them."
    >
      <KnowledgeBaseManager />
    </AdminPageShell>
  );
}
