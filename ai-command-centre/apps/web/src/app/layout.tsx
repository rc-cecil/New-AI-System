import type { Metadata } from "next";

import "./globals.css";

import { MockSessionProvider } from "@/components/session/mock-session-provider";

export const metadata: Metadata = {
  title: "AI Command Centre",
  description: "Supervise AI engineering teams, tasks, tools, and approvals.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MockSessionProvider>{children}</MockSessionProvider>
      </body>
    </html>
  );
}
