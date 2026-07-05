"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <h1 className="text-[8rem] sm:text-[10rem] font-display text-accent leading-none mb-2">
        404
      </h1>
      <p className="text-xl font-medium text-ink-secondary mb-2">
        Page not found
      </p>
      <p className="text-sm text-ink-muted text-center max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
