"use client";

import { Bell, ChevronDown, CircleHelp, GitBranch, LogOut, Menu, Search } from "lucide-react";

import { useMockSession } from "@/components/session/mock-session-provider";
import { Button } from "@/components/ui/button";

export function Topbar({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  const { user, signOut } = useMockSession();

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-7">
      <Button className="lg:hidden" variant="ghost" size="icon" onClick={onOpenNavigation} aria-label="Open navigation">
        <Menu className="size-5" />
      </Button>

      <label className="context-select hidden xl:flex">
        <span className="sr-only">Workspace</span>
        <select defaultValue="acme" aria-label="Workspace">
          <option value="acme">Acme Engineering</option>
          <option value="product">Product Labs</option>
          <option value="sandbox">Client Sandbox</option>
        </select>
        <ChevronDown className="pointer-events-none size-4 text-muted-foreground" />
      </label>
      <label className="context-select hidden md:flex">
        <span className="sr-only">Project</span>
        <select defaultValue="web" aria-label="Project">
          <option value="web">acme/web-app</option>
          <option value="api">acme/api-service</option>
          <option value="insights">product/insights</option>
        </select>
        <ChevronDown className="pointer-events-none size-4 text-muted-foreground" />
      </label>
      <button type="button" className="context-button hidden 2xl:flex">
        <GitBranch className="size-4" />
        <span>main</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      <button type="button" className="mx-auto flex h-10 min-w-0 max-w-[380px] flex-1 items-center gap-2 rounded-[8px] border border-border bg-surface px-3 text-left text-xs text-muted-foreground hover:border-border-strong">
        <Search className="size-4 shrink-0" />
        <span className="truncate">Search tasks, agents, workflows...</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] sm:block">⌘ K</kbd>
      </button>

      <div className="hidden items-center gap-2 xl:flex" aria-label="Provider health">
        {["GPT-4o", "Claude 3.5", "Gemini 1.5"].map((provider, index) => (
          <span key={provider} className="provider-pill">
            <span className={index === 1 ? "size-1.5 rounded-full bg-warning" : "size-1.5 rounded-full bg-success"} />
            {provider}
          </span>
        ))}
      </div>

      <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
        <Bell className="size-5" />
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">3</span>
      </Button>
      <Button className="hidden sm:inline-flex" variant="ghost" size="icon" aria-label="Help">
        <CircleHelp className="size-5" />
      </Button>
      <details className="group relative">
        <summary
          className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full border border-border bg-gradient-to-br from-[#f2c7a6] to-[#81573f] text-xs font-bold text-[#20140f] marker:hidden"
          aria-label="Open profile menu"
        >
          {user?.initials ?? "?"}
        </summary>
        <div className="absolute right-0 top-12 w-64 rounded-[9px] border border-border bg-surface p-2 shadow-2xl">
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-semibold text-foreground">{user?.name ?? "Mock user"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{user?.email ?? "No active session"}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-primary">{user?.role ?? "Signed out"}</p>
          </div>
          <button type="button" className="mt-2 flex min-h-10 w-full items-center gap-2 rounded-[7px] px-3 text-left text-xs text-muted-foreground hover:bg-surface-raised hover:text-foreground" onClick={signOut}>
            <LogOut className="size-4" /> Sign out of mock session
          </button>
        </div>
      </details>
    </header>
  );
}
