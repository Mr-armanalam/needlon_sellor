import { ActiveSessions } from "@/modules/auth/components/security/active-sessions";

export default function SecurityPage() {
  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Security</h1>

        <p className="text-muted-foreground mt-2">
          Manage active sessions and connected devices.
        </p>
      </div>

      <ActiveSessions />
    </div>
  );
}
