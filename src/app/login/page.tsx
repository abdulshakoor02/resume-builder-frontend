"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Layout variant="auth">
      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
        </div>
        <div className="card p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display text-ink-primary">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              Sign in to continue building your resume
            </p>
          </div>
          <AuthForm mode="login" onSubmit={handleLogin} error={error} />
          <p className="mt-6 text-sm text-center text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-accent hover:text-accent-hover transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
