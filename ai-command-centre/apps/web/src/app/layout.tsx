import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Command Centre",
  description: "Supervise AI engineering teams, tasks, tools, and approvals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
