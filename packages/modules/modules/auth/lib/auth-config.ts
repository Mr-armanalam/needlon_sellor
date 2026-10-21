export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/pricing",
];

export const ADMIN_ROUTES = ["/admin"];

// Delivery executives are not sellers: their page authenticates with its
// own `executive-session` cookie (see modules/delivery/lib/executive-session),
// so the seller-session proxy must let the page through untouched. The
// page's data routes live under /api (outside the proxy matcher) and check
// the executive cookie themselves.
export const EXECUTIVE_ROUTES = ["/delivery-executive"];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function isProtectedRoute(pathname: string): boolean {
  return (
    !isPublicRoute(pathname) &&
    !isAuthRoute(pathname) &&
    !isAdminRoute(pathname) &&
    !isExecutiveRoute(pathname)
  );
}

export function isExecutiveRoute(pathname: string): boolean {
  return EXECUTIVE_ROUTES.some((route) => matchesRoute(pathname, route));
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => matchesRoute(pathname, route));
}

export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => matchesRoute(pathname, route));
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}
