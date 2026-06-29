"use client";

import Link from "next/link";
import { Resume } from "@/lib/api";

interface ResumeCardProps {
  resume: Resume;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  const statusColor = {
    draft: "bg-gray-100 text-gray-600",
    generating: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <Link
      href={`/dashboard/${resume.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{resume.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(resume.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[resume.status]}`}>
          {resume.status}
        </span>
      </div>
      {resume.revisions && resume.revisions.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          {resume.revisions.length} revision{resume.revisions.length > 1 ? "s" : ""}
        </p>
      )}
    </Link>
  );
}
