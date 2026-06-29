"use client";

import { useEffect, useState, use, useRef, useCallback } from "react";
import Link from "next/link";
import { api, Resume } from "@/lib/api";
import PdfPreview from "@/components/PdfPreview";
import RefinementChat from "@/components/RefinementChat";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = use(params);
  const [resume, setResume] = useState<Resume | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAccepted, setIsAccepted] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const loadPdf = useCallback(async (id: string) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const blob = await api.resumes.pdf(id);
        setPdfBlob(blob);
        return;
      } catch {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }, []);

  const pollStatus = useCallback((id: string) => {
    return api.resumes.get(id).then((r) => {
      setResume(r);
      if (r.status === "completed") {
        stopPoll();
        setIsGenerating(false);
        setPdfLoading(true);
        loadPdf(id).finally(() => setPdfLoading(false));
      } else if (r.status === "failed") {
        stopPoll();
        setIsGenerating(false);
        setPdfLoading(false);
        setError("Resume generation failed");
      }
    }).catch(() => {
      // ignore poll errors, will retry
    });
  }, [stopPoll, loadPdf]);

  // Initial load + start polling if generating
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const r = await api.resumes.get(resumeId);
        if (cancelled) return;
        setResume(r);

        if (r.status === "completed") {
          setIsGenerating(false);
          loadPdf(resumeId).finally(() => setPdfLoading(false));
        } else if (r.status === "generating") {
          setIsGenerating(true);
          setPdfLoading(true);
          pollRef.current = setInterval(() => pollStatus(resumeId), 3000);
        } else {
          setIsGenerating(false);
          setPdfLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load resume");
          setIsGenerating(false);
          setPdfLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      stopPoll();
    };
  }, [resumeId, loadPdf, pollStatus, stopPoll]);

  const handleRefine = async (prompt: string) => {
    const userMsg: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setPdfLoading(true);
    setError(null);

    try {
      await api.resumes.refine(resumeId, prompt);
      stopPoll();
      pollRef.current = setInterval(() => pollStatus(resumeId), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refinement failed");
      setIsGenerating(false);
      setPdfLoading(false);
    }
  };

  const handleAccept = () => {
    stopPoll();
    setIsAccepted(true);
  };

  if (isAccepted) {
    return (
      <main className="flex-1">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Resume Accepted!</h1>
          <p className="mt-2 text-gray-500">Your resume is ready. Download it anytime from your dashboard.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <a href={pdfBlob ? URL.createObjectURL(pdfBlob) : resume?.current_pdf_url || "#"} download="resume.pdf" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Download PDF
            </a>
            <Link href="/dashboard" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-[90rem] mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {resume?.title || "Preview"}
          </h2>
          <PdfPreview
            pdfBlob={pdfBlob}
            pdfUrl={resume?.current_pdf_url}
            isLoading={pdfLoading || isGenerating}
            error={error}
          />
        </div>

        <div className="w-96 shrink-0">
          <RefinementChat
            messages={messages}
            onSend={handleRefine}
            isLoading={isGenerating}
            onAccept={handleAccept}
          />
        </div>
      </div>
    </main>
  );
}
