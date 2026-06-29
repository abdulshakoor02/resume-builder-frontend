"use client";

import { useEffect, useRef, useCallback } from "react";

interface SSEMessage {
  type: string;
  resume_id: string;
  status?: "generating" | "completed" | "failed";
  message?: string;
  pdf_path?: string;
}

interface UseSSEOptions {
  resumeId: string | null;
  onStatusChange: (status: string, message?: string, pdfPath?: string) => void;
}

export function useSSE({ resumeId, onStatusChange }: UseSSEOptions) {
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  const connect = useCallback((id: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${backendUrl}/api/sse?resume_id=${id}`;
    const source = new EventSource(url);

    source.onmessage = (event) => {
      try {
        const msg: SSEMessage = JSON.parse(event.data);
        if (msg.type === "status") {
          onStatusChangeRef.current(msg.status || "", msg.message, msg.pdf_path);
        }
      } catch {
        // ignore
      }
    };

    source.onerror = () => {
      // EventSource auto-reconnects
    };

    return source;
  }, []);

  return { connect };
}
