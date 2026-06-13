export async function refreshSession() {
  try {
    const response =
      await fetch(
        "/api/auth/refresh",
        {
          method: "POST",
          credentials:
            "include",
        }
      );

    return response.ok;
  } catch {
    return false;
  }
}

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit
) {
  let response =
    await fetch(
      input,
      init
    );

  if (
    response.status ===
    401
  ) {
    const refreshed =
      await refreshSession();

    if (refreshed) {
      response =
        await fetch(
          input,
          init
        );
    }
  }

  return response;
}


// Signup
//  ↓
// POST /signup
//  ↓
// OTP Sent
//  ↓
// Verify Email
//  ↓
// POST /verify-email
//  ↓
// Login
//  ↓
// POST /login
//  ↓
// Access Cookie
// Refresh Cookie
//  ↓
// Dashboard

// Access Expired
//  ↓
// POST /refresh
//  ↓
// New Access Token

// Logout
//  ↓
// POST /logout
//  ↓
// Cookies Removed
//  ↓
// Login