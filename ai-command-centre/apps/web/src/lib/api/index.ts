import type { ApiClient } from "./contracts";
import { HttpApiClient } from "./http-client";
import { MockApiClient } from "./mock-client";

export * from "./contracts";
export * from "./errors";

export type ApiAdapter = "mock" | "http";

export function createApiClient(adapter: ApiAdapter = process.env.NEXT_PUBLIC_API_ADAPTER === "http" ? "http" : "mock"): ApiClient {
  if (adapter === "http") {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is required when NEXT_PUBLIC_API_ADAPTER=http.");
    return new HttpApiClient(baseUrl.replace(/\/$/, ""));
  }
  return new MockApiClient();
}

export const apiClient = createApiClient();
