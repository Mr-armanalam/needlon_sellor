import assert from "node:assert";
import { apiFetch } from "../modules/auth/lib/auth-client";
import {
  notifyAuthStateChanged,
  onAuthStateChanged,
} from "../modules/auth/lib/auth-events";

function testAuthStateNotification() {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const fakeWindow = Object.assign(new EventTarget(), {
    localStorage: { setItem: () => {} },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: fakeWindow,
  });

  let notifiedState: string | undefined;
  const unsubscribe = onAuthStateChanged((state) => {
    notifiedState = state;
  });

  try {
    notifyAuthStateChanged("login");
    assert.strictEqual(notifiedState, "login");
  } finally {
    unsubscribe();
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
}

async function testConcurrentUnauthorizedRequestsShareRefresh() {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  let initialRequests = 0;
  let refreshRequests = 0;
  let retryRequests = 0;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { location: { origin: "http://localhost" } },
  });

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url =
      typeof Request !== "undefined" && input instanceof Request
        ? input.url
        : new URL(input.toString(), "http://localhost").toString();

    if (new URL(url).pathname === "/api/auth/refresh") {
      refreshRequests += 1;
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (initialRequests < 5) {
      initialRequests += 1;
      return new Response(null, { status: 401 });
    }

    retryRequests += 1;
    return new Response(null, { status: 200 });
  }) as typeof fetch;

  try {
    const responses = await Promise.all(
      Array.from({ length: 5 }, () => apiFetch("/api/seller/test")),
    );

    assert.strictEqual(responses.every((response) => response.ok), true);
    assert.strictEqual(refreshRequests, 1);
    assert.strictEqual(retryRequests, 5);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
}

testAuthStateNotification();

testConcurrentUnauthorizedRequestsShareRefresh()
  .then(() => console.log("Auth state and concurrency tests passed."))
  .catch((error) => {
    console.error("Auth client concurrency test failed:", error);
    process.exitCode = 1;
  });
