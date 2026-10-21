import CategoriesManager from "./categories-manager";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Categories</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          The storefront catalog taxonomy. Parent, path and level are kept in
          sync by the platform — sellers only pick from these categories.
        </p>
      </div>
      <CategoriesManager />
    </div>
  );
}
