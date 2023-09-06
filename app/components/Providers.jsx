"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [!mounted]);

  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}

export const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
