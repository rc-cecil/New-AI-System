export type GitHubRequestOptions = { signal?: AbortSignal };
export type RepositoryRef = { owner: string; repo: string };
export type GitHubConnection = { connected: boolean; login: string | null; avatarUrl: string | null; scopes: string[] };
export type GitHubRepository = RepositoryRef & { id: number; fullName: string; private: boolean; defaultBranch: string; description: string | null; updatedAt: string };
export type GitHubBranch = { name: string; sha: string; protected: boolean };
export type GitHubFile = { path: string; sha: string; size: number; encoding: "base64"; content: string };
export type PushFile = { path: string; content: string; mode?: "100644" | "100755"; delete?: boolean };
export type PushRequest = RepositoryRef & { branch: string; message: string; files: PushFile[]; expectedHeadSha?: string; signal?: AbortSignal };
export type PushResult = { branch: string; commitSha: string; previousHeadSha: string; changedFiles: number };
export type PullRequestInput = RepositoryRef & { title: string; body: string; head: string; base: string; draft?: boolean; signal?: AbortSignal };
export type PullRequestResult = { number: number; url: string; state: "open" | "closed"; title: string; head: string; base: string };

export interface GitHubClient {
  getConnection(options?: GitHubRequestOptions): Promise<GitHubConnection>;
  listRepositories(options?: GitHubRequestOptions): Promise<GitHubRepository[]>;
  listBranches(repository: RepositoryRef, options?: GitHubRequestOptions): Promise<GitHubBranch[]>;
  getFile(repository: RepositoryRef, path: string, ref: string, options?: GitHubRequestOptions): Promise<GitHubFile>;
  pushFiles(request: PushRequest): Promise<PushResult>;
  createPullRequest(request: PullRequestInput): Promise<PullRequestResult>;
}
