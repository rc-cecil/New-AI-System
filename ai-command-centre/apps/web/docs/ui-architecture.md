# AI Command Centre UI Architecture

**Task:** S-05

**Owner:** Person B - React Product Experience & Integrations

**Status:** Complete

**Applies to:** MVP web product surface in `apps/web`

**Source of truth:** Repository-aligned PRD, Person B work plan, and the ten supplied UI reference images

## 1. Purpose and scope

This document freezes the route hierarchy, component boundaries, responsive behavior, visual tokens, and screen-state rules for the Person B frontend lane. It lets the web application be built against contract-faithful mocks while Person A's API, worker, and orchestration services are still in progress.

The reference images define the visual direction, density, navigation model, and information hierarchy. They do not add features beyond the MVP. In particular:

- The task dependency graph is in scope as a read-only visualization.
- Usage and estimated cost reporting are in scope.
- Provider and GitHub integration settings are in scope.
- A drag-and-drop workflow builder is post-MVP. Its reference image informs graph styling only.
- Subscription billing, invoice management, and payment methods are post-MVP. Their reference image informs usage-page styling only.
- Broad MCP registry management is post-MVP. Integration cards may reserve a future location without exposing non-functional controls.

## 2. Information architecture

### 2.1 Route hierarchy

All authenticated routes live beneath a workspace context. A selected project is optional at the shell level and required only on project- or task-specific screens.

```text
/
|-- /sign-in
|-- /workspaces
|   |-- /new
|   `-- /[workspaceId]
|       |-- /dashboard
|       |-- /projects
|       |   |-- /new
|       |   `-- /[projectId]
|       |       |-- /overview
|       |       `-- /repository
|       |-- /agents
|       |   |-- /new
|       |   `-- /[agentId]
|       |-- /tasks
|       |   |-- /new
|       |   `-- /[taskId]
|       |       |-- /overview
|       |       |-- /diff
|       |       `-- /evidence
|       |-- /approvals
|       |   `-- /[approvalId]
|       |-- /integrations
|       |   |-- /github
|       |   `-- /providers
|       |-- /usage
|       `-- /audit
`-- /settings
    `-- /profile
```

### 2.2 Navigation model

The authenticated application shell contains:

1. **Primary sidebar:** Dashboard, Workspaces, Projects, Agents, Tasks, Approvals, Usage, Audit Logs, and Settings.
2. **Top context bar:** workspace selector, repository/project selector, branch indicator, global search trigger, provider-health indicators, notifications, help, and profile menu.
3. **Page header:** title, supporting description, route-specific tabs, and primary action.
4. **Context panel:** optional right-side detail drawer on data-heavy screens such as Agents, Tasks, Repositories, and Approvals.
5. **Workspace plan card:** desktop-only summary at the foot of the sidebar; hidden from smaller layouts until an account/billing surface is in scope.

Workflows may appear only as a disabled or "post-MVP" navigation item if product stakeholders require roadmap visibility. It must not route to a functional workflow editor during the MVP.

## 3. Reference-image mapping

| Reference image | MVP surface | UI decisions taken from it | Scope treatment |
| --- | --- | --- | --- |
| Task run detail | `/tasks/[taskId]/overview`, `/evidence`, `/diff` | Stage strip, agent run cards, event stream, diff, terminal evidence, approval context, artifacts and cost | In scope across B-304, B-402, B-502, B-504 |
| Workflow builder | Task graph within `/tasks/[taskId]/overview` | Dark grid, node colors, connectors, parallel-branch layout, minimap language | Graph view only; authoring palette and configuration editor deferred |
| Dashboard | `/dashboard` | Four KPI cards, active-task table, agent activity, approvals, cost, recent activity | In scope across B-103 and B-603 |
| Settings and integrations | `/integrations/providers`, `/integrations/github` | Connection cards, masked values, health states, security recommendations | Provider/GitHub portions in scope; MCP management and billing deferred |
| Workspaces | `/workspaces`, `/projects` | Workspace cards, project table, member/activity side rail, usage bars | Workspace/project management in scope |
| Repositories | `/projects/[projectId]/repository` | Filterable repository table, selected-row details, branch/commit/CI summaries | In scope across B-203 |
| Agents | `/agents`, `/agents/[agentId]` | Agent cards, status, metrics, right-side editor, permissions and model controls | In scope across B-301 |
| Tasks | `/tasks`, `/tasks/[taskId]` | Filter toolbar, state tabs, task table, timeline, task detail rail | In scope across B-302 and B-304 |
| Approvals Center | `/approvals`, `/approvals/[approvalId]` | Queue, risk context, evidence, rollback plan, comments, decision controls | In scope across B-503 |
| Usage and Billing | `/usage` | Cost KPIs, provider breakdown, trends, budget/quota presentation | Usage/cost only; invoices, payment method and subscription controls deferred |

## 4. Page hierarchy and composition

### 4.1 Dashboard

```text
PageHeader
KpiGrid
|-- Active agents
|-- Running tasks
|-- Pending approvals
`-- Estimated cost
DashboardPrimaryGrid
|-- ActiveTaskTable
`-- AgentActivityList
DashboardSecondaryGrid
|-- TaskGraphSummary
|-- ApprovalSummary
|-- UsageSummary
`-- RecentActivityList
```

