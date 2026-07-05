"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PromptInput from "@/components/PromptInput";
import FileUpload from "@/components/FileUpload";
import HeroSection from "@/components/HeroSection";
import { useResume } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI-Powered",
    description: "Describe your experience in plain language and let AI craft a professional resume tailored to your strengths.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Beautiful Templates",
    description: "Get a clean, modern, ATS-friendly resume design that stands out without looking generic.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    ),
    title: "Iterate & Refine",
    description: "Chat with AI to refine every section. Tweak wording, reorder experience, and perfect your story.",
  },
];

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
      <HeroSection />

      {/* ── Features Section ── */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800">Why use Resume Builder?</h2>
            <p className="mt-2 text-slate-500">Everything you need to land more interviews</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {features.map((feature, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Builder Section ── */}
      <section id="builder" className="py-8 pb-20">
        <div className="max-w-2xl mx-auto px-6">
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
      </section>
    </main>
  );
}
