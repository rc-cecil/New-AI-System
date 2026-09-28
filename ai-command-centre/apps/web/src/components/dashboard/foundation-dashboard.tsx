import { ArrowRight, Bot, CheckCircle2, CircleDollarSign, Clock3, GitBranch, ListChecks, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { InteractiveCostChart } from "./interactive-cost-chart";

type Tone = "blue" | "green" | "amber" | "purple" | "red" | "slate";
const toneStyles: Record<Tone, string> = { blue: "bg-primary/15 text-primary border-primary/25", green: "bg-success/15 text-success border-success/25", amber: "bg-warning/15 text-warning border-warning/25", purple: "bg-purple/15 text-purple border-purple/25", red: "bg-danger/15 text-danger border-danger/25", slate: "bg-white/5 text-muted-foreground border-border" };

export function StatusBadge({ label, tone = "slate" }: { label: string; tone?: Tone }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold ${toneStyles[tone]}`}>{label}</span>;
}

export function ProgressBar({ value, tone = "blue", label }: { value: number; tone?: Tone; label?: string }) {
  const fill = tone === "green" ? "bg-success" : tone === "amber" ? "bg-warning" : "bg-primary";
  return <div className="flex min-w-[110px] items-center gap-2" aria-label={label ?? `${value}% complete`}><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background"><div className={`h-full rounded-full ${fill}`} style={{ width: `${value}%` }} /></div><span className="w-8 text-right text-[11px] text-muted-foreground">{value}%</span></div>;
}

function KpiCard({ icon: Icon, label, value, change, tone, points, hero = false }: { icon: LucideIcon; label: string; value: string; change: string; tone: Tone; points: number[]; hero?: boolean }) {
  return <article className={`surface-card flex min-h-28 items-center gap-4 p-4 ${hero ? "border-primary/30 bg-[linear-gradient(135deg,rgb(18_88_161_/_45%),rgb(11_24_37_/_96%)_72%)] shadow-[0_18px_46px_rgb(0_92_200_/_13%)]" : ""}`}><span className={`flex size-12 shrink-0 items-center justify-center rounded-full border ${hero ? "border-white/15 bg-white/10 text-white" : toneStyles[tone]}`}><Icon className="size-5" /></span><div className="min-w-0 flex-1"><p className={hero ? "text-xs text-white/65" : "text-xs text-muted-foreground"}>{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-[11px] text-success">{change}</p></div><svg className="h-12 w-20 overflow-visible" viewBox="0 0 80 48" role="img" aria-label={`${label} trend`}><polyline points={points.map((point, index) => `${index * (80 / (points.length - 1))},${48 - point}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="2" className={hero ? "text-cyan-300" : toneStyles[tone].split(" ")[1]} /></svg></article>;
}

function Panel({ title, action, children, className = "" }: { title: string; action?: string; children: React.ReactNode; className?: string }) {
  return <section className={`surface-card min-w-0 ${className}`}><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">{title}</h2>{action && <button className="text-xs text-primary">{action} <ArrowRight className="ml-1 inline size-3" /></button>}</div>{children}</section>;
}

const tasks = [
  ["Implement auth flow", "OAuth + session management", "In Progress", "blue", "High", "feature/auth-flow", 65, "18m"],
  ["Refactor data layer", "Improve queries and caching", "In Progress", "blue", "Medium", "feature/data-refactor", 40, "32m"],
  ["Add dashboard charts", "Analytics overview widgets", "Review", "purple", "Medium", "feature/dashboard", 80, "12m"],
  ["Fix API rate limit bug", "Handle 429 + retry logic", "Testing", "amber", "High", "fix/rate-limit-bug", 25, "25m"],
  ["Update dependencies", "Bump packages and fix issues", "Queued", "slate", "Low", "chore/deps-update", 0, "—"],
] as const;
const agents = [["Architect Agent", "Designing scalable auth architecture", "Online", "blue"], ["Frontend Agent", "Building login components", "Online", "green"], ["Backend Agent", "Implementing auth endpoints", "Online", "green"], ["Tester Agent", "Running integration tests", "Busy", "amber"], ["Reviewer Agent", "Reviewing PR #128", "Online", "purple"]] as const;

export function FoundationDashboard() {
  return <div className="mx-auto max-w-[1560px] space-y-4">
    <header><div className="flex items-center gap-2 text-xs font-medium text-primary"><Sparkles className="size-4" /> Operational overview</div><h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">Orchestrate AI engineering teams, automate workflows, and ship better software.</p></header>
    <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4" aria-label="Workspace key performance indicators">
      <KpiCard hero icon={Bot} label="Active Agents" value="12" change="↑ 2 from yesterday" tone="blue" points={[9,18,13,27,17,34,25,31,42]} /><KpiCard icon={ListChecks} label="Running Tasks" value="18" change="↑ 4 from yesterday" tone="green" points={[8,15,11,20,18,29,24,37,44]} /><KpiCard icon={ShieldCheck} label="Pending Approvals" value="6" change="↓ 1 from yesterday" tone="amber" points={[8,17,10,23,14,28,20,31,39]} /><KpiCard icon={CircleDollarSign} label="API Cost Today" value="$42.87" change="↓ 8% from yesterday" tone="purple" points={[25,18,22,15,29,24,35,30,41]} />
    </section>
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Panel title="Active Tasks" action="View all tasks" className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-subtle-foreground"><th className="pb-3 font-medium">Task</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Priority</th><th className="pb-3 font-medium">Branch</th><th className="pb-3 font-medium">Progress</th><th className="pb-3 text-right font-medium">ETA</th></tr></thead><tbody>{tasks.map(([title, detail, status, tone, priority, branch, progress, eta]) => <tr key={title} className="border-b border-border/70 last:border-0"><td className="py-3 pr-4"><p className="text-xs font-semibold">{title}</p><p className="mt-1 text-[10px] text-muted-foreground">{detail}</p></td><td><StatusBadge label={status} tone={tone} /></td><td><span className={priority === "High" ? "text-danger" : priority === "Low" ? "text-success" : "text-warning"}>{priority}</span></td><td className="font-mono text-[10px] text-muted-foreground"><GitBranch className="mr-1 inline size-3" />{branch}</td><td><ProgressBar value={progress} /></td><td className="text-right text-xs text-muted-foreground">{eta}</td></tr>)}</tbody></table></div></Panel>
      <Panel title="Live Agent Activity" action="View all agents"><div className="divide-y divide-border">{agents.map(([name, task, state, tone], index) => <div key={name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${toneStyles[tone]}`}><Bot className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-xs font-semibold">{name}</p><span className={state === "Busy" ? "text-[10px] text-warning" : "text-[10px] text-success"}>● {state}</span></div><p className="mt-1 truncate text-[11px] text-muted-foreground">{task}</p></div><span className="text-[10px] text-subtle-foreground">{index + 1}m ago</span></div>)}</div></Panel>
    </div>
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-[0.9fr_1fr_0.9fr]">
      <Panel title="Workflow Overview"><div className="rounded-lg border border-border bg-background/55 p-4"><div className="mx-auto flex w-fit items-center gap-2 rounded-lg border border-purple/40 bg-purple/10 px-4 py-2 text-xs text-purple"><Workflow className="size-4" /> Orchestrator</div><div className="mx-auto h-6 w-px border-l border-dashed border-border-strong" /><div className="grid grid-cols-3 gap-2">{["Architect", "Frontend", "Backend"].map(name => <div key={name} className="rounded-md border border-border bg-surface p-2 text-center text-[10px]">{name}</div>)}</div><div className="mx-auto h-6 w-px border-l border-dashed border-border-strong" /><div className="mx-auto flex w-fit items-center gap-2 rounded-lg border border-success/40 bg-success/10 px-4 py-2 text-xs text-success"><CheckCircle2 className="size-4" /> Merge & Deploy</div></div></Panel>
      <Panel title="Pending Approvals" action="View all"><div className="space-y-2">{[["Merge PR #128","High impact","Review"],["Run Database Migration","High impact","Approve"],["Deploy Preview","Medium impact","Approve"],["Grant Secrets Access","High impact","Review"]].map(([title, impact, action]) => <div key={title} className="flex items-center gap-3 rounded-lg border border-border bg-background/35 p-3"><ShieldCheck className="size-4 shrink-0 text-purple" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{title}</p><p className="mt-1 text-[10px] text-muted-foreground">{impact}</p></div><button className="rounded-md border border-border px-2.5 py-1.5 text-[10px] hover:bg-surface-raised">{action}</button></div>)}</div></Panel>
      <Panel title="Usage & Cost (Today)" action="View report"><InteractiveCostChart /></Panel>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface/70 px-4 py-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><Clock3 className="size-4 text-success" /> Mock operational data is ready for the B-104 API adapter.</span><Link href="/tasks" className="text-primary">Open task centre <ArrowRight className="ml-1 inline size-3" /></Link></div>
  </div>;
}
