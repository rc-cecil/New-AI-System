"use client";

import {
  Activity,
  Bot,
  Boxes,
  CheckSquare2,
  CircleDollarSign,
  FolderKanban,
  Gauge,
  GitBranch,
  LayoutGrid,
  ListTodo,
  Settings,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Workspaces", href: "/workspaces", icon: LayoutGrid },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Tasks", href: "/tasks", icon: ListTodo, badge: "18" },
  { label: "Workflows", href: "/workflows", icon: Workflow, disabled: true },
  { label: "Repositories", href: "/repositories", icon: GitBranch },
  { label: "Approvals", href: "/approvals", icon: CheckSquare2, badge: "6" },
  { label: "Integrations", href: "/integrations", icon: Boxes },
  { label: "Usage", href: "/usage", icon: CircleDollarSign },
  { label: "Audit Logs", href: "/audit", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={cn("fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-border bg-background-deep px-3 py-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-11 items-center justify-between px-2">
          <BrandMark />
          <Button className="lg:hidden" variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
            <X className="size-5" />
          </Button>
        </div>

        <nav aria-label="Primary navigation" className="mt-7 flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-disabled={item.disabled || undefined}
                onClick={(event) => {
                  if (item.disabled) event.preventDefault();
                  else onClose();
                }}
                className={cn(
                  "group flex min-h-10 items-center gap-3 rounded-[7px] px-3 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.disabled && <span className="text-[9px] uppercase tracking-wider">Later</span>}
                {item.badge && <span className="rounded-full bg-surface-raised px-1.5 py-0.5 text-[10px] text-foreground">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[9px] border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Boxes className="size-4 text-primary" />
            Workspace plan
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">Team Pro</p>
          <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
            <span><b className="text-success">42</b> / 100 agents</span>
            <Activity className="size-4 text-primary" />
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
            <div className="h-full w-[42%] rounded-full bg-primary" />
          </div>
        </div>
      </aside>
    </>
  );
}
