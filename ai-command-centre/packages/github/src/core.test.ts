import { describe, expect, it, vi } from "vitest";
import { GitHubError, RestGitHubClient, type GitHubTransport } from "./core";

const response = <T>(data:T) => ({ data, headers:new Headers() });

describe("GitHub wrapper", () => {
  it("normalizes repositories and branches", async () => {
    const request = vi.fn().mockResolvedValueOnce(response([{id:1,name:"web-app",full_name:"acme/web-app",owner:{login:"acme"},private:true,default_branch:"main",description:null,updated_at:"2026-09-01T00:00:00Z"}])).mockResolvedValueOnce(response([{name:"main",commit:{sha:"abc"},protected:true}]));
    const client = new RestGitHubClient({ request } as GitHubTransport);
    expect(await client.listRepositories()).toEqual([expect.objectContaining({fullName:"acme/web-app",defaultBranch:"main"})]);
    expect(await client.listBranches({owner:"acme",repo:"web-app"})).toEqual([{name:"main",sha:"abc",protected:true}]);
  });

  it("builds a non-forced commit update and checks the expected head", async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(response({object:{sha:"head1"}}))
      .mockResolvedValueOnce(response({tree:{sha:"tree1"}}))
      .mockResolvedValueOnce(response({sha:"blob1"}))
      .mockResolvedValueOnce(response({sha:"tree2"}))
      .mockResolvedValueOnce(response({sha:"commit2"}))
      .mockResolvedValueOnce(response({}));
    const client = new RestGitHubClient({request} as GitHubTransport);
    await expect(client.pushFiles({owner:"acme",repo:"web-app",branch:"feature/auth",message:"feat: auth",expectedHeadSha:"head1",files:[{path:"src/auth.ts",content:"export {};"}]})).resolves.toEqual({branch:"feature/auth",commitSha:"commit2",previousHeadSha:"head1",changedFiles:1});
    expect(request).toHaveBeenLastCalledWith("PATCH","/repos/acme/web-app/git/refs/heads/feature%2Fauth",{sha:"commit2",force:false},{signal:undefined});
  });

  it("rejects stale branch metadata before creating blobs", async () => {
    const request = vi.fn().mockResolvedValueOnce(response({object:{sha:"new-head"}}));
    const client = new RestGitHubClient({request} as GitHubTransport);
    await expect(client.pushFiles({owner:"acme",repo:"web-app",branch:"feature/auth",message:"feat",expectedHeadSha:"old-head",files:[{path:"src/a.ts",content:"x"}]})).rejects.toMatchObject({code:"conflict"});
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("rejects unsafe repository segments and empty changes", async () => {
    const client = new RestGitHubClient({request:vi.fn()} as unknown as GitHubTransport);
    await expect(client.listBranches({owner:"../secrets",repo:"web-app"})).rejects.toBeInstanceOf(GitHubError);
    await expect(client.pushFiles({owner:"acme",repo:"web-app",branch:"main",message:"empty",files:[]})).rejects.toMatchObject({code:"validation"});
  });
});
