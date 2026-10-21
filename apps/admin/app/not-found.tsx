import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          This admin console page does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}
