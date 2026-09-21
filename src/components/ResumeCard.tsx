"use client";

import { useState } from "react";
import Link from "next/link";
import { Resume } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ResumeCardProps {
  resume: Resume;
  /**
   * Permanently deletes the resume (DB rows, stored HTML/PDF objects, uploads).
   * Resolves with `filesFailed` > 0 when the database rows went but some stored
   * objects could not be removed — the caller surfaces that to the user.
   */
  onDelete?: (id: string) => Promise<{ ok: boolean; filesFailed: number }>;
}

export default function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    draft: { bg: "bg-surface-raised", text: "text-ink-secondary", dot: "bg-ink-muted" },
    generating: { bg: "bg-accent/10", text: "text-accent", dot: "bg-accent/60" },
    completed: { bg: "bg-success/10", text: "text-success", dot: "bg-success" },
    failed: { bg: "bg-error/10", text: "text-error", dot: "bg-error" },
  };
  const s = statusConfig[resume.status] || statusConfig.draft;

  const handleConfirm = async () => {
    if (!onDelete || pending) return;
    setPending(true);
    setError(null);
    const res = await onDelete(resume.id);
    setPending(false);
    if (res.ok) {
      setConfirmOpen(false);
    } else {
      // Keep the dialog open so the failure is visible next to the action.
      setError("Couldn't delete this resume. Please try again.");
    }
  };

  return (
    <div className="relative h-full">
      <Link
        href={`/dashboard/${resume.id}`}
        className="group block h-full card p-5 hover:shadow-md transition-all duration-300 animate-fade-in-up"
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
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border pr-10">
          {resume.revisions && resume.revisions.length > 0 && (
            <>
              <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-ink-muted">
                {resume.revisions.length} revision{resume.revisions.length > 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
      </Link>

      {/* Deliberately OUTSIDE the card link: keeps the anchor free of nested
          interactive elements, and one click can't both delete and navigate. */}
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${resume.title}`}
          title="Delete resume"
          onClick={() => {
            setError(null);
            setConfirmOpen(true);
          }}
          className="absolute bottom-4 right-4 inline-flex items-center justify-center w-8 h-8 rounded-lg text-ink-muted hover:text-error hover:bg-error/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        destructive
        pending={pending}
        error={error}
        title="Delete this resume?"
        description={
          <>
            <span className="font-medium text-ink-primary">{resume.title}</span>
            {" and everything built from it will be permanently deleted — all revisions, the generated document, and the files you uploaded. This can't be undone."}
          </>
        }
        confirmLabel="Delete resume"
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!pending) {
            setConfirmOpen(false);
            setError(null);
          }
        }}
      />
    </div>
  );
}
