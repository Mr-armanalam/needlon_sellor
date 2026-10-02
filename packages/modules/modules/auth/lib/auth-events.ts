type Listener = () => void;

const listeners = new Set<Listener>();

export function onAuthFailure(listener: Listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function emitAuthFailure() {
  for (const listener of listeners) {
    listener();
  }
}
