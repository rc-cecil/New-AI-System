import { ArrowRight, Braces, Construction, Layers3, ShieldCheck } from "lucide-react";

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
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        {[
          { icon: Layers3, title: "Workspace context", copy: "Navigation and responsive layout are connected to the selected workspace.", tone: "text-primary bg-primary/12" },
          { icon: Braces, title: "Typed data boundary", copy: "Mock and HTTP adapters share one validated contract for this surface.", tone: "text-purple bg-purple/12" },
          { icon: ShieldCheck, title: "Approval aware", copy: "Consequential actions remain unavailable until their gated milestone.", tone: "text-success bg-success/12" },
        ].map((item) => <article className="surface-card group" key={item.title}><span className={`flex size-10 items-center justify-center rounded-xl ${item.tone}`}><item.icon className="size-5 transition-transform duration-300 group-hover:scale-110" /></span><h2 className="mt-4 text-sm font-semibold">{item.title}</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.copy}</p></article>)}
      </div>
      <EmptyState title={section.emptyTitle} description={section.emptyDescription} />
    </div>
  );
}
