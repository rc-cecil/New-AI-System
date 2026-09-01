import { ArrowRight, Bot, CheckCircle2, Clock3, GitPullRequest, Layers3, ShieldCheck, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell/app-shell";
import { Button } from "@/components/ui/button";

const foundations = [
  {
    icon: Layers3,
    title: "Next.js workspace",
    description: "App Router, strict TypeScript, Tailwind and reusable UI primitives are configured.",
    accent: "text-primary bg-primary/15",
  },
  {
    icon: ShieldCheck,
    title: "Human controlled",
    description: "Approval context stays visible before consequential agent and Git actions.",
    accent: "text-success bg-success/15",
  },
  {
    icon: Bot,
    title: "Agent ready",
    description: "The shell is prepared for typed mocks and live API/realtime adapters.",
    accent: "text-purple bg-purple/15",
  },
];

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1480px]">
        <section className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-primary">
              <Sparkles className="size-4" />
              Person B product surface
            </div>
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-[32px]">
              Command centre foundation
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A responsive operational shell for supervising AI agents, repositories, tasks, approvals, and usage from one secure workspace.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View architecture</Button>
            <Button>Continue setup <ArrowRight className="size-4" /></Button>
          </div>
        </section>

        <section aria-labelledby="foundation-heading" className="py-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 id="foundation-heading" className="text-base font-semibold text-foreground">Foundation status</h2>
              <p className="mt-1 text-xs text-muted-foreground">B-101 application shell and design-system baseline</p>
            </div>
            <span className="status-pill"><CheckCircle2 className="size-3.5" /> Ready</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {foundations.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="surface-card group">
                  <div className={`flex size-10 items-center justify-center rounded-[9px] ${item.accent}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
                  <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-[11px] text-success">
                    <CheckCircle2 className="size-3.5" /> Configured
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-3 xl:grid-cols-[1.4fr_0.8fr]">
          <article className="surface-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Product delivery map</h2>
                <p className="mt-1 text-xs text-muted-foreground">The next approved Person B milestones</p>
              </div>
              <GitPullRequest className="size-5 text-primary" />
            </div>
            <ol className="mt-1 divide-y divide-border">
              {[
                ["B-102", "Session and workspace navigation", "Next"],
                ["B-103", "Dashboard components and operational overview", "Planned"],
                ["B-104", "Typed API and mock adapter boundary", "Planned"],
              ].map(([id, title, status], index) => (
                <li key={id} className="flex items-center gap-4 py-4">
                  <span className={index === 0 ? "step-index step-index-active" : "step-index"}>{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{title}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{id}</p>
                  </div>
                  <span className={index === 0 ? "text-xs text-primary" : "text-xs text-muted-foreground"}>{status}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="surface-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">System readiness</h2>
                <p className="mt-1 text-xs text-muted-foreground">Local frontend environment</p>
              </div>
              <span className="status-pill"><span className="size-1.5 rounded-full bg-success" /> Healthy</span>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ["Application shell", "Ready", "100%"],
                ["Responsive navigation", "Ready", "100%"],
                ["Design tokens", "Ready", "100%"],
                ["Data connections", "Awaiting B-104", "15%"],
              ].map(([label, state, width]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{label}</span>
                    <span className="text-muted-foreground">{state}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                    <div className="h-full rounded-full bg-primary" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-[8px] border border-border bg-background/55 p-3 text-xs text-muted-foreground">
              <Clock3 className="size-4 shrink-0 text-warning" />
              Functional navigation and live data arrive through separate approval-gated tasks.
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
