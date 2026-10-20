import { apiClient } from "@/modules/shared/api/api-client";
import {
  AuthSeller,
  ForgotPasswordRequest,
  LoginRequest,
  ResetOtpRequest,
  ResetPasswordRequest,
  SignupRequest,
  VerifyEmailRequest,
  VerifyResetOtpRequest,
} from "@/types/auth";

/**
 * Response payloads returned by the `/api/auth/*` routes
 * (the `data` field unwrapped by `apiClient`).
 */

export interface LoginResponse {
  user: Pick<AuthSeller, "id" | "name" | "email" | "role">;
}

export interface VerifyEmailResponse {
  type: string;
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyResetOtpResponse {
  type: "reset";
  resetToken: string;
}

export interface SendOtpResponse {
  message: string;
}

export async function signupClient(body: SignupRequest) {
  // The signup route returns only `{ success: true }` with no data payload.
  return apiClient.post<void>("/api/auth/signup", body);
}

export async function loginClient(body: LoginRequest) {
  return apiClient.post<LoginResponse>("/api/auth/login", body);
}

export async function verifyEmailClient(body: VerifyEmailRequest) {
  return apiClient.post<VerifyEmailResponse>("/api/auth/verify-otp", body);
}

export async function forgotPasswordClient(body: ForgotPasswordRequest) {
  return apiClient.post<ForgotPasswordResponse>(
    "/api/auth/forgot-password",
    body,
  );
}

export async function verifyResetOtpClient(body: VerifyResetOtpRequest) {
  return apiClient.post<VerifyResetOtpResponse>("/api/auth/verify-otp", body);
}

export async function resendOtpClient(body: ResetOtpRequest) {
  return apiClient.post<SendOtpResponse>("/api/auth/send-otp", body);
}

export async function resetPasswordClient(body: ResetPasswordRequest) {
  // The reset-password route returns only `{ success: true }`.
  return apiClient.post<void>("/api/auth/reset-password", body);
}

export async function logoutClient() {
  // The logout route returns only `{ success: true }`.
  return apiClient.post<void>("/api/auth/logout", {});
}