### 4.2 Workspaces and projects

```text
PageHeader + primary create action
SectionTabs
KpiGrid
WorkspaceCardGrid
ProjectTable
OptionalContextRail
|-- Team members
|-- Invitations
`-- Recent activity
```

### 4.3 Agents

```text
PageHeader + NewAgent action
SectionTabs + filters
KpiGrid
AgentCardGrid
AgentPerformanceSummary
RecentAgentActivity
AgentEditorDrawer (selected/new agent)
```

### 4.4 Tasks

```text
PageHeader + NewTask action
FilterToolbar
TaskStateTabs
TaskTable
TaskActivityTimeline
TaskContextDrawer (selected task)
```

Task detail expands the selected task into:

```text
TaskHeader + TaskControls
ExecutionStageStrip
TaskGraph / AccessibleDependencyList
AgentRunGrid
LiveEventStream
ChangedFiles + ReadOnlyDiff
Logs / TerminalEvidence
ReviewEvidence + ApprovalSummary
Artifacts + UsageSummary + GitResult
```

### 4.5 Approvals

```text
PageHeader + filters/sort
ApprovalQueue
ApprovalDetail
|-- Action summary
|-- Requester/agent/repository/branch
|-- Changed files and risk assessment
|-- Rollback plan and linked evidence
|-- Approve / Reject / Defer controls
`-- Rationale input
ActivityAndHistoryRail
```

### 4.6 Integrations, usage, and audit

- **Integrations:** provider/GitHub connection cards, connection tests, masked credentials, and system-health guidance.
- **Usage:** summary metrics, cost/token trends, provider/agent/task breakdowns, budgets and quotas without billing controls.
- **Audit:** filter bar, chronological event list, readable detail, actor/task/tool correlation, and redaction indicators.

## 5. Reusable component inventory

### 5.1 Application shell

| Component | Responsibility |
| --- | --- |
| `AppShell` | Coordinates sidebar, top bar, main content and optional context panel |
| `SidebarNav` | Primary navigation, active-route indication, counters and compact mode |
| `MobileNavDrawer` | Mobile/tablet replacement for the primary sidebar |
| `TopContextBar` | Workspace/project/branch selectors, search, health, notifications and profile |
| `PageHeader` | Page title, description, tabs and actions |
| `ContextDrawer` | Responsive selected-record details; modal drawer below desktop width |
| `CommandSearch` | Keyboard-accessible global search/command trigger |

### 5.2 Common data display

| Component | Responsibility |
| --- | --- |
| `SurfaceCard` | Shared bordered panel with consistent padding and heading treatment |
| `KpiCard` | Metric, comparison, icon and optional sparkline |
| `StatusBadge` | Semantic status label with text and color/icon reinforcement |
| `RiskBadge` | Low, medium, high and critical risk presentation |
| `ProgressBar` | Labeled deterministic or indeterminate progress |
| `AvatarStack` | Compact assignee display with accessible overflow count |
| `DataTable` | Sortable/filterable responsive data table with row selection |
| `FilterToolbar` | Search, select filters, sort, view toggle and clear filters |
| `EmptyState` | Contextual empty state and recovery/primary action |
| `ErrorState` | Safe error summary, retry action and correlation ID where available |
| `Skeleton` | Layout-stable loading placeholder |
| `ActivityList` | Actor, event, context and relative/absolute timestamps |
| `MiniTrend` | Accessible SVG sparkline with textual trend equivalent |

### 5.3 Domain components

