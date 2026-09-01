"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/common/page-states";

export default function WorkspaceError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Workspace route error", error.digest ?? error.message);
  }, [error]);

  return <ErrorState onRetry={reset} />;
}
