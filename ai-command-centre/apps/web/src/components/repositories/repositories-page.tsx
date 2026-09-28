"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDot,
  CloudCog,
  Code2,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  useMemo,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";

type RepoStatus = "synced" | "syncing" | "stale" | "error";
type Repository = {
  id: string;
  name: string;
  description: string;
  branch: string;
  status: RepoStatus;
  provider: "GitHub" | "GitLab" | "Bitbucket";
  prs: number;
  passing: number;
  failing: number;
  owner: string;
  language: string;
  updated: string;
};

const initialRepositories: Repository[] = [
  {
    id: "web",
    name: "acme/web-app",
    description: "Frontend React application",
    branch: "main",
    status: "synced",
    provider: "GitHub",
    prs: 7,
    passing: 24,
    failing: 1,
    owner: "Alex Kim",
    language: "TypeScript",
    updated: "2m ago",
  },
  {
    id: "api",
    name: "acme/api-gateway",
    description: "API Gateway service",
    branch: "develop",
    status: "synced",
    provider: "GitHub",
    prs: 4,
    passing: 18,
    failing: 0,
    owner: "Priya Shah",
    language: "TypeScript",
    updated: "5m ago",
  },
  {
    id: "data",
    name: "acme/data-pipeline",
    description: "Data processing pipeline",
    branch: "main",
    status: "syncing",
    provider: "GitLab",
    prs: 2,
    passing: 12,
    failing: 0,
    owner: "Jordan Lee",
    language: "Python",
    updated: "1m ago",
  },
  {
    id: "mobile",
    name: "acme/mobile-app",
    description: "React Native mobile app",
    branch: "release/1.2.0",
    status: "synced",
    provider: "GitHub",
    prs: 1,
    passing: 16,
    failing: 0,
    owner: "Priya Shah",
    language: "TypeScript",
    updated: "14m ago",
  },
  {
    id: "infra",
    name: "acme/infrastructure",
    description: "Terraform infrastructure",
    branch: "main",
    status: "stale",
    provider: "GitHub",
    prs: 0,
    passing: 8,
    failing: 2,
    owner: "Alex Kim",
    language: "HCL",
    updated: "2h ago",
  },
  {
    id: "analytics",
    name: "acme/analytics-service",
    description: "Analytics microservice",
    branch: "develop",
    status: "error",
    provider: "Bitbucket",
    prs: 0,
    passing: 0,
    failing: 3,
    owner: "Taylor Nguyen",
    language: "Go",
    updated: "3h ago",
  },
];

const statusStyle: Record<RepoStatus, string> = {
  synced: "border-success/25 bg-success/10 text-success",
  syncing: "border-primary/25 bg-primary/10 text-primary",
  stale: "border-warning/25 bg-warning/10 text-warning",
  error: "border-danger/25 bg-danger/10 text-danger",
};

