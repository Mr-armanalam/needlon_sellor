import SettingsForm from "./settings-form";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Platform-wide values applied across every seller — the commission
          rate feeds the seller dashboard and earnings ledger directly.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
