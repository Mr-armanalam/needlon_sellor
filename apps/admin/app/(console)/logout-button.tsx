"use client";

import { useState } from "react";

/**
 * Signs the admin out via this app's /api/auth/logout (which revokes the
 * session + blocklists the access token) and returns to the login page.
 */
export default function LogoutButton({
  className,
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  const [pending, setPending] = useState(false);

  async function onLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the call fails, the cookies are the session — the server
      // clears them on success; on failure we still leave the console and
      // the login page will sort out the state.
    }
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={pending}
      className={className}
    >
      {pending ? "Signing out…" : label}
    </button>
  );
}
