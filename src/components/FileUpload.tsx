"use client";

import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  files: File[];
}

export default function FileUpload({ onFilesSelected, files }: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesSelected,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="w-full">
      {/* Resume file upload */}
      <div
        {...getRootProps()}
        className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-indigo-400 bg-indigo-50/80 scale-[1.02] shadow-lg shadow-indigo-500/10"
            : "border-slate-200 hover:border-indigo-300 hover:bg-white/80 hover:shadow-md"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="absolute inset-0 border-2 border-indigo-400 rounded-xl animate-pulse" />
        )}
        <div className={`transition-transform duration-300 ${isDragActive ? "scale-110" : ""}`}>
          <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-3 text-sm font-medium text-slate-600">
            {isDragActive
              ? "Drop your files here"
              : "Drag & drop your resume files, or click to browse"}
          </p>
          <p className="text-xs text-slate-400 mt-1">PDF or Word (.docx) up to 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2 mt-4 animate-fade-in">
          {files.map((file, i) => (
            <li key={i} className="flex items-center justify-between text-sm bg-white/80 backdrop-blur rounded-xl px-4 py-3 border border-slate-100 shadow-sm">
              <span className="text-slate-700 truncate font-medium">{file.name}</span>
              <button
                onClick={() => onFilesSelected(files.filter((_, j) => j !== i))}
                className="text-slate-400 hover:text-rose-500 ml-2 shrink-0 transition-colors text-xs font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
