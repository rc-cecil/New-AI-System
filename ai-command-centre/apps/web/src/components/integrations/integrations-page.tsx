"use client";

import { Bot, Check, ChevronRight, CircleAlert, GitBranch, KeyRound, LockKeyhole, PlugZap, Server, ShieldCheck, Sparkles, Unplug } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { ProviderControls } from "@/components/providers/provider-controls";
import { Button } from "@/components/ui/button";

type ProviderState = "connected" | "disconnected" | "testing" | "error";
type Provider = { id:string; name:string; detail:string; models:string; state:ProviderState; kind:"github"|"cloud"|"local"; accent:string };
const initialProviders: Provider[] = [
  { id:"github", name:"GitHub", detail:"acme-engineering", models:"Repositories, branches, pull requests", state:"connected", kind:"github", accent:"from-slate-400 to-white" },
  { id:"openai", name:"OpenAI", detail:"Workspace credential", models:"GPT-4o, o-series", state:"connected", kind:"cloud", accent:"from-emerald-400 to-cyan-300" },
  { id:"anthropic", name:"Anthropic", detail:"Workspace credential", models:"Claude 3.5 Sonnet", state:"connected", kind:"cloud", accent:"from-amber-400 to-orange-400" },
  { id:"gemini", name:"Gemini", detail:"Not configured", models:"Gemini 1.5 Pro", state:"disconnected", kind:"cloud", accent:"from-blue-400 to-purple" },
  { id:"ollama", name:"Ollama", detail:"http://localhost:11434", models:"Local models", state:"connected", kind:"local", accent:"from-cyan-400 to-primary" },
];

const Icon = ({ kind }: { kind:Provider["kind"] }) => kind === "github" ? <GitBranch className="size-5" /> : kind === "local" ? <Server className="size-5" /> : <Bot className="size-5" />;

export function IntegrationsPage() {
  const [providers, setProviders] = useState(initialProviders);
  const [selected, setSelected] = useState("gemini");
  const [credential, setCredential] = useState("");
  const active = providers.find(item => item.id === selected) ?? providers[0];

  const update = (id:string, state:ProviderState, detail?:string) => setProviders(current => current.map(item => item.id === id ? {...item,state,detail:detail ?? item.detail}:item));
  const testConnection = () => { update(active.id,"testing"); window.setTimeout(() => update(active.id,"connected","Connection verified just now"),650); };
  const disconnect = () => update(active.id,"disconnected","Not configured");

  return <div className="mx-auto max-w-[1560px] space-y-5">
    <PageHeader eyebrow="Secure connections" title="Integrations" description="Connect code and model providers without exposing raw credentials to the interface." actions={<Button><PlugZap className="size-4" /> Add provider</Button>} />
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3" aria-label="Configured providers">
          {providers.map(provider => <button key={provider.id} type="button" onClick={() => setSelected(provider.id)} aria-pressed={selected === provider.id} className={`surface-card group min-h-44 text-left ${selected === provider.id ? "border-primary/60 shadow-[0_16px_42px_rgb(22_131_255_/_14%)]" : ""}`}>
            <div className="flex items-start justify-between"><span className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${provider.accent} text-[#04101b] shadow-lg transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110`}><Icon kind={provider.kind} /></span><span className={`status-dot ${provider.state}`}><i />{provider.state === "testing" ? "Testing" : provider.state === "connected" ? "Connected" : provider.state === "error" ? "Action needed" : "Not connected"}</span></div>
            <h2 className="mt-5 text-sm font-semibold">{provider.name}</h2><p className="mt-1 text-[11px] text-muted-foreground">{provider.detail}</p><div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-[10px] text-subtle-foreground"><span>{provider.models}</span><ChevronRight className="size-4 transition-transform group-hover:translate-x-1" /></div>
          </button>)}
        </section>
        <ProviderControls />
        <section className="surface-card">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4"><div className="flex items-center gap-3"><span className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${active.accent} text-[#04101b]`}><Icon kind={active.kind} /></span><div><h2 className="font-semibold">Configure {active.name}</h2><p className="mt-1 text-xs text-muted-foreground">Credentials are sent only to the server boundary and are never echoed back.</p></div></div><span className={`status-dot ${active.state}`}><i />{active.state}</span></div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <label className="block"><span className="text-xs font-medium">API token or connection secret</span><div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background/65 px-3 focus-within:border-primary"><KeyRound className="size-4 text-muted-foreground" /><input aria-label="API token or connection secret" type="password" value={credential} onChange={event => setCredential(event.target.value)} placeholder="Enter a new credential" autoComplete="new-password" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle-foreground" /></div><p className="mt-2 text-[10px] text-subtle-foreground">Stored values remain masked. Entering nothing preserves the existing secret.</p></label>
            <div><p className="text-xs font-medium">Connection capabilities</p><div className="mt-2 grid grid-cols-2 gap-2">{["Models", "Usage", "Streaming", "Health checks"].map(item => <span key={item} className="flex items-center gap-2 rounded-lg border border-border bg-background/45 px-3 py-2.5 text-[11px]"><Check className="size-3.5 text-success" />{item}</span>)}</div></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4"><Button onClick={testConnection} disabled={active.state === "testing"}>{active.state === "testing" ? <><span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Testing connection</> : <><PlugZap className="size-4" /> Test & connect</>}</Button>{active.state === "connected" && <Button variant="outline" onClick={disconnect}><Unplug className="size-4" /> Disconnect</Button>}</div>
        </section>
      </div>
      <aside className="space-y-4">
        <section className="surface-card border-success/25 bg-[linear-gradient(145deg,rgb(15_63_48_/_45%),rgb(8_22_34_/_95%))]"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-success/15 text-success"><ShieldCheck className="size-5" /></span><div><h2 className="text-sm font-semibold">Security posture</h2><p className="mt-1 text-[11px] text-success">Protected configuration</p></div></div><ul className="mt-5 space-y-3 text-xs text-muted-foreground">{["Secrets are write-only in the browser", "Provider errors are normalized and redacted", "Disconnect actions preserve audit context", "Local endpoints require explicit configuration"].map(item => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-success" />{item}</li>)}</ul></section>
        <section className="surface-card"><div className="flex items-center gap-2"><LockKeyhole className="size-4 text-warning" /><h2 className="text-sm font-semibold">Recommended actions</h2></div><div className="mt-4 space-y-2">{[["Rotate long-lived keys","Review"],["Enable workspace MFA","Enable"],["Audit unused providers","Scan"]].map(([title,action]) => <button key={title} className="flex w-full items-center justify-between rounded-lg border border-border bg-background/45 px-3 py-3 text-left text-xs transition-colors hover:border-border-strong hover:bg-surface-raised"><span className="flex items-center gap-2"><CircleAlert className="size-3.5 text-warning" />{title}</span><span className="text-primary">{action}</span></button>)}</div></section>
        <section className="rounded-xl border border-primary/25 bg-primary/8 p-4"><div className="flex gap-3"><Sparkles className="size-5 shrink-0 text-primary" /><div><h2 className="text-xs font-semibold">Safe mock mode</h2><p className="mt-1 text-[11px] leading-5 text-muted-foreground">Connection actions update local UI state only until Person A’s integration APIs are available.</p></div></div></section>
      </aside>
    </div>
  </div>;
}
