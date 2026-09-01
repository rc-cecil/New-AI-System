import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="surface-card flex min-h-64 flex-col items-center justify-center px-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
        <Inbox className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <Button className="mt-5" disabled>Available in the next approved task</Button>
    </section>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <section className="surface-card flex min-h-64 flex-col items-center justify-center px-6 text-center" role="alert">
      <span className="flex size-12 items-center justify-center rounded-xl bg-danger/12 text-danger">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-base font-semibold text-foreground">We could not load this workspace view</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        The mock service returned an unexpected result. No sensitive server details are shown.
      </p>
      <Button className="mt-5" variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" /> Try again
      </Button>
    </section>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading workspace view" role="status">
      <div className="h-4 w-28 rounded bg-surface-raised" />
      <div className="mt-4 h-9 w-80 max-w-full rounded bg-surface-raised" />
      <div className="mt-3 h-4 w-[34rem] max-w-full rounded bg-surface-raised" />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-52 rounded-[9px] border border-border bg-surface" />)}
      </div>
    </div>
  );
}
