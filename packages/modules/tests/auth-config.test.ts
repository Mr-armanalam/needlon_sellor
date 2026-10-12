import assert from "node:assert";
import {
  isAdminRoute,
  isAuthRoute,
  isProtectedRoute,
  isPublicRoute,
} from "../modules/auth/lib/auth-config";

assert.strictEqual(isPublicRoute("/"), true);
assert.strictEqual(isPublicRoute("/pricing"), true);
assert.strictEqual(isPublicRoute("/analytics"), false);

assert.strictEqual(isAuthRoute("/login"), true);
assert.strictEqual(isAuthRoute("/login/reset"), true);
assert.strictEqual(isAuthRoute("/login-help"), false);

assert.strictEqual(isAdminRoute("/admin"), true);
assert.strictEqual(isAdminRoute("/admin/sellers"), true);
assert.strictEqual(isAdminRoute("/administrator"), false);

assert.strictEqual(isProtectedRoute("/dashboard"), true);
assert.strictEqual(isProtectedRoute("/analytics"), true);
assert.strictEqual(isProtectedRoute("/messages"), true);
assert.strictEqual(isProtectedRoute("/login"), false);
assert.strictEqual(isProtectedRoute("/admin"), false);

console.log("Auth route classification tests passed.");
