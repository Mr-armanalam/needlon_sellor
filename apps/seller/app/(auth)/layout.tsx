import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container flex min-h-screen items-center justify-center">
        {children}
      </div>
    </div>
  );
}