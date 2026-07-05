"use client";

import Link from "next/link";
import { Resume } from "@/lib/api";

interface ResumeCardProps {
  resume: Resume;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    draft: { bg: "bg-surface-raised", text: "text-ink-secondary", dot: "bg-ink-muted" },
    generating: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400 animate-pulse" },
    completed: { bg: "bg-success/10", text: "text-success", dot: "bg-success" },
    failed: { bg: "bg-error/10", text: "text-error", dot: "bg-error" },
  };
  const s = statusConfig[resume.status] || statusConfig.draft;

  return (
    <Link
      href={`/dashboard/${resume.id}`}
      className="group block card p-5 hover:shadow-md transition-all duration-300 animate-fade-in-up"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ink-primary group-hover:text-accent-hover transition-colors truncate">
            {resume.title}
          </h3>
          <p className="text-xs text-ink-muted mt-1.5">
            {new Date(resume.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${s.bg} ${s.text} ml-3 shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {resume.status}
        </span>
      </div>
      {resume.revisions && resume.revisions.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-ink-muted">
            {resume.revisions.length} revision{resume.revisions.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </Link>
  );
}
