import type { ApiClient, AuditRecord, DashboardSummary, DiffFile, EntityId, Integration, Project, RequestOptions, Task, UsageSummary, Workspace, Agent, Approval } from "./contracts";
import { errorFromResponse, normalizeApiError } from "./errors";

export class HttpApiClient implements ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async get<T>(path: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, { headers: { Accept: "application/json" }, signal: options?.signal, credentials: "include" });
      if (!response.ok) {
        const details = await response.json().catch(() => undefined);
        throw errorFromResponse(response.status, details);
      }
      return await response.json() as T;
    } catch (error) { throw normalizeApiError(error); }
  }

  getWorkspaces(options?: RequestOptions) { return this.get<Workspace[]>("/workspaces", options); }
  getProjects(workspaceId: EntityId, options?: RequestOptions) { return this.get<Project[]>(`/workspaces/${encodeURIComponent(workspaceId)}/projects`, options); }
  getAgents(workspaceId: EntityId, options?: RequestOptions) { return this.get<Agent[]>(`/workspaces/${encodeURIComponent(workspaceId)}/agents`, options); }
  getIntegrations(workspaceId: EntityId, options?: RequestOptions) { return this.get<Integration[]>(`/workspaces/${encodeURIComponent(workspaceId)}/integrations`, options); }
  getTasks(projectId: EntityId, options?: RequestOptions) { return this.get<Task[]>(`/projects/${encodeURIComponent(projectId)}/tasks`, options); }
  getTask(taskId: EntityId, options?: RequestOptions) { return this.get<Task>(`/tasks/${encodeURIComponent(taskId)}`, options); }
  getTaskDiff(taskId: EntityId, options?: RequestOptions) { return this.get<DiffFile[]>(`/tasks/${encodeURIComponent(taskId)}/diff`, options); }
  getApprovals(workspaceId: EntityId, options?: RequestOptions) { return this.get<Approval[]>(`/workspaces/${encodeURIComponent(workspaceId)}/approvals`, options); }
  getUsage(workspaceId: EntityId, options?: RequestOptions) { return this.get<UsageSummary>(`/workspaces/${encodeURIComponent(workspaceId)}/usage`, options); }
  getAudit(workspaceId: EntityId, options?: RequestOptions) { return this.get<AuditRecord[]>(`/workspaces/${encodeURIComponent(workspaceId)}/audit`, options); }
  getDashboard(workspaceId: EntityId, options?: RequestOptions) { return this.get<DashboardSummary>(`/workspaces/${encodeURIComponent(workspaceId)}/dashboard`, options); }
}
