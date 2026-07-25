"use client";

import { useState, useEffect, useCallback } from "react";
import { api, UsageResponse } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useUsage() {
  const { token } = useAuth();
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsage = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.usage.get();
      setUsage(data);
    } catch {
      // Silently fail — usage banner just won't show
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { usage, loading, refetch: fetchUsage };
}
