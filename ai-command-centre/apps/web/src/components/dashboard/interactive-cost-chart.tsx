"use client";

import { Activity } from "lucide-react";
import { useState } from "react";

const hourly = [
  ["12 AM", 0.82], ["2 AM", 1.06], ["4 AM", 0.91], ["6 AM", 1.42],
  ["8 AM", 1.27], ["10 AM", 1.68], ["12 PM", 1.94], ["2 PM", 1.81],
  ["4 PM", 2.23], ["6 PM", 2.05], ["8 PM", 2.58], ["10 PM", 2.44],
] as const;
const maximum = Math.max(...hourly.map(([, value]) => value));

export function InteractiveCostChart() {
  const [active, setActive] = useState(hourly.length - 1);
  const [label, value] = hourly[active];

  return <div>
    <div className="flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Total cost</p><p className="mt-1 text-2xl font-semibold">$42.87</p><p className="mt-1 text-[10px] text-success">↓ 8% vs yesterday</p></div><Activity className="size-8 text-purple" /></div>
    <div className="relative mt-5 rounded-lg border border-border/70 bg-background/45 px-3 pb-2 pt-8">
      <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-purple/30 bg-[#141f36] px-3 py-1 text-[10px] shadow-lg" role="status" aria-live="polite"><span className="text-muted-foreground">{label}</span><b className="ml-2 text-white">${value.toFixed(2)}</b></div>
      <div className="flex h-24 items-end gap-1" role="img" aria-label="Hourly API cost. Focus a bar to reveal its exact value.">
        {hourly.map(([hour, amount], index) => <button key={hour} type="button" aria-label={`${hour}: $${amount.toFixed(2)}`} className={`chart-bar group relative flex-1 origin-bottom rounded-t-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple ${active === index ? "bg-gradient-to-t from-purple to-[#b28cff] shadow-[0_0_18px_rgb(139_92_246_/_38%)]" : "bg-purple/55 hover:bg-purple/80"}`} style={{ height:`${Math.round((amount/maximum)*100)}%`, animationDelay:`${index*45}ms` }} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}><span className="sr-only">{hour}: ${amount.toFixed(2)}</span></button>)}
      </div>
      <div className="mt-2 flex justify-between text-[9px] text-subtle-foreground"><span>12 AM</span><span>12 PM</span><span>10 PM</span></div>
    </div>
    <div className="mt-5 space-y-3">{[["Backend Agent","$18.71",82],["Frontend Agent","$12.34",61],["Architect Agent","$7.89",42],["Tester Agent","$3.21",24]].map(([name, cost, width], index) => <div key={String(name)} className="grid grid-cols-[1fr_90px_48px] items-center gap-2 text-[11px]"><span>{name}</span><div className="h-1.5 overflow-hidden rounded-full bg-background"><div className="horizontal-chart-bar h-full origin-left rounded-full bg-gradient-to-r from-primary to-cyan-400" style={{ width:`${width}%`, animationDelay:`${index*90+200}ms` }} /></div><span className="text-right text-muted-foreground">{cost}</span></div>)}</div>
  </div>;
}
