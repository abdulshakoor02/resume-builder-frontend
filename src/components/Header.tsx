"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { token, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas border-b border-border">
        <div className="section-container flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors font-medium">
              Home
            </Link>
            {token ? (
              <>
                <Link href="/dashboard" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors font-medium">
                  Dashboard
                </Link>
                <button onClick={logout} className="text-sm text-ink-muted hover:text-ink-primary transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-ink-secondary hover:text-ink-primary transition-colors"
            aria-label="Open navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
