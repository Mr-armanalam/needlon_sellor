import { apiClient } from "@/modules/shared/api/api-client";
import {
  ForgotPasswordRequest,
  LoginRequest,
  ResetOtpRequest,
  ResetPasswordRequest,
  SignupRequest,
  VerifyEmailRequest,
  VerifyResetOtpRequest,
} from "@/types/auth";

export async function signupClient(body: SignupRequest) {
  return apiClient.post<any>("/api/auth/signup", body);
}

export async function loginClient(body: LoginRequest) {
  return apiClient.post<any>("/api/auth/login", body);
}

export async function verifyEmailClient(body: VerifyEmailRequest) {
  return apiClient.post<any>("/api/auth/verify-otp", body);
}

export async function forgotPasswordClient(body: ForgotPasswordRequest) {
  return apiClient.post<any>("/api/auth/forgot-password", body);
}

export async function verifyResetOtpClient(body: VerifyResetOtpRequest) {
  return apiClient.post<any>("/api/auth/verify-otp", body);
}

export async function resendOtpClient(body: ResetOtpRequest) {
  return apiClient.post<any>("/api/auth/send-otp", body);
}

export async function resetPasswordClient(body: ResetPasswordRequest) {
  return apiClient.post<any>("/api/auth/reset-password", body);
}

export async function logoutClient() {
  return apiClient.post<any>("/api/auth/logout", {});
}
