"use client";

import { useState } from "react";
import { api, Resume } from "@/lib/api";

export function useResume() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResume = async (formData: FormData) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.resumes.create(formData);
      return res.resume_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create resume");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const loadResumes = async () => {
    setError(null);
    try {
      const res = await api.resumes.list();
      setResumes(res.resumes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes");
    }
  };

  const loadResume = async (id: string) => {
    setError(null);
    try {
      const resume = await api.resumes.get(id);
      setCurrentResume(resume);
      return resume;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resume");
      return null;
    }
  };

  const refineResume = async (id: string, prompt: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.resumes.refine(id, prompt);
      return res.pdf_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refine resume");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getPdfBlob = async (id: string) => {
    try {
      return await api.resumes.pdf(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PDF");
      return null;
    }
  };

  /**
   * Deletes a resume permanently (backend removes its DB rows, stored
   * HTML/PDF objects and uploads). On success the card is dropped from local
   * state; the caller re-reads usage because it counts completed resumes.
   */
  const deleteResume = async (id: string) => {
    setError(null);
    try {
      const res = await api.resumes.remove(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (currentResume?.id === id) setCurrentResume(null);
      return { ok: true as const, filesFailed: res?.files_failed ?? 0 };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resume");
      return { ok: false as const, filesFailed: 0 };
    }
  };

  return {
    resumes,
    currentResume,
    isGenerating,
    error,
    createResume,
    loadResumes,
    loadResume,
    refineResume,
    deleteResume,
    getPdfBlob,
  };
}