| Area | Components |
| --- | --- |
| Projects/GitHub | `RepositoryCard`, `RepositoryTable`, `BranchBadge`, `SyncStatus`, `CommitList`, `CiSummary` |
| Providers | `ProviderCard`, `ProviderModelSelect`, `CapabilityList`, `ConnectionTestResult`, `MaskedSecretField` |
| Agents | `AgentCard`, `AgentStatus`, `AgentEditor`, `ToolPicker`, `PermissionChecklist`, `LimitControls` |
| Tasks | `TaskTable`, `TaskComposer`, `TaskStageStrip`, `TaskTimeline`, `TaskGraph`, `DependencyList` |
| Agent runs | `AgentRunCard`, `LiveLogViewer`, `ArtifactList`, `RunFailurePanel`, `RetryState` |
| Git/diff | `ChangedFileTree`, `DiffViewer`, `GitResultCard`, `TestEvidencePanel`, `ReviewEvidencePanel` |
| Approvals | `ApprovalQueue`, `ApprovalDetail`, `RiskAssessment`, `RollbackPlan`, `ApprovalDecisionForm` |
| Usage/audit | `UsageBreakdown`, `CostSummary`, `QuotaMeter`, `AuditEventList`, `AuditEventDetail` |

Components consume normalized view models and callbacks. They do not call `fetch`, open event streams, or depend on provider-specific response objects directly.

## 6. Visual design tokens

Tokens are CSS custom properties exposed through Tailwind theme aliases. Values may receive minor contrast corrections during B-702, but roles and naming are frozen.

### 6.1 Color

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#06111d` | Application background |
| `--color-bg-deep` | `#020b14` | Sidebar/top-bar depth |
| `--color-surface` | `#0b1825` | Cards and panels |
| `--color-surface-raised` | `#102131` | Selected and raised surfaces |
| `--color-border` | `#203244` | Standard borders |
| `--color-border-strong` | `#2d4358` | Focused/selected separators |
| `--color-text` | `#f1f5f9` | Primary text |
| `--color-text-muted` | `#93a4b7` | Secondary text |
| `--color-text-subtle` | `#64778b` | Metadata and disabled text |
| `--color-primary` | `#1683ff` | Primary action and active navigation |
| `--color-primary-hover` | `#3295ff` | Primary hover state |
| `--color-info` | `#38a3ff` | Informational state |
| `--color-success` | `#22c55e` | Success/online/completed |
| `--color-warning` | `#f59e0b` | Warning/testing/waiting |
| `--color-danger` | `#ef4444` | Failure/rejection/critical risk |
| `--color-purple` | `#8b5cf6` | Review/orchestration/cost accent |
| `--color-cyan` | `#22d3ee` | Frontend/data accent |

No status is communicated through color alone. Every semantic state includes text and, where compact, an icon.

### 6.2 Typography

- Primary family: Inter with system-ui fallback.
- Monospace family: JetBrains Mono, ui-monospace, Consolas fallback.
- Page title: 28/34 px, weight 650.
- Section title: 16/22 px, weight 600.
- Card title: 14/20 px, weight 600.
- Body: 14/20 px.
- Compact metadata/table text: 12/17 px; never smaller.
- Numeric KPIs use tabular numerals.

### 6.3 Geometry and motion

- Desktop sidebar: 216 px; compact desktop sidebar: 72 px.
- Top bar: 64 px minimum height.
- Content max width: none on operational screens; use 24 px desktop gutters.
- Card radius: 9 px; control radius: 7 px; pill radius: 999 px.
- Standard card padding: 16 px; dense table cells: 12 px vertical and 14 px horizontal.
- Border: 1 px; selected records add a primary-colored border or inset accent.
- Focus ring: 2 px primary ring with 2 px offset.
- Motion: 120-180 ms for hover/drawer transitions; respect `prefers-reduced-motion`.

## 7. Responsive behavior

### 7.1 Wide desktop - 1440 px and above

- Persistent 216 px sidebar and 64 px top bar.
- Use the full-width, high-density layouts shown in the references.
- Right context rails/drawers may remain visible beside the primary content.
- Dashboard uses four KPI columns and four secondary panels where space permits.

### 7.2 Desktop/laptop - 1024-1439 px

- Sidebar may collapse to 72 px; labels are available through tooltips.
- Secondary panels move below primary tables when their minimum width cannot be maintained.
- Context panels use an overlay drawer unless the main content retains at least 720 px.
- Tables preserve key columns and expose secondary fields through row expansion.

### 7.3 Tablet - 768-1023 px

- Sidebar becomes a drawer; top bar retains workspace/project context in a condensed selector.
- KPI grids use two columns.
- Toolbars wrap into two rows; non-primary filters move into a filter sheet.
- Tables use a horizontally scrollable region with visible affordance or switch to cards when comparison is not essential.
- Graph view remains available with pan/zoom; the dependency list is displayed first for accessibility and scanning.

### 7.4 Mobile - below 768 px

