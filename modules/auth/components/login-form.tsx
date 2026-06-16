"use client";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { loginRequestSchema, LoginRequestInput } from "../validations/login-request-schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequestInput>({
    resolver: zodResolver(loginRequestSchema),
  });

  const onSubmit = async (values: LoginRequestInput) => {
    console.log(values);
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Email" {...form.register("email")} />

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...form.register("password")}
        />

        <button
          type="button"
          className="absolute right-3 top-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
}
