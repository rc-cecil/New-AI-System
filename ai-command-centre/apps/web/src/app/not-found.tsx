import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">Workspace view not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">The requested route is not part of the approved MVP surface.</p>
        <Button asChild className="mt-6"><Link href="/dashboard">Return to dashboard</Link></Button>
      </div>
    </main>
  );
}
