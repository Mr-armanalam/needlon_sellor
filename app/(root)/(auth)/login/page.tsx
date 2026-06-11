import Link from "next/link";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { PasswordInput } from "@/modules/auth/components/password-input";


export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      description="Login to continue"
    >
      <form className="space-y-4">
        <Input placeholder="Email" />

        <PasswordInput placeholder="Password" />

        <Button className="w-full">
          Login
        </Button>

        <div className="flex justify-between text-sm">
          <Link href="/forgot-password">
            Forgot Password?
          </Link>

          <Link href="/signup">
            Sign Up
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}