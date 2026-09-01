import { ArrowRight, Construction } from "lucide-react";

import { EmptyState } from "@/components/common/page-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";

export type SectionDefinition = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function SectionPage({ section }: { section: SectionDefinition }) {
  return (
    <div className="mx-auto max-w-[1480px]">
      <PageHeader
        eyebrow="Mock workspace data"
        title={section.title}
        description={section.description}
        actions={<Button disabled>Configure <ArrowRight className="size-4" /></Button>}
      />
      <div className="my-6 flex items-center gap-2 rounded-[8px] border border-warning/20 bg-warning/8 px-4 py-3 text-xs text-warning">
        <Construction className="size-4 shrink-0" />
        Navigation is live. Domain functionality is intentionally deferred to its approval-gated task.
      </div>
      <EmptyState title={section.emptyTitle} description={section.emptyDescription} />
    </div>
  );
}
