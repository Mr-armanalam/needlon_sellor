import { Role } from "@/db/schema/seller";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: Role;
}

export interface VerifyEmailRequest {
  type: "signup" | "reset";
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  type: "signup" | "reset";
  email: string;
  code: string;
}

export interface ResetOtpRequest {
  email: string;
  type?: string;
}

export type ResetPasswordRequest = {
  token: string;
  password: string;
};


export type AuthSeller = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
};
