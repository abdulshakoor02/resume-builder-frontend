"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PromptInput from "@/components/PromptInput";
import FileUpload from "@/components/FileUpload";
import { useResume } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { createResume, isGenerating, error } = useResume();
const { token, logout } = useAuth();
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
    <main className="flex-1 flex flex-col">
      <header className="glass-card-strong sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text-subtle">
            ✦ Resume Builder
          </Link>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm btn-primary"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl animate-fade-in-up">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="gradient-text">Build a beautiful resume</span>
              <br />
              <span className="text-slate-800">with AI</span>
            </h1>
            <p className="mt-3 text-slate-500 text-lg leading-relaxed max-w-lg mx-auto">
              Describe your experience or upload an existing resume. Our AI will
              design a professional PDF in seconds.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 animate-slide-down">
              {error}
            </div>
          )}

          <div className="glass-card-strong rounded-2xl p-8 space-y-6">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              isLoading={isGenerating}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/50 backdrop-blur px-3 text-slate-400 font-medium">or</span>
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
      </div>
    </main>
  );
}
