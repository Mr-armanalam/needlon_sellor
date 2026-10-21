import KnowledgeBaseManager from "./knowledge-base-manager";

export const dynamic = "force-dynamic";

export default function AdminKnowledgeBasePage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Help-centre articles shown to sellers. Drafts (unpublished) are
          hidden from the seller help centre until you publish them.
        </p>
      </div>
      <KnowledgeBaseManager />
    </div>
  );
}
