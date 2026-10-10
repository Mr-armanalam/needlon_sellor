// src/store/Providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { AuthSync } from "./auth-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthSync />
      {children}
    </Provider>
  );
}
