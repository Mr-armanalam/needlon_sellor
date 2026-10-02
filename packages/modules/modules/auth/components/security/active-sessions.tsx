"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { apiFetch } from "@/modules/auth/lib/auth-client";

import { RevokeSessionButton } from "./revoke-session-button";

import { LogoutAllButton } from "./logout-all-button";
import { AuthSession } from "@/types/session";

export function ActiveSessions() {
  const [sessions, setSessions] = useState<AuthSession[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadSessions() {
    try {
      setLoading(true);

      const response = await apiFetch("/api/auth/sessions");

      const data = await response.json();

      setSessions(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  if (loading) {
    return <p>Loading active sessions...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <LogoutAllButton onSuccess={loadSessions} />
      </div>

      {sessions.map((session) => (
        <Card key={session.id}>
          <CardContent className="flex items-center justify-between py-6">
            <div className="space-y-1">
              <p className="font-medium">
                {session.isCurrent ? "Current Device" : "Active Device"}
              </p>

              <p className="text-sm text-muted-foreground">
                {session.userAgent ?? "Unknown device"}
              </p>

              <p className="text-xs text-muted-foreground">
                IP: {session.ipAddress ?? "Unknown"}
              </p>

              <p className="text-xs text-muted-foreground">
                Expires: {new Date(session.expiresAt).toLocaleString()}
              </p>
            </div>

            {!session.isCurrent && (
              <RevokeSessionButton
                sessionId={session.id}
                onSuccess={loadSessions}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
