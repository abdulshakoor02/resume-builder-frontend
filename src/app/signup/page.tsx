"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";

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
    <Layout variant="auth">
      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
        </div>
        <div className="card p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display text-ink-primary">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              Start building professional resumes in minutes
            </p>
          </div>
          <AuthForm mode="signup" onSubmit={handleSignup} error={error} />
          <p className="mt-6 text-sm text-center text-ink-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-accent hover:text-accent-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
