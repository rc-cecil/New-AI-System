import type { GitHubBranch, GitHubClient, GitHubConnection, GitHubFile, GitHubRepository, GitHubRequestOptions, PullRequestInput, PullRequestResult, PushRequest, PushResult, RepositoryRef } from "./types";
export * from "./types";

type TransportResponse<T> = { data: T; headers: Headers };
export interface GitHubTransport { request<T>(method: "GET" | "POST" | "PATCH", path: string, body?: unknown, options?: GitHubRequestOptions): Promise<TransportResponse<T>>; }

export class GitHubError extends Error {
  constructor(public readonly code: "unauthorized" | "forbidden" | "not_found" | "conflict" | "validation" | "rate_limited" | "network" | "aborted" | "unknown", message: string, public readonly status?: number) { super(message); this.name = "GitHubError"; }
}

const segment = (value: string, label: string) => { const clean = value.trim(); if (!clean || clean.includes("/") || clean.includes("..")) throw new GitHubError("validation", `Invalid ${label}.`); return encodeURIComponent(clean); };
const refSegment = (value: string) => { const clean=value.trim(); if(!clean || clean.includes("..") || clean.startsWith("/") || clean.endsWith("/")) throw new GitHubError("validation", "Invalid Git reference."); return encodeURIComponent(clean); };
const repoPath = ({ owner, repo }: RepositoryRef) => `/repos/${segment(owner, "repository owner")}/${segment(repo, "repository name")}`;
const filePath = (path: string) => path.split("/").filter(Boolean).map(item => segment(item, "file path")).join("/");

export class RestGitHubClient implements GitHubClient {
  constructor(private readonly transport: GitHubTransport) {}
  async getConnection(options?: GitHubRequestOptions): Promise<GitHubConnection> { const { data, headers } = await this.transport.request<{ login: string; avatar_url: string }>("GET", "/user", undefined, options); return { connected: true, login: data.login, avatarUrl: data.avatar_url, scopes: (headers.get("x-oauth-scopes") ?? "").split(",").map(v => v.trim()).filter(Boolean) }; }
  async listRepositories(options?: GitHubRequestOptions): Promise<GitHubRepository[]> { const { data } = await this.transport.request<Array<{ id:number; name:string; full_name:string; owner:{login:string}; private:boolean; default_branch:string; description:string|null; updated_at:string }>>("GET", "/user/repos?sort=updated&per_page=100", undefined, options); return data.map(r => ({ id:r.id, owner:r.owner.login, repo:r.name, fullName:r.full_name, private:r.private, defaultBranch:r.default_branch, description:r.description, updatedAt:r.updated_at })); }
  async listBranches(repository: RepositoryRef, options?: GitHubRequestOptions): Promise<GitHubBranch[]> { const { data } = await this.transport.request<Array<{ name:string; commit:{sha:string}; protected:boolean }>>("GET", `${repoPath(repository)}/branches?per_page=100`, undefined, options); return data.map(b => ({ name:b.name, sha:b.commit.sha, protected:b.protected })); }
  async getFile(repository: RepositoryRef, path: string, ref: string, options?: GitHubRequestOptions): Promise<GitHubFile> { const { data } = await this.transport.request<{ path:string; sha:string; size:number; encoding:string; content:string }>("GET", `${repoPath(repository)}/contents/${filePath(path)}?ref=${refSegment(ref)}`, undefined, options); if (data.encoding !== "base64") throw new GitHubError("unknown", "GitHub returned an unsupported file encoding."); return { path:data.path, sha:data.sha, size:data.size, encoding:"base64", content:data.content.replace(/\n/g, "") }; }
  async pushFiles(request: PushRequest): Promise<PushResult> {
    if (!request.files.length) throw new GitHubError("validation", "At least one changed file is required.");
    const base = repoPath(request); const branch = refSegment(request.branch);
    const ref = await this.transport.request<{ object:{sha:string} }>("GET", `${base}/git/ref/heads/${branch}`, undefined, { signal:request.signal });
    if (request.expectedHeadSha && request.expectedHeadSha !== ref.data.object.sha) throw new GitHubError("conflict", "The branch head changed before the push could be prepared.", 409);
    const commit = await this.transport.request<{ tree:{sha:string} }>("GET", `${base}/git/commits/${ref.data.object.sha}`, undefined, { signal:request.signal });
    const treeItems: Array<{ path:string; mode:"100644"|"100755"; type:"blob"; sha:string|null }> = [];
    for (const file of request.files) {
      const path = filePath(file.path);
      if (file.delete) treeItems.push({ path, mode:file.mode ?? "100644", type:"blob", sha:null });
      else { const blob = await this.transport.request<{ sha:string }>("POST", `${base}/git/blobs`, { content:file.content, encoding:"utf-8" }, { signal:request.signal }); treeItems.push({ path, mode:file.mode ?? "100644", type:"blob", sha:blob.data.sha }); }
    }
    const tree = await this.transport.request<{ sha:string }>("POST", `${base}/git/trees`, { base_tree:commit.data.tree.sha, tree:treeItems }, { signal:request.signal });
    const nextCommit = await this.transport.request<{ sha:string }>("POST", `${base}/git/commits`, { message:request.message, tree:tree.data.sha, parents:[ref.data.object.sha] }, { signal:request.signal });
    await this.transport.request("PATCH", `${base}/git/refs/heads/${branch}`, { sha:nextCommit.data.sha, force:false }, { signal:request.signal });
    return { branch:request.branch, commitSha:nextCommit.data.sha, previousHeadSha:ref.data.object.sha, changedFiles:request.files.length };
  }
  async createPullRequest(request: PullRequestInput): Promise<PullRequestResult> { const { data } = await this.transport.request<{ number:number; html_url:string; state:"open"|"closed"; title:string; head:{ref:string}; base:{ref:string} }>("POST", `${repoPath(request)}/pulls`, { title:request.title, body:request.body, head:request.head, base:request.base, draft:request.draft ?? false }, { signal:request.signal }); return { number:data.number, url:data.html_url, state:data.state, title:data.title, head:data.head.ref, base:data.base.ref }; }
}
