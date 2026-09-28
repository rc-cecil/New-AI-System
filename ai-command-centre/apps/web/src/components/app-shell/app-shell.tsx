"use client";

import { useState, type ReactNode } from "react";

import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div className="app-canvas min-h-screen bg-background text-foreground">
      <Sidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
      <div className="min-h-screen lg:pl-[232px]">
        <Topbar onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="relative z-10 px-4 py-6 sm:px-6 lg:px-7 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
