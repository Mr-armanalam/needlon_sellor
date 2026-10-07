import { Suspense } from "react";
import AuthErrorClient from "./auth-error-client";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorClient />
    </Suspense>
  );
}
