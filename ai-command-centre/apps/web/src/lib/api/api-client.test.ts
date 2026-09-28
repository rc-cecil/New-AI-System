import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "./index";
import { normalizeApiError } from "./errors";
import { HttpApiClient } from "./http-client";

afterEach(() => vi.unstubAllGlobals());

describe("API client boundary", () => {
  it("returns isolated typed mock fixtures", async () => {
    const client = createApiClient("mock");
    const first = await client.getDashboard("ws_acme");
    first.tasks[0].title = "mutated";
    const second = await client.getDashboard("ws_acme");
    expect(second.tasks[0].title).toBe("Implement auth flow");
  });

  it("supports request cancellation", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(createApiClient("mock").getWorkspaces({ signal: controller.signal })).rejects.toMatchObject({ code: "aborted" });
  });

  it("normalizes HTTP errors without leaking response content", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ internal: "redacted" }), { status: 403, headers: { "Content-Type": "application/json" } })));
    await expect(new HttpApiClient("https://api.example.test").getTask("task_auth")).rejects.toMatchObject({ code: "forbidden", status: 403 });
  });

  it("normalizes aborted platform errors", () => {
    expect(normalizeApiError(new DOMException("aborted", "AbortError"))).toMatchObject({ code: "aborted" });
  });
});
