import { GitHubError, type GitHubTransport } from "./core";
import type { GitHubRequestOptions } from "./types";

export class FetchGitHubTransport implements GitHubTransport {
  constructor(private readonly token: string, private readonly apiUrl = "https://api.github.com") { if (!token) throw new GitHubError("unauthorized", "A GitHub access token is required."); }
  async request<T>(method: "GET"|"POST"|"PATCH", path: string, body?: unknown, options?: GitHubRequestOptions) {
    try {
      const response = await fetch(`${this.apiUrl}${path}`, { method, signal:options?.signal, headers:{ Accept:"application/vnd.github+json", Authorization:`Bearer ${this.token}`, "X-GitHub-Api-Version":"2022-11-28", ...(body ? {"Content-Type":"application/json"}: {}) }, body:body ? JSON.stringify(body) : undefined });
      if (!response.ok) { const code = response.status===401?"unauthorized":response.status===403?(response.headers.get("x-ratelimit-remaining")==="0"?"rate_limited":"forbidden"):response.status===404?"not_found":response.status===409?"conflict":response.status===422?"validation":"unknown"; throw new GitHubError(code, `GitHub request failed with status ${response.status}.`, response.status); }
      return { data:await response.json() as T, headers:response.headers };
    } catch (error) { if (error instanceof GitHubError) throw error; if (error instanceof DOMException && error.name==="AbortError") throw new GitHubError("aborted", "The GitHub request was cancelled."); throw new GitHubError("network", "GitHub could not be reached."); }
  }
}
