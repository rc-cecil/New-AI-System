"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type MockUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
};

type MockSessionContextValue = {
  user: MockUser | null;
  signIn: () => void;
  signOut: () => void;
};

const mockUser: MockUser = {
  id: "user_alex_kim",
  name: "Alex Kim",
  email: "alex@acme.dev",
  initials: "AK",
  role: "Workspace Owner",
};

const MockSessionContext = createContext<MockSessionContextValue | null>(null);

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(mockUser);

  const value = useMemo<MockSessionContextValue>(
    () => ({
      user,
      signIn: () => {
        setUser(mockUser);
        router.push("/dashboard");
      },
      signOut: () => {
        setUser(null);
        router.replace("/sign-in");
      },
    }),
    [router, user],
  );

  return <MockSessionContext.Provider value={value}>{children}</MockSessionContext.Provider>;
}

export function useMockSession() {
  const context = useContext(MockSessionContext);

  if (!context) {
    throw new Error("useMockSession must be used inside MockSessionProvider");
  }

  return context;
}
