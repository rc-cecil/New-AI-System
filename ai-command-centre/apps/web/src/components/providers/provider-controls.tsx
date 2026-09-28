"use client";

import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Check,
  ChevronDown,
  Gauge,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";

type ProviderState = "ready" | "loading" | "degraded" | "unavailable";
type ProviderOption = {
  id: string;
  name: string;
  state: ProviderState;
  color: string;
  models: Array<{ id: string; name: string; context: string; speed: string; cost: string }>;
  capabilities: string[];
  usage: number;
  requests: string;
  latency: string;
};

const providers: ProviderOption[] = [
  { id: "openai", name: "OpenAI", state: "ready", color: "#2dd4bf", usage: 68, requests: "18.7K", latency: "1.32s", capabilities: ["Vision", "Tools", "JSON mode", "Streaming"], models: [{ id: "gpt-4o", name: "GPT-4o", context: "128K", speed: "Fast", cost: "$2.50 / 1M" }, { id: "o3", name: "o3", context: "200K", speed: "Reasoned", cost: "$10 / 1M" }] },
  { id: "anthropic", name: "Anthropic", state: "degraded", color: "#fb923c", usage: 51, requests: "12.1K", latency: "1.85s", capabilities: ["Vision", "Tools", "Long context", "Streaming"], models: [{ id: "sonnet", name: "Claude 3.5 Sonnet", context: "200K", speed: "Fast", cost: "$3 / 1M" }, { id: "opus", name: "Claude Opus", context: "200K", speed: "Deep", cost: "$15 / 1M" }] },
  { id: "gemini", name: "Google Gemini", state: "loading", color: "#818cf8", usage: 43, requests: "8.9K", latency: "1.21s", capabilities: ["Vision", "Tools", "Multimodal", "Streaming"], models: [{ id: "gemini-pro", name: "Gemini 1.5 Pro", context: "2M", speed: "Fast", cost: "$1.25 / 1M" }] },
  { id: "ollama", name: "Ollama Local", state: "unavailable", color: "#94a3b8", usage: 0, requests: "—", latency: "—", capabilities: ["Local execution", "Private data"], models: [{ id: "llama", name: "Llama 3.1", context: "128K", speed: "Local", cost: "No API cost" }] },
];

const stateLabel: Record<ProviderState, string> = { ready: "Available", loading: "Loading models", degraded: "Rate limited", unavailable: "Unavailable" };

export function ProviderControls() {
  const [providerId, setProviderId] = useState("openai");
  const [modelId, setModelId] = useState("gpt-4o");
  const [retrying, setRetrying] = useState(false);
  const provider = useMemo(() => providers.find((item) => item.id === providerId) ?? providers[0], [providerId]);
  const model = provider.models.find((item) => item.id === modelId) ?? provider.models[0];

  const chooseProvider = (id: string) => {
    const next = providers.find((item) => item.id === id) ?? providers[0];
    setProviderId(next.id);
    setModelId(next.models[0].id);
  };

  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => setRetrying(false), 650);
  };

  return (
    <section className="surface-card overflow-visible" aria-labelledby="model-routing-title">
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary"><BrainCircuit className="size-4" /></span>
            <div><h2 id="model-routing-title" className="text-sm font-semibold">Model routing controls</h2><p className="mt-1 text-[10px] text-muted-foreground">Choose a provider and inspect capability, availability, and usage before assigning work.</p></div>
          </div>
        </div>
        <span className={`provider-state ${provider.state}`}><i />{stateLabel[provider.state]}</span>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-[11px] font-medium">Provider<div className="model-select mt-2"><span className="provider-swatch" style={{ background: provider.color }} /><select aria-label="Provider" value={providerId} onChange={(event) => chooseProvider(event.target.value)}>{providers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown className="size-4 text-muted-foreground" /></div></label>
            <label className="text-[11px] font-medium">Model<div className="model-select mt-2"><Sparkles className="size-4 text-primary" /><select aria-label="Model" value={model.id} onChange={(event) => setModelId(event.target.value)} disabled={provider.state === "unavailable"}>{provider.models.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown className="size-4 text-muted-foreground" /></div></label>
          </div>

          {provider.state === "loading" ? <div className="provider-feedback mt-4"><LoaderCircle className="size-5 animate-spin text-primary" /><div><p>Refreshing model catalog</p><span>Capabilities will appear when discovery completes.</span></div></div> : provider.state === "unavailable" ? <div className="provider-feedback error mt-4"><WifiOff className="size-5 text-danger" /><div className="flex-1"><p>Local provider is unreachable</p><span>Check the configured endpoint and service health. No tasks will be routed here.</span></div><Button variant="outline" onClick={retry} disabled={retrying}>{retrying ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}{retrying ? "Checking" : "Retry"}</Button></div> : <div className="mt-4 grid gap-3 sm:grid-cols-3"><Metric icon={Gauge} label="Context" value={model.context} /><Metric icon={Zap} label="Response" value={model.speed} /><Metric icon={Activity} label="Input cost" value={model.cost} /></div>}

          <div className="mt-4"><p className="text-[10px] uppercase tracking-[.14em] text-subtle-foreground">Capabilities</p><div className="mt-2 flex flex-wrap gap-2">{provider.capabilities.map((capability) => <span key={capability} className="capability-chip"><Check className="size-3" />{capability}</span>)}</div></div>
          {provider.state === "degraded" && <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/8 p-3 text-[11px] text-warning"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><span>Requests are temporarily rate limited. Automatic routing may choose another compatible provider.</span></div>}
        </div>

        <div className="provider-usage-panel" style={{ "--usage-color": provider.color } as CSSProperties}>
          <div className="usage-orbit" style={{ "--usage": `${provider.usage * 3.6}deg` } as CSSProperties}><div><strong>{provider.usage}%</strong><span>quota used</span></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2"><div><span>Requests</span><b>{provider.requests}</b></div><div><span>Avg. latency</span><b>{provider.latency}</b></div></div>
          <p className="mt-3 text-center text-[9px] text-subtle-foreground">Workspace usage · rolling 30 days</p>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-background/40 p-3"><Icon className="size-4 text-primary" /><p className="mt-3 text-[9px] text-muted-foreground">{label}</p><p className="mt-1 text-xs font-semibold">{value}</p></div>;
}
