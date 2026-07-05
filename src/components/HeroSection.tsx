"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const { token } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="section-container pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="font-display text-ink-primary">Build a beautiful resume</span>
              <br />
              <span className="text-ink-secondary text-2xl sm:text-3xl lg:text-4xl font-sans mt-2 block">
                in minutes, not hours
              </span>
            </h1>
            <p className="mt-4 text-lg text-ink-secondary leading-relaxed max-w-lg">
              Describe your experience in plain language or upload an existing resume.
              Our AI designs a professional, ATS-friendly PDF tailored to your career.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href={token ? "#builder" : "/signup"} className="btn-primary text-sm px-6 py-3">
                {token ? "Build your resume" : "Get started free"}
              </Link>
              <Link href="#features" className="btn-secondary text-sm px-6 py-3">
                See how it works
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in hidden lg:block" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-full aspect-[4/3]">
              <div className="absolute inset-0 rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-3/4 rounded bg-ink-muted/20" />
                      <div className="h-2 w-1/2 rounded bg-ink-muted/10" />
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-3">
                    {[80, 60, 90, 45, 70].map((w, i) => (
                      <div key={i} className="h-2.5 rounded" style={{ width: `${w}%`, backgroundColor: "var(--color-ink-muted)" }} />
                    ))}
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-md bg-accent/15" />
                    <div className="h-6 w-20 rounded-md bg-accent/10" />
                    <div className="h-6 w-14 rounded-md bg-accent/15" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-accent/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-accent/5 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
