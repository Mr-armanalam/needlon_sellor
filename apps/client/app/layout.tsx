import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Providers } from "@/store/providers";
import TanStackProviders from "@/providers/tanstack-provider";
import { ebGaramond, roboto } from "./fonts";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${roboto.variable} ${ebGaramond.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanStackProviders>
            <SessionProvider>
              <Providers>{children}</Providers>
            </SessionProvider>
          </TanStackProviders>
          <Toaster position={"top-right"} />
        </ThemeProvider>
      </body>
    </html>
  );
}
