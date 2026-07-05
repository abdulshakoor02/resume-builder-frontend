"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PromptInput from "./PromptInput";
import FileUpload from "./FileUpload";
import { useResume } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";

export default function BuilderSection() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { createResume, isGenerating, error } = useResume();
  const { token } = useAuth();
  const router = useRouter();

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
  }, []);

  const handleSubmit = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("title", prompt.slice(0, 100));
    files.forEach((f) => formData.append("files", f));

    const resumeId = await createResume(formData);
    if (resumeId) {
      router.push(`/dashboard/${resumeId}`);
    }
  };

  return (
    <section id="builder" className="py-8 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-display text-ink-primary text-center mb-8">
          Start building your resume
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error">
            {error}
          </div>
        )}

        <div className="card p-8 space-y-6">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleSubmit}
            isLoading={isGenerating}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-3 text-ink-muted font-medium">or</span>
            </div>
          </div>

          <FileUpload onFilesSelected={handleFilesSelected} files={files} />

          {files.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="w-full btn-primary py-3.5 text-sm"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Build Resume from Uploads"
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
