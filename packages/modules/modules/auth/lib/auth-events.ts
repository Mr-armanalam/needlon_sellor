type Listener = () => void;
type AuthState = "login" | "logout";

const listeners = new Set<Listener>();
const AUTH_STATE_EVENT = "needlon:auth-state-change";
const AUTH_STATE_CHANNEL = "needlon-auth-state";
const AUTH_STATE_STORAGE_KEY = "needlon-auth-state";

export function onAuthFailure(listener: Listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function emitAuthFailure() {
  for (const listener of listeners) {
    listener();
  }
}

export function notifyAuthStateChanged(state: AuthState) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<AuthState>(AUTH_STATE_EVENT, { detail: state }),
  );

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(AUTH_STATE_CHANNEL);
    channel.postMessage(state);
    channel.close();
    return;
  }

  try {
    window.localStorage.setItem(
      AUTH_STATE_STORAGE_KEY,
      JSON.stringify({ state, timestamp: Date.now() }),
    );
  } catch (error) {
    console.warn("[Auth] Unable to sync auth state across tabs:", error);
  }
}

export function onAuthStateChanged(listener: (state: AuthState) => void) {
  if (typeof window === "undefined") return () => {};

  const onCustomEvent = (event: Event) => {
    listener((event as CustomEvent<AuthState>).detail);
  };
  const onStorageEvent = (event: StorageEvent) => {
    if (event.key !== AUTH_STATE_STORAGE_KEY || !event.newValue) return;

    try {
      const value = JSON.parse(event.newValue) as { state?: AuthState };
      if (value.state === "login" || value.state === "logout") {
        listener(value.state);
      }
    } catch (error) {
      console.warn("[Auth] Unable to read auth state from another tab:", error);
    }
  };
  const channel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel(AUTH_STATE_CHANNEL)
      : null;
  const onChannelMessage = (event: MessageEvent<unknown>) => {
    if (event.data === "login" || event.data === "logout") {
      listener(event.data);
    }
  };

  window.addEventListener(AUTH_STATE_EVENT, onCustomEvent);
  window.addEventListener("storage", onStorageEvent);
  channel?.addEventListener("message", onChannelMessage);

  return () => {
    window.removeEventListener(AUTH_STATE_EVENT, onCustomEvent);
    window.removeEventListener("storage", onStorageEvent);
    channel?.removeEventListener("message", onChannelMessage);
    channel?.close();
  };
}
