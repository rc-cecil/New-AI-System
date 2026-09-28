import type { Agent, Approval, AuditRecord, DashboardSummary, DiffFile, Integration, Project, Task, UsageSummary, Workspace } from "./contracts";

export const workspaces: Workspace[] = [{ id: "ws_acme", name: "Acme Engineering", plan: "pro", activeAgents: 42, agentLimit: 100 }];
export const projects: Project[] = [{ id: "project_web", workspaceId: "ws_acme", name: "acme/web-app", repository: "github.com/acme/web-app", defaultBranch: "main" }];
export const agents: Agent[] = [
  { id: "agent_architect", name: "Architect Agent", role: "System design", status: "online", model: "Claude 3.5", currentTask: "Designing scalable auth architecture" },
  { id: "agent_frontend", name: "Frontend Agent", role: "UI engineering", status: "online", model: "GPT-4o", currentTask: "Building login components" },
  { id: "agent_backend", name: "Backend Agent", role: "API engineering", status: "busy", model: "Claude 3.5", currentTask: "Implementing auth endpoints" },
];
export const tasks: Task[] = [{ id: "task_auth", projectId: "project_web", title: "Implement auth flow", status: "running", priority: "high", progress: 65, branch: "feature/auth-flow", assignedAgentIds: ["agent_architect", "agent_frontend", "agent_backend"], costUsd: 1.87, updatedAt: "2026-09-01T09:42:00.000Z" }];
export const integrations: Integration[] = [{ id: "int_github", provider: "github", status: "connected", displayName: "acme/web-app" }, { id: "int_openai", provider: "openai", status: "connected", displayName: "OpenAI" }];
export const approvals: Approval[] = [{ id: "approval_pr128", taskId: "task_auth", title: "Merge PR #128", risk: "high", status: "pending", requestedAt: "2026-09-01T09:40:00.000Z" }];
export const diffFiles: DiffFile[] = [{ path: "src/middleware/auth.ts", additions: 142, deletions: 3, status: "added" }];
export const usage: UsageSummary = { period: "2026-09-01", totalCostUsd: 42.87, totalTokens: 128_600_000, byProvider: [{ provider: "OpenAI", tokens: 56_200_000, costUsd: 23.57 }, { provider: "Anthropic", tokens: 32_100_000, costUsd: 9.86 }] };
export const audit: AuditRecord[] = [{ id: "audit_1", timestamp: "2026-09-01T09:42:00.000Z", actor: "Frontend Agent", action: "task.updated", resource: "task_auth", outcome: "success" }];
export const dashboard: DashboardSummary = { activeAgents: 12, runningTasks: 18, pendingApprovals: 6, apiCostTodayUsd: 42.87, tasks, agents };
