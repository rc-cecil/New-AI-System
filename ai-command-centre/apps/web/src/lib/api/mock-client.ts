import type { ApiClient, EntityId, RequestOptions } from "./contracts";
import { ApiError } from "./errors";
import { agents, approvals, audit, dashboard, diffFiles, integrations, projects, tasks, usage, workspaces } from "./fixtures";

const clone = <T>(value: T): T => structuredClone(value);
const respond = async <T>(value: T, options?: RequestOptions): Promise<T> => {
  if (options?.signal?.aborted) throw new ApiError("aborted", "The request was cancelled.");
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 80);
    options?.signal?.addEventListener("abort", () => { clearTimeout(timer); reject(new ApiError("aborted", "The request was cancelled.")); }, { once: true });
  });
  return clone(value);
};
const findOrThrow = <T>(value: T | undefined): T => { if (!value) throw new ApiError("not_found", "The requested resource was not found.", 404); return value; };

export class MockApiClient implements ApiClient {
  getWorkspaces(options?: RequestOptions) { return respond(workspaces, options); }
  getProjects(workspaceId: EntityId, options?: RequestOptions) { return respond(projects.filter(item => item.workspaceId === workspaceId), options); }
  getAgents(_workspaceId: EntityId, options?: RequestOptions) { return respond(agents, options); }
  getIntegrations(_workspaceId: EntityId, options?: RequestOptions) { return respond(integrations, options); }
  getTasks(projectId: EntityId, options?: RequestOptions) { return respond(tasks.filter(item => item.projectId === projectId), options); }
  getTask(taskId: EntityId, options?: RequestOptions) { return respond(findOrThrow(tasks.find(item => item.id === taskId)), options); }
  getTaskDiff(taskId: EntityId, options?: RequestOptions) { findOrThrow(tasks.find(item => item.id === taskId)); return respond(diffFiles, options); }
  getApprovals(_workspaceId: EntityId, options?: RequestOptions) { return respond(approvals, options); }
  getUsage(_workspaceId: EntityId, options?: RequestOptions) { return respond(usage, options); }
  getAudit(_workspaceId: EntityId, options?: RequestOptions) { return respond(audit, options); }
  getDashboard(_workspaceId: EntityId, options?: RequestOptions) { return respond(dashboard, options); }
}
