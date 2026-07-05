"use client";

import { useUsage } from "@/hooks/useUsage";
import { useAuth } from "@/hooks/useAuth";

export default function UsageBanner() {
  const { usage } = useUsage();
  const { token } = useAuth();

  if (!usage || !token) return null;

  const resumeUsed = usage.resumes_created;
  const resumeMax = usage.free_resume_limit;
  const revisionUsed = usage.total_revisions;
  const revisionMax = usage.free_revision_limit;
  const allExhausted = !usage.can_create && !usage.can_revise;

  const resumePct = Math.min((resumeUsed / resumeMax) * 100, 100);
  const revisionPct = Math.min((revisionUsed / revisionMax) * 100, 100);

  return (
    <div
      className={`rounded-xl border p-4 text-sm ${
        allExhausted
          ? "bg-warning/10 border-warning/20"
          : "bg-surface border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`font-medium ${
            allExhausted ? "text-warning" : "text-ink-primary"
          }`}
        >
          Free tier
        </span>
        {allExhausted && (
          <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full font-medium">
            Limit reached
          </span>
        )}
        {!allExhausted && (
          <span className="text-xs text-ink-muted">
            {resumeMax - resumeUsed} resume{resumeMax - resumeUsed !== 1 ? "s" : ""} &middot;{" "}
            {revisionMax - revisionUsed} revision{revisionMax - revisionUsed !== 1 ? "s" : ""} left
          </span>
        )}
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-ink-secondary mb-1">
            <span>Resumes</span>
            <span className="font-mono">
              {resumeUsed}/{resumeMax}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${resumePct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-ink-secondary mb-1">
            <span>Revisions</span>
            <span className="font-mono">
              {revisionUsed}/{revisionMax}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${revisionPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
