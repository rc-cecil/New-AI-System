export type ApiErrorCode = "aborted" | "network" | "not_found" | "unauthorized" | "forbidden" | "validation" | "server" | "unknown";

export class ApiError extends Error {
  constructor(public readonly code: ApiErrorCode, message: string, public readonly status?: number, public readonly details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof DOMException && error.name === "AbortError") return new ApiError("aborted", "The request was cancelled.");
  if (error instanceof TypeError) return new ApiError("network", "The service could not be reached.");
  return new ApiError("unknown", error instanceof Error ? error.message : "An unexpected error occurred.");
}

export function errorFromResponse(status: number, details?: unknown): ApiError {
  if (status === 401) return new ApiError("unauthorized", "Your session is no longer valid.", status, details);
  if (status === 403) return new ApiError("forbidden", "You do not have permission to perform this action.", status, details);
  if (status === 404) return new ApiError("not_found", "The requested resource was not found.", status, details);
  if (status === 400 || status === 422) return new ApiError("validation", "The request contains invalid data.", status, details);
  if (status >= 500) return new ApiError("server", "The service encountered an error.", status, details);
  return new ApiError("unknown", "The request could not be completed.", status, details);
}
