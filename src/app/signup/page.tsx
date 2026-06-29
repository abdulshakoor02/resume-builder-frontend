"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (email: string, password: string) => {
    setError(null);
    try {
      await signup(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <AuthForm mode="signup" onSubmit={handleSignup} error={error} />
    </main>
  );
}
