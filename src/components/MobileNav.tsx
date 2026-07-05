"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { token, logout } = useAuth();
  const router = useRouter();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close on resize to desktop
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) onClose();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  const handleNav = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-ink-secondary hover:text-ink-primary transition-colors"
          aria-label="Close navigation"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-10">
          <Logo size="lg" />

          <nav className="flex flex-col items-center gap-6 text-xl text-ink-secondary">
            <button
              onClick={() => handleNav("/")}
              className="hover:text-ink-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNav("/dashboard")}
              className="hover:text-ink-primary transition-colors"
            >
              Dashboard
            </button>
            {token ? (
              <button
                onClick={handleLogout}
                className="hover:text-ink-primary transition-colors"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => handleNav("/login")}
                className="hover:text-ink-primary transition-colors"
              >
                Sign In
              </button>
            )}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
