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
    <main className="flex-1 flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Resume Builder
          </Link>
          <div className="flex items-center gap-4">
            {token ? (
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Build a beautiful resume with AI
            </h1>
            <p className="mt-2 text-gray-500">
              Describe your experience or upload an existing resume. Our AI will
              design a professional PDF.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              isLoading={isGenerating}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-50 px-2 text-gray-400">or</span>
              </div>
            </div>

            <FileUpload onFilesSelected={handleFilesSelected} files={files} />

            {files.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? "Generating..." : "Build Resume from Uploads"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
