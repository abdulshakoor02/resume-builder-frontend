"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useResume } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";
import ResumeCard from "@/components/ResumeCard";
import { Resume } from "@/lib/api";

export default function DashboardPage() {
  const { resumes, loadResumes, error } = useResume();
  const { token, isLoading: authLoading, logout } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (token && !loaded) {
      loadResumes();
      setLoaded(true);
    }
  }, [token, loaded, loadResumes]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-3 text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center animate-fade-in-up">
          <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <p className="text-slate-600 mb-4 font-medium">Sign in to view your resumes</p>
          <Link href="/login" className="btn-primary inline-block text-sm">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <header className="glass-card-strong sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text-subtle">
            ✦ Resume Builder
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="text-sm text-slate-400 hover:text-rose-500 transition-colors font-medium"
            >
              Log out
            </button>
            <Link
              href="/"
              className="btn-primary text-sm"
            >
              ✦ New Resume
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Your Resumes</h1>
          <p className="text-sm text-slate-400">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 animate-slide-down">
            {error}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
              <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No resumes yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-5">Create your first AI-powered resume</p>
            <Link
              href="/"
              className="btn-primary inline-block text-sm"
            >
              Create your first resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
