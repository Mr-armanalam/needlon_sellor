import SupportInbox from "./support-inbox";

export const dynamic = "force-dynamic";

export default function AdminSupportPage() {
  return (
    <div className="flex w-full flex-col space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Support Inbox</h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Every seller support ticket across the platform. Replies posted
          here land in the seller&apos;s own support thread immediately.
        </p>
      </div>
      <SupportInbox />
    </div>
  );
}
