export function usePasswordStrength(
  password: string
) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special:
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score =
    Object.values(checks).filter(Boolean)
      .length;

  const label =
    score <= 2
      ? "Weak"
      : score <= 4
      ? "Medium"
      : "Strong";

  return {
    checks,
    score,
    label,
  };
}