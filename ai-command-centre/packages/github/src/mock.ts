import type { GitHubClient, GitHubConnection, GitHubRepository, PullRequestInput, PushRequest, RepositoryRef } from "./types";
import { GitHubError } from "./core";
const repositories: GitHubRepository[] = [{ id:1, owner:"acme", repo:"web-app", fullName:"acme/web-app", private:true, defaultBranch:"main", description:"Frontend React application", updatedAt:"2026-09-01T09:42:00.000Z" }];
export class MockGitHubClient implements GitHubClient {
  getConnection(): Promise<GitHubConnection> { return Promise.resolve({ connected:true, login:"acme-engineering", avatarUrl:null, scopes:["repo","workflow"] }); }
  listRepositories() { return Promise.resolve(structuredClone(repositories)); }
  listBranches(_repository:RepositoryRef) { return Promise.resolve([{name:"main",sha:"abc123",protected:true},{name:"feature/auth-flow",sha:"def456",protected:false}]); }
  getFile(_repository:RepositoryRef,path:string,_ref:string) { if(!path) return Promise.reject(new GitHubError("validation","A file path is required.")); return Promise.resolve({path,sha:"file123",size:12,encoding:"base64" as const,content:"aGVsbG8gd29ybGQ="}); }
  pushFiles(request:PushRequest) { return Promise.resolve({branch:request.branch,commitSha:"new789",previousHeadSha:request.expectedHeadSha ?? "def456",changedFiles:request.files.length}); }
  createPullRequest(request:PullRequestInput) { return Promise.resolve({number:128,url:"https://github.com/acme/web-app/pull/128",state:"open" as const,title:request.title,head:request.head,base:request.base}); }
}
