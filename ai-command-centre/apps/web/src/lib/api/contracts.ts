export type EntityId = string;
export type RequestOptions = { signal?: AbortSignal };

export type Workspace = { id: EntityId; name: string; plan: "free" | "pro" | "enterprise"; activeAgents: number; agentLimit: number };
export type Project = { id: EntityId; workspaceId: EntityId; name: string; repository: string | null; defaultBranch: string };
export type Agent = { id: EntityId; name: string; role: string; status: "online" | "busy" | "offline"; model: string; currentTask: string | null };
export type Integration = { id: EntityId; provider: "github" | "openai" | "anthropic" | "gemini" | "ollama"; status: "connected" | "disconnected" | "error"; displayName: string };
export type TaskStatus = "queued" | "running" | "review" | "waiting_approval" | "completed" | "failed" | "cancelled";
export type Task = { id: EntityId; projectId: EntityId; title: string; status: TaskStatus; priority: "low" | "medium" | "high"; progress: number; branch: string; assignedAgentIds: EntityId[]; costUsd: number; updatedAt: string };
export type DiffFile = { path: string; additions: number; deletions: number; status: "added" | "modified" | "deleted" };
export type Approval = { id: EntityId; taskId: EntityId; title: string; risk: "low" | "medium" | "high" | "critical"; status: "pending" | "approved" | "rejected"; requestedAt: string };
export type UsageSummary = { period: string; totalCostUsd: number; totalTokens: number; byProvider: Array<{ provider: string; tokens: number; costUsd: number }> };
export type AuditRecord = { id: EntityId; timestamp: string; actor: string; action: string; resource: string; outcome: "success" | "denied" | "failure" };
export type DashboardSummary = { activeAgents: number; runningTasks: number; pendingApprovals: number; apiCostTodayUsd: number; tasks: Task[]; agents: Agent[] };

export interface ApiClient {
  getWorkspaces(options?: RequestOptions): Promise<Workspace[]>;
  getProjects(workspaceId: EntityId, options?: RequestOptions): Promise<Project[]>;
  getAgents(workspaceId: EntityId, options?: RequestOptions): Promise<Agent[]>;
  getIntegrations(workspaceId: EntityId, options?: RequestOptions): Promise<Integration[]>;
  getTasks(projectId: EntityId, options?: RequestOptions): Promise<Task[]>;
  getTask(taskId: EntityId, options?: RequestOptions): Promise<Task>;
  getTaskDiff(taskId: EntityId, options?: RequestOptions): Promise<DiffFile[]>;
  getApprovals(workspaceId: EntityId, options?: RequestOptions): Promise<Approval[]>;
  getUsage(workspaceId: EntityId, options?: RequestOptions): Promise<UsageSummary>;
  getAudit(workspaceId: EntityId, options?: RequestOptions): Promise<AuditRecord[]>;
  getDashboard(workspaceId: EntityId, options?: RequestOptions): Promise<DashboardSummary>;
}
