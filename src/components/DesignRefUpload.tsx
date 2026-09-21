"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DesignRefUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

// Mirrors the server-side cap (handler.maxDesignRefBytes).
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Optional design-reference image: a resume design the user wants reproduced.
 * It is sent to the model as an image alongside the text prompt, so it changes
 * the *look* of the generated resume, never its content. Omitting it leaves the
 * existing behaviour untouched, which is why the empty state says so.
 */
export default function DesignRefUpload({ file, onChange }: DesignRefUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Object URLs must be revoked or the browser holds the blob for the session.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: MAX_BYTES,
    onDrop: (accepted, rejections) => {
      setLocalError(null);
      if (rejections.length > 0) {
        setLocalError("Design reference must be a PNG, JPG or WebP image up to 5MB.");
        return;
      }
      if (accepted[0]) onChange(accepted[0]);
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-medium text-ink-secondary">
          Design reference <span className="text-ink-muted font-normal">(optional)</span>
        </label>
        {file && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-medium text-ink-muted hover:text-error transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {file && preview ? (
        <div className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-border animate-fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Design reference preview"
            className="w-16 h-16 object-cover rounded-lg border border-border shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-primary truncate">{file.name}</p>
            <p className="text-xs text-ink-muted mt-0.5">
              {(file.size / 1024).toFixed(0)} KB · layout, colours and typography will be matched
            </p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative overflow-hidden border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-accent bg-accent/10 scale-[1.02] shadow-lg shadow-accent/10"
              : "border-border hover:border-accent/50 hover:bg-surface hover:shadow-md"
          }`}
        >
          <input {...getInputProps()} />
          <svg className="mx-auto h-7 w-7 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-ink-secondary">
            {isDragActive ? "Drop the reference image here" : "Have a design in mind? Drop it here"}
          </p>
          <p className="text-xs text-ink-muted mt-1">
            PNG, JPG or WebP up to 5MB. The CV is designed to match it. Leave empty and the designer
            picks the layout.
          </p>
        </div>
      )}

      {localError && <p className="mt-2 text-xs text-error">{localError}</p>}
    </div>
  );
}
