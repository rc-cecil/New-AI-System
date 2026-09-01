import { notFound } from "next/navigation";

import { FoundationDashboard } from "@/components/dashboard/foundation-dashboard";
import { SectionPage, type SectionDefinition } from "@/components/navigation/section-page";

const sections = {
  workspaces: {
    title: "Workspaces",
    description: "Organize teams, projects, agents, and integrations in one secure command centre.",
    emptyTitle: "No additional workspaces yet",
    emptyDescription: "Acme Engineering is selected. Workspace creation and member management arrive in their dedicated product tasks.",
  },
  projects: {
    title: "Projects",
    description: "Connect repositories and coordinate agent work around clear project boundaries.",
    emptyTitle: "No additional projects yet",
    emptyDescription: "The selected acme/web-app project is available in the top context bar. Project creation will be connected to the typed API later.",
  },
  agents: {
    title: "Agents",
    description: "Build and supervise specialized AI agents with explicit tools and permissions.",
    emptyTitle: "Agent management is not configured",
    emptyDescription: "Agent cards and the Agent Builder are delivered in B-301 after the shared agent contract is available.",
  },
  tasks: {
    title: "Tasks",
    description: "Create, monitor, and review AI-powered work across connected projects.",
    emptyTitle: "No task data connected",
    emptyDescription: "Task composition arrives in B-302 and will consume the mock-compatible API boundary from B-104.",
  },
  repositories: {
    title: "Repositories",
    description: "Inspect repository connections, branches, sync health, and recent activity.",
    emptyTitle: "Repository details are not connected",
    emptyDescription: "The repository surface is implemented in B-203 after the GitHub wrapper contract lands.",
  },
  approvals: {
    title: "Approvals",
    description: "Review consequential agent actions with clear context and human control.",
    emptyTitle: "No approval requests",
    emptyDescription: "The queue is empty in the mock session. Full decision workflows arrive in B-503.",
  },
  integrations: {
    title: "Integrations",
    description: "Connect GitHub and AI providers without exposing raw credentials to the browser.",
    emptyTitle: "No integration controls configured",
    emptyDescription: "Provider and GitHub connection experiences are implemented in B-202.",
  },
  usage: {
    title: "Usage",
    description: "Understand token consumption and estimated cost by provider, agent, task, and workspace.",
    emptyTitle: "No usage records yet",
    emptyDescription: "Usage summaries become available in B-601 when normalized usage records are connected.",
  },
  audit: {
    title: "Audit Logs",
    description: "Trace user, agent, model, tool, approval, and Git actions chronologically.",
    emptyTitle: "No audit events yet",
    emptyDescription: "Audit event rendering and filters are implemented in B-602.",
  },
  settings: {
    title: "Settings",
    description: "Manage the current workspace experience and security-facing preferences.",
    emptyTitle: "No configurable settings in this task",
    emptyDescription: "B-102 establishes navigation only; integration and provider settings arrive in their owned tasks.",
  },
} satisfies Record<string, SectionDefinition>;

export function generateStaticParams() {
  return ["dashboard", ...Object.keys(sections)].map((section) => ({ section }));
}

export default async function WorkspaceSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (section === "dashboard") {
    return <FoundationDashboard />;
  }

  const definition = sections[section as keyof typeof sections];
  if (!definition) {
    notFound();
  }

  return <SectionPage section={definition} />;
}
