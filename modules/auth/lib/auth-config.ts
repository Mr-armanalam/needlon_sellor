export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/orders",
  "/products",
  "/settings",
];

// ─── Admin-only pages ─────────────────────────────────────────────────────────
// Only users with role === "admin" may access these.
// Sellers hitting any of these paths are redirected to /dashboard (middleware),
// or receive a 403 JSON response (Route Handlers / Server Components via
// requireAdmin()).
//
// Here we keep this list prefix-based — "/admin" covers /admin/sellers, /admin/orders,
// etc., because the middleware uses `pathname.startsWith(route)`.
export const ADMIN_ROUTES = ["/admin"];