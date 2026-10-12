import assert from "node:assert";
import { apiErrorFromPayload } from "../modules/shared/api/api-client";

const legacyError = apiErrorFromPayload(
  { error: "Internal server error" },
  500,
  "",
);
assert.strictEqual(legacyError.message, "Internal server error");
assert.strictEqual(legacyError.status, 500);

const standardError = apiErrorFromPayload(
  {
    success: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Authentication required.",
      details: { reason: "expired" },
    },
  },
  401,
  "Unauthorized",
);
assert.strictEqual(standardError.code, "UNAUTHORIZED");
assert.strictEqual(standardError.message, "Authentication required.");
assert.deepStrictEqual(standardError.details, { reason: "expired" });

const malformedError = apiErrorFromPayload({}, 500, "");
assert.strictEqual(
  malformedError.message,
  "The request failed. Please try again.",
);

console.log("API client error normalization tests passed.");
