"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useUsage } from "@/hooks/useUsage";
import PaywallOverlay from "./PaywallOverlay";

interface Message {
  role: "user" | "assistant";
  content: string;
  pdfUrl?: string;
}

interface RefinementChatProps {
  messages: Message[];
  onSend: (prompt: string, photo?: File | null) => void;
  isLoading: boolean;
  onAccept: () => void;
}

export default function RefinementChat({ messages, onSend, isLoading, onAccept }: RefinementChatProps) {
  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { usage, refetch: refetchUsage } = useUsage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted: File[]) => {
      if (accepted.length > 0) setPhoto(accepted[0]);
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
  });

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    // Check if user has hit revision limit
    if (usage && !usage.can_revise) {
      setShowPaywall(true);
      return;
    }

    onSend(input.trim(), photo);
    setInput("");
    setPhoto(null);
    refetchUsage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full card overflow-hidden">
      {usage && (
        <div className="px-4 pt-3 pb-1 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span>Revisions:</span>
            <span className="font-mono text-ink-secondary">
              {usage.total_revisions}/{usage.free_revision_limit}
            </span>
            {!usage.can_revise && (
              <span className="text-warning font-medium">Limit reached</span>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <svg className="mx-auto h-8 w-8 text-ink-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-ink-muted px-4">
              Ask for changes to refine your resume.<br />e.g. "Make the header bolder" or "Add a skills section"
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white shadow-md shadow-accent/20 rounded-br-md"
                  : "bg-surface border border-border text-ink-primary shadow-sm rounded-bl-md"
              }`}
            >
              <p>{msg.content}</p>
              {msg.pdfUrl && (
                <p className="text-xs mt-1.5 opacity-75 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  New PDF generated
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Photo upload area */}
      {photo && (
        <div className="border-t border-border px-4 pt-3">
          <div className="flex items-center gap-3 p-2.5 bg-accent/10 rounded-xl border border-accent/20">
            <img
              src={URL.createObjectURL(photo)}
              alt="Profile preview"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-accent truncate font-medium">{photo.name}</p>
              <p className="text-xs text-accent/70">Will be added to your resume</p>
            </div>
            <button
              onClick={() => setPhoto(null)}
              className="text-error/70 hover:text-error text-xs transition-colors font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type refinement instructions..."
            rows={2}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none resize-none disabled:opacity-50 transition-all placeholder:text-ink-muted"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || (usage ? !usage.can_revise : false)}
              className="btn-primary px-4 py-2 text-sm"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
            <button
              onClick={onAccept}
              disabled={isLoading}
              className="rounded-xl bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-success/25 active:scale-95"
            >
              Accept
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/50 hover:bg-surface-raised"
            }`}
          >
            <input {...getInputProps()} />
            <svg className="mx-auto h-6 w-6 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-1 text-xs text-ink-muted">Add profile photo (JPG, PNG, WebP up to 2MB)</p>
          </div>
        </div>
      </div>
      {showPaywall && (
        <PaywallOverlay type="revision" onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
