"use client";

import { useEffect, useState, use, useRef, useCallback } from "react";
import Link from "next/link";
import { api, Resume } from "@/lib/api";
import RefinementChat from "@/components/RefinementChat";
import Layout from "@/components/Layout";

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
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const stopPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const loadResume = useCallback(async (id: string) => {
    for (let i = 0; i < 3; i++) {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/resumes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          setResume(data);
          return data;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }
    return null;
  }, []);

  const loadHTML = useCallback(async (id: string) => {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/resumes/${id}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (resp.ok) {
        const text = await resp.text();
        setHtmlContent(text);
      }
    } catch {}
  }, []);

  const pollStatus = useCallback((id: string) => {
    return loadResume(id).then((r) => {
      if (!r) return;
      if (r.status === "completed") {
        stopPoll();
        setIsGenerating(false);
        loadHTML(id).finally(() => setLoading(false));
      } else if (r.status === "failed") {
        stopPoll();
        setIsGenerating(false);
        setLoading(false);
        setError("Resume generation failed");
      }
    });
  }, [loadResume, loadHTML, stopPoll]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await loadResume(resumeId);
        if (cancelled) return;
        if (r.status === "completed") {
          setIsGenerating(false);
          loadHTML(resumeId).finally(() => setLoading(false));
        } else if (r.status === "generating") {
          setIsGenerating(true);
          pollRef.current = setInterval(() => pollStatus(resumeId), 3000);
        } else {
          setIsGenerating(false);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
          setIsGenerating(false);
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; stopPoll(); };
  }, [resumeId, loadResume, loadHTML, pollStatus, stopPoll]);

  const handleRefine = async (prompt: string, photo?: File | null) => {
    const userMsg: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setLoading(true);
    setError(null);
    try {
      await api.resumes.refine(resumeId, prompt, photo);
      stopPoll();
      pollRef.current = setInterval(() => pollStatus(resumeId), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refinement failed");
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleAccept = () => { stopPoll(); setIsAccepted(true); };

  const handleDownload = () => {
    if (!htmlContent) return;
    const printFrame = (win: Window, doc: Document) => {
      // Inject print-critical CSS that browsers strip by default.
      // Without this, colored headers, sidebars, gradients and accents all become white.
      const style = doc.createElement("style");
      style.textContent = `
        @page { margin: 10mm; size: A4; }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
          }
          /* Let sections flow across pages naturally. */
          /* Only keep individual entries together so a job bullet doesn't split mid-way. */
          .resume-entry, .resume-item, .job, .education-item, .project-item, li {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          h1, h2, h3, h4, h5, h6 {
            break-after: avoid;
            page-break-after: avoid;
          }
        }
      `;
      doc.head.appendChild(style);

      const doPrint = () => {
        win.focus();
        win.print();
      };

      // Wait for fonts (Google Fonts etc.) to finish loading before printing.
      // Otherwise headings may fall back to browser defaults and look wrong.
      if (doc.fonts?.ready) {
        doc.fonts.ready.then(doPrint);
      } else {
        // Small delay as fallback for environments without FontFaceSet
        setTimeout(doPrint, 500);
      }
    };

    // Best path: use the already-rendered iframe (fonts already loaded, DOM settled).
    const iframe = iframeRef.current;
    if (iframe?.contentWindow && iframe?.contentDocument) {
      printFrame(iframe.contentWindow, iframe.contentDocument);
      return;
    }

    // Fallback (e.g. accepted screen with no iframe): open in a new window and print.
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to download your resume as PDF.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    if (printWindow.document.readyState === "complete") {
      printFrame(printWindow, printWindow.document);
    } else {
      printWindow.onload = () => printFrame(printWindow, printWindow.document);
    }
    printWindow.onafterprint = () => printWindow.close();
  };

  if (isAccepted) {
    return (
      <Layout>
        <div className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-sm text-accent hover:text-accent-hover transition-colors font-medium">← Back to Dashboard</Link>
        </div>
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
              <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-ink-primary">Resume Accepted!</h1>
            <p className="mt-2 text-ink-secondary">Your resume is ready. Download or return to Dashboard anytime.</p>
            <div className="mt-8 flex gap-3 justify-center">
              <button onClick={handleDownload} className="btn-primary text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </span>
              </button>
              <Link href="/dashboard" className="rounded-xl border border-border bg-surface/80 backdrop-blur px-5 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface hover:shadow-md transition-all">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1">
      <div className="max-w-[90rem] mx-auto px-6 py-4">
        <Link href="/dashboard" className="text-sm text-accent hover:text-accent-hover transition-colors font-medium">← Back to Dashboard</Link>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display text-ink-primary">{resume?.title || "Preview"}</h2>
            {htmlContent && (
              <button onClick={handleDownload} className="rounded-xl bg-success text-white px-4 py-2 text-sm font-medium hover:bg-success/90 transition-all hover:shadow-lg hover:shadow-success/25 active:scale-95">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </span>
              </button>
            )}
          </div>

          {loading || isGenerating ? (
            <div className="flex items-center justify-center h-[800px] card rounded-2xl">
              <div className="text-center animate-fade-in">
                <div className="relative mx-auto w-16 h-16">
                  <svg className="animate-spin h-16 w-16 text-accent" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-ink-secondary">
                  {isGenerating ? "Designing your resume..." : "Loading preview..."}
                </p>
                <div className="mt-4 flex justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent/50 animate-pulse" style={{animationDelay: "0s"}} />
                  <div className="w-2 h-2 rounded-full bg-accent/50 animate-pulse" style={{animationDelay: "0.15s"}} />
                  <div className="w-2 h-2 rounded-full bg-accent/50 animate-pulse" style={{animationDelay: "0.3s"}} />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[800px] bg-error/10 rounded-2xl border border-error/20">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-error/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-error font-medium">{error}</p>
              </div>
            </div>
          ) : htmlContent ? (
            <iframe ref={iframeRef} srcDoc={htmlContent} className="w-full h-[800px] rounded-2xl border border-border bg-surface shadow-sm" title="Resume Preview" />
          ) : (
            <div className="flex items-center justify-center h-[800px] card rounded-2xl">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-ink-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-ink-muted font-medium">Preview will appear here</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-96 shrink-0">
          <RefinementChat messages={messages} onSend={handleRefine} isLoading={isGenerating} onAccept={handleAccept} />
        </div>
      </div>
      </div>
    </Layout>
  );
}
