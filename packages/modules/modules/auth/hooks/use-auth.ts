'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signupClient,
  loginClient,
  verifyEmailClient,
  forgotPasswordClient,
  verifyResetOtpClient,
  resendOtpClient,
  resetPasswordClient,
  logoutClient,
} from "../api/auth-client";

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginClient,
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: signupClient,
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: verifyEmailClient,
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPasswordClient,
  });
}

export function useVerifyResetOtpMutation() {
  return useMutation({
    mutationFn: verifyResetOtpClient,
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: resendOtpClient,
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPasswordClient,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutClient,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
