"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useResume } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import ResumeCard from "@/components/ResumeCard";
import UsageBanner from "@/components/UsageBanner";
import Layout from "@/components/Layout";
import { Resume } from "@/lib/api";

export default function DashboardPage() {
  const { resumes, loadResumes, error } = useResume();
  const { token, isLoading: authLoading } = useAuth();
  const { usage } = useUsage();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (token && !loaded) {
      loadResumes();
      setLoaded(true);
    }
  }, [token, loaded, loadResumes]);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center animate-fade-in">
            <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
            <p className="mt-3 text-sm text-ink-muted">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!token) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="text-center animate-fade-in-up">
            <div className="card p-10 max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-raised mb-5">
                <svg className="h-8 w-8 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-ink-primary mb-2">Sign in to view your resumes</h2>
              <p className="text-sm text-ink-secondary mb-6">Track, refine, and download your AI-crafted resumes in one place.</p>
              <Link href="/login" className="btn-primary inline-block text-sm px-8 py-3">
                Sign in
              </Link>
              <p className="mt-4 text-xs text-ink-muted">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-accent hover:text-accent-hover font-medium">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-ink-primary">Your Resumes</h1>
          <p className="text-sm text-ink-muted mt-1">{resumes.length} resume{resumes.length !== 1 ? "s" : ""} created</p>
        </div>
        <Link href="/" className="btn-primary text-sm">
          ✦ New Resume
        </Link>
      </div>

      {usage && (
        <div className="mb-6 max-w-sm">
          <UsageBanner />
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error">
          {error}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="text-center py-20 card animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/5 mb-6">
            <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-ink-primary mb-2">No resumes yet</h2>
          <p className="text-ink-secondary text-sm max-w-sm mx-auto mb-6">
            Describe your experience or upload an existing resume and let AI craft a beautiful, professional design.
          </p>
          <Link href="/" className="btn-primary inline-block text-sm px-8 py-3">
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
    </Layout>
  );
}
