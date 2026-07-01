"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface Message {
  role: "user" | "assistant";
  content: string;
  pdfUrl?: string;
}

interface RefinementChatProps {
  messages: Message[];
  onSend: (prompt: string, photo?: File | null) => void;
  isLoading: boolean;
  onAccept: () => void;
}

export default function RefinementChat({ messages, onSend, isLoading, onAccept }: RefinementChatProps) {
  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted: File[]) => {
      if (accepted.length > 0) setPhoto(accepted[0]);
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
  });

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim(), photo);
    setInput("");
    setPhoto(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            Ask for changes to refine your resume. For example: "Make the header bolder" or "Add a skills section"
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p>{msg.content}</p>
              {msg.pdfUrl && (
                <p className="text-xs mt-1 opacity-75">New PDF generated ✓</p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Photo upload area */}
      {photo && (
        <div className="border-t border-gray-200 px-4 pt-3">
          <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <img
              src={URL.createObjectURL(photo)}
              alt="Profile preview"
              className="w-12 h-12 rounded-full object-cover border border-blue-300"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-700 truncate">{photo.name}</p>
              <p className="text-xs text-blue-500">Will be added to your resume</p>
            </div>
            <button
              onClick={() => setPhoto(null)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type refinement instructions..."
            rows={2}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none disabled:opacity-50"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Send"
              )}
            </button>
            <button
              onClick={onAccept}
              disabled={isLoading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-1 text-xs text-gray-500">Add profile photo (JPG, PNG, WebP up to 2MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
