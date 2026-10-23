import CategoriesManager from "./categories-manager";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <AdminPageShell
      title="Categories"
      description="The storefront catalog taxonomy. Parent, path and level are kept in sync by the platform — sellers only pick from these categories."
    >
      <CategoriesManager />
    </AdminPageShell>
  );
}