- Single-column flow with a sticky compact header and navigation drawer.
- KPI cards use one or two columns depending on available width.
- Right-side drawers become full-height sheets.
- Dense tables become record cards except for changed-files and audit lists, which may scroll horizontally.
- Approval actions remain visible near the action summary and use full-width buttons.
- Diff defaults to unified mode; side-by-side mode is unavailable below 768 px.

## 8. State and interaction patterns

### 8.1 Standard asynchronous states

Every data-bound region implements these states independently:

1. **Initial/loading:** layout-stable skeleton; controls that require data are disabled.
2. **Empty:** explain why no records exist and provide an appropriate next action.
3. **Error:** safe message, retry control when recoverable, and no raw provider/server payload.
4. **Success:** rendered data with last-updated or live-state indication where relevant.
5. **Refreshing:** retain existing data and show non-blocking progress.
6. **Stale/offline:** display cached state as stale and explain reconnection behavior.

### 8.2 Mutations and consequential actions

- Buttons enter a pending state and cannot be double-submitted.
- Success is shown only after backend confirmation.
- Destructive or high-impact actions require a confirmation/approval surface with clear scope.
- Approval decisions display action, risk, repository, branch, affected resources and rationale before submission.
- Rejected or failed mutations retain user-entered rationale when safe so the action can be corrected.
- Toasts supplement, but never replace, durable inline status.

### 8.3 Realtime task behavior

- Realtime events update the visible task state without replacing durable API state as the source of truth.
- Events are ordered and deduplicated before they affect the UI.
- On reconnect, the client refreshes the task snapshot and then resumes the stream.
- The UI distinguishes queued, planning, waiting for plan approval, running, waiting for approval, completed, failed and cancelled states.
- A connection indicator exposes live, reconnecting, stale and offline states.

## 9. Data and contract boundaries

- Page and domain components consume typed view models from the web compatibility layer.
- `ApiClient` and `MockApiClient` implement the same interface.
- Mock fixtures use realistic identifiers and safe synthetic values; they never contain usable credentials or local absolute paths.
- The realtime store accepts a discriminated `TaskEvent` envelope and exposes derived task/run state through selectors.
- GitHub authenticated operations run server-side through `packages/github`; browser components receive normalized metadata only.
- Approval actions are never represented as successful until the API returns the persisted decision.
- When `packages/shared` becomes available, the compatibility layer re-exports shared contracts without changing component imports.

## 10. Accessibility requirements

- All routes have one visible `h1` and a logical heading hierarchy.
- Navigation, tables, drawers, tabs, dialogs, menus, forms and graph fallback are keyboard operable.
- Drawers/dialogs trap focus, restore focus on close, expose an accessible name, and close via Escape when safe.
- Selected rows, statuses, validation errors and live connection states are announced semantically.
- Realtime logs do not force focus or continuously interrupt screen readers; important state transitions use a restrained live region.
- Charts include textual values and trends; graph information is fully available through the dependency list.
- Interactive targets are at least 40 by 40 px on touch layouts.
- Text and control contrast target WCAG 2.2 AA; final verification occurs in B-702.

## 11. Route ownership and deferred surfaces

Person B owns `apps/web`, `packages/github`, web-facing integration adapters, UI tests, E2E tests, and frontend documentation. Person B does not modify database migrations, orchestration, worker, sandbox, backend permission enforcement, or provider runtime internals.

Deferred routes and functionality:

- Visual workflow authoring and reusable workflow editor.
- Billing plans, invoices, payment methods and subscription administration.
- Full MCP server registry/discovery UI.
- Deployment controls and autonomous production deployment.
- Rich collaboration, organization RBAC administration and marketplace surfaces.

If a deferred item is visible for navigation continuity, it must be labeled unavailable/post-MVP and must not present an enabled action.

## 12. S-05 acceptance checklist

- [x] Dashboard, projects, agents, tasks, approvals, integrations, usage and audit routes are defined.
- [x] Auth, workspace, repository, task-detail and selected-record routes are included.
- [x] Each supplied reference image is mapped to an MVP surface or explicitly marked as visual-only/post-MVP.
- [x] Shared shell, common data-display and domain component inventories are defined.
- [x] Desktop, laptop, tablet and mobile behavior is specified.
- [x] Loading, empty, error, success, refresh, stale and mutation patterns are specified.
- [x] Design tokens and accessibility baselines are frozen for B-101.
- [x] Person A/Person B code boundaries and mock-to-real integration strategy are explicit.

## 13. Next task boundary

The next task is **B-101 - Web foundation**. It may create the npm workspace and Next.js application shell described here only after explicit user approval.