function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [style, setStyle] = useState<CSSProperties>({});
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      "--tilt-x": `${(-y * 4).toFixed(2)}deg`,
      "--tilt-y": `${(x * 5).toFixed(2)}deg`,
      "--glow-x": `${((x + 0.5) * 100).toFixed(0)}%`,
      "--glow-y": `${((y + 0.5) * 100).toFixed(0)}%`,
    } as CSSProperties);
  };
  return (
    <div
      className={`repo-tilt ${className}`}
      style={style}
      onPointerMove={move}
      onPointerLeave={() => setStyle({})}
    >
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: RepoStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold capitalize ${statusStyle[status]}`}
    >
      {status === "syncing" ? (
        <LoaderCircle className="size-3 animate-spin" />
      ) : status === "error" ? (
        <XCircle className="size-3" />
      ) : (
        <span className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
      )}
      {status}
    </span>
  );
}

function HealthOrb({ repositories }: { repositories: Repository[] }) {
  const healthy = repositories.filter(
    (repo) => repo.status === "synced",
  ).length;
  return (
    <div
      className="health-orb-scene"
      aria-label={`${healthy} of ${repositories.length} repositories healthy`}
      role="img"
    >
      <div className="health-orb">
        <div className="health-orb-core">
          <b>
            {healthy}/{repositories.length}
          </b>
          <span>healthy</span>
        </div>
      </div>
      <span className="health-orb-shadow" />
    </div>
  );
}

export function RepositoriesPage() {
  const [repositories, setRepositories] = useState(initialRepositories);
  const [selectedId, setSelectedId] = useState("web");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "syncing" | "attention">("all");
  const selected =
    repositories.find((repo) => repo.id === selectedId) ?? repositories[0];
  const filtered = useMemo(
    () =>
      repositories.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query.toLowerCase()) &&
          (filter === "all" ||
            (filter === "syncing"
              ? repo.status === "syncing"
              : repo.status === "stale" || repo.status === "error")),
      ),
    [repositories, query, filter],
  );
  const syncSelected = () => {
    setRepositories((current) =>
      current.map((repo) =>
        repo.id === selected.id ? { ...repo, status: "syncing" } : repo,
      ),
    );
    window.setTimeout(
      () =>
        setRepositories((current) =>
          current.map((repo) =>
            repo.id === selected.id
              ? { ...repo, status: "synced", updated: "just now", failing: 0 }
              : repo,
          ),
        ),
      900,
    );
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <PageHeader
        eyebrow="Source control intelligence"
        title="Repositories"
        description="Monitor repository health, branches, checks, pull requests, and synchronization from one operational view."
        actions={
          <>
            <Button variant="outline">
              <CloudCog className="size-4" /> Connect GitHub
            </Button>
            <Button>
              <GitBranch className="size-4" /> Import repository
            </Button>
          </>
        }
      />

      <section
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Repository health summary"
      >
        {[
          [
            "Connected",
            "6",
            "All provider links active",
            Code2,
            "text-primary bg-primary/12",
          ],
          [
            "Healthy",
            "4",
            "67% passing cleanly",
            ShieldCheck,
            "text-success bg-success/12",
          ],
          [
            "Open PRs",
            "14",
            "3 awaiting review",
            GitPullRequest,
            "text-purple bg-purple/12",
          ],
          [
            "Needs attention",
            "2",
            "Stale or failed sync",
            AlertTriangle,
            "text-warning bg-warning/12",
          ],
        ].map(([label, value, detail, Icon, tone]) => (
          <TiltCard key={String(label)} className="surface-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground">
                  {label as string}
                </p>
                <p className="mt-2 text-2xl font-semibold">{value as string}</p>
                <p className="mt-1 text-[10px] text-subtle-foreground">
                  {detail as string}
                </p>
              </div>
              <span
                className={`flex size-10 items-center justify-center rounded-xl ${tone as string}`}
              >
                <Icon className="size-5" />
              </span>
            </div>
          </TiltCard>
        ))}
      </section>

      <div className="grid min-h-[620px] gap-4 2xl:grid-cols-[minmax(720px,1fr)_390px]">
        <section className="surface-card p-0">
          <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex gap-1 rounded-lg border border-border bg-background/50 p-1"
              role="group"
              aria-label="Repository filters"
            >
              {[
                ["all", "All repositories"],
                ["syncing", "Syncing"],
                ["attention", "Needs attention"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id as typeof filter)}
                  aria-pressed={filter === id}
                  className={`rounded-md px-3 py-2 text-[11px] transition-colors ${filter === id ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-surface-raised"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background/55 px-3 focus-within:border-primary">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search repositories"
                placeholder="Search repositories..."
                className="w-full bg-transparent text-xs outline-none lg:w-56"
              />
            </label>
          </div>
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-border bg-background/35 text-[10px] uppercase tracking-wider text-subtle-foreground">
                    <th className="px-4 py-3 font-medium">Repository</th>
                    <th className="px-3 py-3 font-medium">Branch</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Pull requests</th>
                    <th className="px-3 py-3 font-medium">Checks</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((repo) => (
                    <tr
                      key={repo.id}
                      className={`border-b border-border/70 transition-colors last:border-0 hover:bg-primary/5 ${selected.id === repo.id ? "bg-primary/8" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedId(repo.id)}
                          aria-label={`View ${repo.name}`}
                          className="flex w-full items-center gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <span
                            className={`flex size-9 items-center justify-center rounded-lg ${selected.id === repo.id ? "bg-primary text-white" : "bg-surface-raised text-muted-foreground"}`}
                          >
                            <Code2 className="size-4" />
                          </span>
                          <div>
                            <p className="text-xs font-semibold">{repo.name}</p>
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {repo.description}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="px-3 font-mono text-[10px] text-primary">
                        <GitBranch className="mr-1 inline size-3" />
                        {repo.branch}
                      </td>
                      <td className="px-3">
                        <StatusBadge status={repo.status} />
                      </td>
                      <td className="px-3 text-xs">{repo.prs}</td>
                      <td className="px-3">
                        <span className="text-[11px] text-success">
                          <Check className="mr-1 inline size-3" />
                          {repo.passing}
                        </span>
                        <span className="ml-2 text-[11px] text-danger">
                          <XCircle className="mr-1 inline size-3" />
                          {repo.failing}
                        </span>
                      </td>
                      <td className="px-4 text-right text-[10px] text-muted-foreground">
                        {repo.updated}
                        <ChevronRight className="ml-2 inline size-3" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
              <Search className="size-9 text-subtle-foreground" />
              <h2 className="mt-4 text-sm font-semibold">
                No repositories match
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Clear the search or choose a different health filter.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <TiltCard className="surface-card border-primary/30 bg-[linear-gradient(145deg,rgb(14_52_88_/_72%),rgb(8_22_34_/_96%))]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[.16em] text-primary">
                  Selected repository
                </p>
                <h2 className="mt-2 text-lg font-semibold">{selected.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selected.description}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="mt-5 flex items-center justify-center">
              <HealthOrb repositories={repositories} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                ["Branch", selected.branch],
                ["Language", selected.language],
                ["Provider", selected.provider],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/8 bg-black/15 p-2.5"
                >
                  <p className="text-[9px] text-muted-foreground">{label}</p>
                  <p className="mt-1 truncate text-[11px] font-medium">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              onClick={syncSelected}
              disabled={selected.status === "syncing"}
            >
              {selected.status === "syncing" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Synchronizing
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" />
                  Sync repository
                </>
              )}
            </Button>
          </TiltCard>

          <section className="surface-card">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent activity</h2>
              <span className="text-[10px] text-success">Live</span>
            </div>
            <div className="mt-4 space-y-4">
              {[
                ["feat: add auth dashboard", "a1b2c3d", "Alex Kim", "2m"],
                ["fix: resolve login redirect", "d4e5f6a", "Jamie Lee", "15m"],
                ["chore: update dependencies", "b7c8d9e", "Riley Chen", "1h"],
              ].map(([message, sha, author, time], index) => (
                <div key={sha} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="flex size-7 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                      <GitCommitHorizontal className="size-3.5" />
                    </span>
                    {index < 2 && (
                      <span className="mt-1 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-2">
                    <p className="truncate text-xs font-medium">{message}</p>
                    <p className="mt-1 font-mono text-[9px] text-primary">
                      {sha}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {author} · {time} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">CI/CD activity</h2>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Last 24 hours
              </p>
            </div>
            <Sparkles className="size-5 text-primary" />
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              ["Runs", "86", "+12%", true],
              ["Success", "87%", "+5%", true],
              ["Failed", "11", "-3%", false],
              ["Avg. duration", "6m 12s", "-8%", true],
            ].map(([label, value, delta, positive]) => (
              <div
                key={String(label)}
                className="rounded-lg border border-border bg-background/40 p-3"
              >
                <p className="text-[9px] text-muted-foreground">
                  {label as string}
                </p>
                <p className="mt-2 text-lg font-semibold">{value as string}</p>
                <p
                  className={`mt-1 flex items-center text-[9px] ${positive ? "text-success" : "text-danger"}`}
                >
                  {positive ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {delta as string}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-20 items-end gap-1">
            {[34, 48, 43, 62, 54, 72, 66, 81, 64, 77, 86, 91, 83, 96].map(
              (height, index) => (
                <span
                  key={index}
                  className="chart-bar flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 35}ms`,
                  }}
                />
              ),
            )}
          </div>
        </div>
        <div className="surface-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Agent permissions</h2>
            <LockKeyhole className="size-5 text-warning" />
          </div>
          <div className="mt-4 space-y-2">
            {[
              ["Read repository", true],
              ["Write commits", true],
              ["Create branches", true],
              ["Create pull requests", true],
              ["Merge pull requests", false],
            ].map(([label, allowed]) => (
              <div
                key={String(label)}
                className="flex items-center justify-between rounded-lg border border-border bg-background/35 px-3 py-2.5 text-xs"
              >
                <span>{label as string}</span>
                <span className={allowed ? "text-success" : "text-warning"}>
                  {allowed ? (
                    <>
                      <Check className="mr-1 inline size-3" />
                      Allowed
                    </>
                  ) : (
                    <>
                      <CircleDot className="mr-1 inline size-3" />
                      Requires approval
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
