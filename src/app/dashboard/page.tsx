"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useResume } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";
import ResumeCard from "@/components/ResumeCard";
import { Resume } from "@/lib/api";

export default function DashboardPage() {
  const { resumes, loadResumes, error } = useResume();
  const { token, isLoading: authLoading } = useAuth();
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
        <div className="text-center animate-fade-in">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-3 text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center animate-fade-in-up">
          <div className="glass-card rounded-2xl p-10 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sign in to view your resumes</h2>
            <p className="text-sm text-slate-500 mb-6">Track, refine, and download your AI-crafted resumes in one place.</p>
            <Link href="/login" className="btn-primary inline-block text-sm px-8 py-3">
              Sign in
            </Link>
            <p className="mt-4 text-xs text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-indigo-500 hover:text-indigo-600 font-medium">Sign up</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Resumes</h1>
            <p className="text-sm text-slate-400 mt-1">{resumes.length} resume{resumes.length !== 1 ? "s" : ""} created</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 animate-slide-down">
            {error}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 mb-6">
              <svg className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No resumes yet</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              Describe your experience or upload an existing resume and let AI craft a beautiful, professional design.
            </p>
            <Link
              href="/"
              className="btn-primary inline-block text-sm px-8 py-3"
            >
              Create your first resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
