"use client";

import { Bell, Building2, ChevronDown, CircleHelp, GitBranch, GitFork, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Topbar({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-7">
      <Button className="lg:hidden" variant="ghost" size="icon" onClick={onOpenNavigation} aria-label="Open navigation">
        <Menu className="size-5" />
      </Button>

      <button type="button" className="context-button hidden xl:flex">
        <Building2 className="size-4" />
        <span>Acme Engineering</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      <button type="button" className="context-button hidden md:flex">
        <GitFork className="size-4" />
        <span>acme/web-app</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
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
      <button type="button" className="flex size-9 items-center justify-center rounded-full border border-border bg-gradient-to-br from-[#f2c7a6] to-[#81573f] text-xs font-bold text-[#20140f]" aria-label="Open profile menu">
        AK
      </button>
    </header>
  );
}
