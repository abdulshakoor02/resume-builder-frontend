"use client";

import { useEffect, useState } from "react";

interface PdfPreviewProps {
  pdfBlob: Blob | null;
  pdfUrl?: string;
  isLoading: boolean;
  error: string | null;
}

export default function PdfPreview({ pdfBlob, pdfUrl, isLoading, error }: PdfPreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfBlob]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="mt-3 text-sm text-gray-500">Generating your resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <svg className="mx-auto h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="mt-3 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (pdfUrl) {
    return (
      <iframe
        src={pdfUrl}
        className="w-full h-[600px] rounded-lg border border-gray-200"
        title="Resume PDF Preview"
      />
    );
  }

  if (objectUrl) {
    return (
      <iframe
        src={objectUrl}
        className="w-full h-[600px] rounded-lg border border-gray-200"
        title="Resume PDF Preview"
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-400">Your resume preview will appear here</p>
    </div>
  );
}
