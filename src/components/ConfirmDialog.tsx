"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Confirmation dialog for irreversible actions.
 *
 * The dashboard had no modal primitives, and a one-click delete of a resume
 * (DB rows + stored objects + uploads) is destructive enough to deserve a
 * deliberate second step. Follows the app's existing card/button tokens.
 */
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** Body copy; a string or richer nodes (e.g. the resume title). */
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Renders the confirm button in the error colour. */
  destructive?: boolean;
  /** Disables both actions and shows a spinner in the confirm button. */
  pending?: boolean;
  /** Error text from the failed attempt, shown inside the dialog. */
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = false,
  pending = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Escape closes (unless a request is in flight), and focus lands on the safe
  // action so a stray Enter keypress can't confirm a deletion.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };
    document.addEventListener("keydown", onKey);
    cancelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => {
        if (!pending) onCancel();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="card w-full max-w-md p-6 shadow-xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${
              destructive ? "bg-error/10" : "bg-accent/10"
            }`}
          >
            <svg
              className={`w-5 h-5 ${destructive ? "text-error" : "text-accent"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-ink-primary">
              {title}
            </h2>
            <div id={descId} className="mt-2 text-sm text-ink-secondary leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-xl text-sm text-error">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="btn-secondary text-sm px-5 py-2.5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              destructive ? "bg-error hover:bg-error/90" : "btn-primary"
            }`}
          >
            {pending && (
              <span className="animate-spin h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full" />
            )}
            {pending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
