"use client";

interface PaywallOverlayProps {
  type: "resume" | "revision";
  onClose: () => void;
}

export default function PaywallOverlay({ type, onClose }: PaywallOverlayProps) {
  const title =
    type === "resume"
      ? "You've created your free resume!"
      : "You've used your free revision!";

  const body =
    type === "resume"
      ? "Upgrade to a paid plan to create unlimited professional resumes with AI-powered design."
      : "Upgrade to a paid plan for unlimited resume refinements and revisions.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="animate-fade-in-up card max-w-md mx-4 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
          <svg
            className="h-8 w-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-ink-primary mb-2">{title}</h2>
        <p className="text-sm text-ink-secondary mb-6">{body}</p>
        <div className="space-y-3">
          <button className="w-full btn-primary py-3 text-sm font-medium">
            ✦ Upgrade to Pro
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink-secondary hover:bg-surface-raised transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
