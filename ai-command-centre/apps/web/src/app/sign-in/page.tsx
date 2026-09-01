"use client";

import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import Image from "next/image";

import { BrandMark } from "@/components/brand-mark";
import { useMockSession } from "@/components/session/mock-session-provider";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { signIn } = useMockSession();

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden border-r border-border bg-background-deep p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="relative h-24 w-full max-w-lg overflow-hidden rounded-xl"><Image src="/logo.png" alt="AI Command Centre" fill priority className="object-cover object-center" sizes="520px" /></div>
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Human-controlled orchestration</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-foreground">
            Your AI engineering team, in one command centre.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            Coordinate specialized agents, monitor live work, inspect evidence, and approve consequential actions.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {["Workspace-scoped context", "Visible task and agent activity", "Human approval before high-impact actions"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-success" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-subtle-foreground">B-102 mock session - no real credentials are collected.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><BrandMark /></div>
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <LockKeyhole className="size-5" />
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-foreground">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Continue with the safe mock workspace session.</p>

          <div className="surface-card mt-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f2c7a6] to-[#81573f] text-xs font-bold text-[#20140f]">AK</span>
              <div>
                <p className="text-sm font-semibold text-foreground">Alex Kim</p>
                <p className="mt-0.5 text-xs text-muted-foreground">alex@acme.dev · Workspace Owner</p>
              </div>
            </div>
            <Button className="mt-6 w-full" onClick={signIn}>
              Continue to Acme Engineering <ArrowRight className="size-4" />
            </Button>
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-subtle-foreground">
            Authentication is mocked for B-102. Production identity and session enforcement remain a shared integration dependency.
          </p>
        </div>
      </section>
    </main>
  );
}
