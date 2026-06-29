"use client";

import { useEffect, useRef, useCallback } from "react";

interface WSMessage {
  type: string;
  resume_id: string;
  status?: "generating" | "completed" | "failed";
  message?: string;
  pdf_path?: string;
}

interface UseWebSocketOptions {
  resumeId: string | null;
  onStatusChange: (status: string, message?: string, pdfPath?: string) => void;
}

export function useWebSocket({ resumeId, onStatusChange }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    if (!resumeId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(`${wsUrl}/api/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", resume_id: resumeId }));
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        if (msg.type === "status") {
          onStatusChangeRef.current(msg.status || "", msg.message, msg.pdf_path);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      // Silent fail — fallback to polling will handle it
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", resume_id: resumeId }));
      }
      ws.close();
    };
  }, [resumeId]);
}
