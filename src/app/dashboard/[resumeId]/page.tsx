"use client";

import { useEffect, useState, use, useRef, useCallback } from "react";
import Link from "next/link";
import { api, Resume } from "@/lib/api";
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

  const handleRefine = async (prompt: string) => {
    const userMsg: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setLoading(true);
    setError(null);
    try {
      await api.resumes.refine(resumeId, prompt);
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
          /* Avoid splitting sections across pages */
          section, .section, .resume-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          h1, h2, h3, h4 {
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
      <main className="flex-1">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Resume Accepted!</h1>
          <p className="mt-2 text-gray-500">Your resume is ready. Download or return to Dashboard anytime.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={handleDownload} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Download HTML
            </button>
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
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </header>

      <div className="max-w-[90rem] mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">{resume?.title || "Preview"}</h2>
            {htmlContent && (
              <button onClick={handleDownload} className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">
                Download PDF
              </button>
            )}
          </div>

          {loading || isGenerating ? (
            <div className="flex items-center justify-center h-[800px] bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="mt-3 text-sm text-gray-500">
                  {isGenerating ? "Designing your resume..." : "Loading preview..."}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[800px] bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          ) : htmlContent ? (
            <iframe ref={iframeRef} srcDoc={htmlContent} className="w-full h-[800px] rounded-lg border border-gray-200 bg-white" title="Resume Preview" />
          ) : (
            <div className="flex items-center justify-center h-[800px] bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-400">Preview will appear here</p>
            </div>
          )}
        </div>

        <div className="w-96 shrink-0">
          <RefinementChat messages={messages} onSend={handleRefine} isLoading={isGenerating} onAccept={handleAccept} />
        </div>
      </div>
    </main>
  );
}
