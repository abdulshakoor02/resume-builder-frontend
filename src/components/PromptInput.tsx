"use client";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
  label?: string;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "Describe the resume you want, or paste your existing resume text...",
  label = "What kind of resume do you need?",
}: PromptInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-ink-primary mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="input-field w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink-primary placeholder:text-ink-muted outline-none resize-none transition-all"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="mt-3 w-full btn-primary py-3 text-sm"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </span>
        ) : (
          "Build My Resume"
        )}
      </button>
    </div>
  );
}
