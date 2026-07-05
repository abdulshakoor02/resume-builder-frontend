import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-canvas">
      <div className="section-container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Logo size="sm" />
            <p className="text-sm text-ink-muted max-w-xs">
              AI-powered resumes that get you hired.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-ink-muted">
              Product
            </h4>
            <nav className="flex flex-col gap-2">
              <a href="/" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors">
                Home
              </a>
              <a href="#features" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors">
                Features
              </a>
              <a href="/dashboard" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors">
                Dashboard
              </a>
            </nav>
          </div>

          {/* Company links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-ink-muted">
              Company
            </h4>
            <nav className="flex flex-col gap-2">
              <a
                href="https://wethinkdigital.solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-secondary hover:text-ink-primary transition-colors"
              >
                Powered by WeThinkDigital
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-muted">
            &copy; {year} WeThinkDigital Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
