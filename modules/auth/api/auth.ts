import {
  ForgotPasswordRequest,
  LoginRequest,
  ResetOtpRequest,
  ResetPasswordRequest,
  SignupRequest,
  VerifyEmailRequest,
  VerifyResetOtpRequest,
} from "@/types/auth";

const BASE_URL = "/api/auth";

async function request(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  return response;
}

export const authApi = {
  signup: (body: SignupRequest) =>
    request("/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: LoginRequest) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyEmail: (body: VerifyEmailRequest) =>
    request("/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  forgotPassword: (body: ForgotPasswordRequest) =>
    request("/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyResetOtp: (body: VerifyResetOtpRequest) =>
    request("/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resendOtp: (body: ResetOtpRequest) =>
    request("/send-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resetPassword: (body: ResetPasswordRequest) =>
    request("/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    request("/logout", {
      method: "POST",
    }),
    
  getSessions: () => request("/sessions"),

  logoutSession: (sessionId: string) =>
    request(`/sessions/${sessionId}`, {
      method: "DELETE",
    }),

  logoutAllSessions: () =>
    request("/sessions/logout-all", {
      method: "POST",
    }),
};
