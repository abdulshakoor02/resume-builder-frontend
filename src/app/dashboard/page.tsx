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
        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Sign in to view your resumes</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Resume Builder
          </Link>
          <Link
            href="/"
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
          >
            New Resume
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Resumes</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-3 text-gray-500">No resumes yet</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-blue-600 hover:underline"
            >
              Create your first resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
