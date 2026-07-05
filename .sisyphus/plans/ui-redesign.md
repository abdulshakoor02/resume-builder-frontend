# Enterprise UX Redesign — WeThinkDigital Resume Builder

## TL;DR

> **Quick Summary**: Complete UI/UX overhaul transforming the generic starter-template into a Premium & Bold enterprise SaaS application. Full brand identity creation (typographic wordmark, color system, design tokens), dark mode, responsive layout, and professional landing/login/dashboard pages — all using Tailwind CSS v4 with zero new dependencies.
>
> **Deliverables**:
> - Brand identity system (wordmark logo, color palette, typography, design tokens)
> - Dark mode infrastructure (FOUC prevention, theme toggle, CSS variables)
> - Shared `Layout` component (Header, Footer, ThemeProvider) extracted from duplicated code
> - Redesigned landing page (Hero, Features, Social Proof, Builder sections)
> - Redesigned login & signup pages (Premium SaaS auth pattern)
> - Redesigned dashboard pages with new layout applied
> - Responsive mobile navigation (full-screen overlay)
> - Custom 404 page
> - Playwright QA scenarios for all pages, both themes, 5 viewports
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 5 waves
> **Critical Path**: Wave 1 (design tokens + infrastructure) → Wave 2 (shared layout components) → Wave 3 (page redesigns) → Wave 4 (QA) → Wave FINAL (verification)

---

## Context

### Original Request
> "Current app is built functionally all things are good, but design wise I am not happy. The login page could be better, landing page can also be better for customer centric application. Create a plan to redesign this as a professional enterprise application."

### Interview Summary
**Key Discussions**:
- **Target Audience**: Job seekers building professional resumes
- **Style Direction**: Premium & Bold (Superhuman, Arc, Mercury aesthetic)
- **Brand Identity**: Yes — create from scratch under "WeThinkDigital" umbrella, domain: `resume.wethinkdigital.solutions`
- **Scope**: ALL pages — login, signup, landing, dashboard (list + detail)
- **Dark Mode**: Full light/dark mode with system preference detection
- **Mobile**: Equal priority — full responsive across 5 breakpoints
- **Backend**: UNCHANGED — frontend-only redesign, zero API or auth flow changes
- **Testing**: No unit tests — Playwright browser QA scenarios only
- **Dependencies**: Zero new packages — pure Tailwind CSS v4

**Pain Point**: Current app looks like a "generic template" — lacks uniqueness, brand identity, and premium feel.

**Research Findings** (from codebase exploration):
- 17 source files, ~1,300 total lines — small, clean, easy to refactor
- No shared layout components — Header duplicated 3× across pages
- Monolithic 223-line landing page with all sections inline
- 28-line login page wrapping 119-line AuthForm — barebones
- Glassmorphism design (`.glass-card`) used by 7+ components — needs system-wide replacement
- `PdfPreview.tsx` uses `gray-*` colors (inconsistent with system), detail page uses hardcoded colors
- No icon library, no form validation library, no SEO metadata on landing page

### Metis Review
**Identified Gaps** (addressed):
- **Logo Implementation Strategy**: Typographic wordmark using CSS only (Inter + Instrument Serif) — no external image dependency. Brand under "WeThinkDigital" umbrella.
- **Product Name**: "WeThinkDigital Resume" — consistent across logo, metadata, OG tags
- **Font Strategy**: Replace Geist with Inter (body) + Instrument Serif (display) for premium typographic personality
- **No New Dependencies**: All design achievable with Tailwind CSS v4 alone — no framer-motion, shadcn/ui, or lucide-react
- **Auth Page Pattern**: Login/signup pages render WITHOUT shared nav/footer — just centered brand logo + form. This is the Mercury/Arc/Superhuman pattern for focused conversion.
- **Mobile Navigation**: Full-screen overlay with brand logo + nav links + theme toggle — most premium feel, implementable with CSS transitions
- **Dark Mode Architecture**: CSS variables → `@theme inline` mapping → `dark:` utility variants, with FOUC-prevention `<head>` script
- **Glassmorphism Replacement**: New semantic card design token system replacing all `.glass-card` references
- **Color Hardcoding**: `PdfPreview.tsx` gray-* colors and detail page hardcoded bg colors need to use new semantic tokens
- **404 Page**: Custom `not-found.tsx` with brand styling (enterprise apps need this)

---

## Work Objectives

### Core Objective
Transform the resume builder from a generic starter template into a **professional enterprise SaaS application** with a cohesive Premium & Bold brand identity, dark mode, and full responsive design — without adding any new dependencies or changing backend logic.

### Concrete Deliverables
- Rewritten `globals.css` with full Premium & Bold `@theme` design token system + dark mode CSS variables + FOUC script
- `ThemeProvider` React context component
- `Logo` component (typographic wordmark)
- `Header` component (shared, auth-aware, responsive with mobile nav)
- `Footer` component (shared)
- `Layout` component wrapping Header/Footer
- `HeroSection` component (extracted from landing page)
- `FeaturesSection` component (extracted from landing page)
- `BuilderSection` component (extracted from landing page)
- Redesigned `login/page.tsx` (centered-brand auth pattern)
- Redesigned `signup/page.tsx` (centered-brand auth pattern)
- Redesigned `page.tsx` (landing — composed from sections)
- Updated `dashboard/page.tsx` (new layout applied)
- Updated `dashboard/[resumeId]/page.tsx` (new layout applied)
- New `not-found.tsx` (custom 404 with brand styling)
- Playwright QA evidence for all pages

### Definition of Done
- [x] `npm run dev` — app loads without errors
- [x] All 5 pages render correctly in light AND dark mode
- [x] No horizontal scroll at 320px, 375px, 768px, 1024px, 1440px
- [x] Theme toggle works, persists across page refresh, respects system preference on first visit
- [x] Login/signup/create-resume flows work identically to current behavior
- [x] Zero new npm dependencies (verify: `npm ls --depth=0` unchanged)
- [x] Zero changes to `useAuth`, `useResume`, `api.ts`, `useSSE`, `useWebSocket`
- [x] All Playwright QA scenarios pass

### Must Have
- Brand identity: wordmark logo, color palette, typography system, design tokens
- Dark mode with system preference detection and FOUC prevention
- Shared `Layout` component applied via `RootLayout`
- Fully responsive design (320px–1440px+) with proper mobile navigation
- Semantic design tokens (no hardcoded colors, no glass classes)
- Professional landing page with social proof section
- Premium SaaS auth pages (centered logo, no nav distraction)
- Custom 404 page
- OG metadata on landing page

### Must NOT Have (Guardrails)
- **NO new npm packages** — zero additions to `dependencies` or `devDependencies`
- **NO backend changes** — `api.ts`, all endpoint calls, auth flow remain untouched
- **NO hook signature changes** — `useAuth`, `useResume`, `useSSE`, `useWebSocket` unchanged
- **NO auth flow changes** — same localStorage token, same redirects, same error handling
- **NO new routes** — no `/settings`, `/pricing`, `/about`, etc.
- **NO server component conversion** — keep everything client-side for this iteration
- **NO loading skeleton additions** — only style existing loading states, don't add new ones
- **NO password reset, social login, email verification UI** — not supported by backend
- **NO glassmorphism classes** — all `.glass-card`, `.glass-card-strong` references replaced
- **NO hardcoded colors in components** — all colors via semantic Tailwind tokens

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None — browser QA only
- **Framework**: N/A (no unit test setup)
- **Agent-Executed QA**: MANDATORY for all tasks

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Coverage**: All 5 pages × 2 themes (light/dark) × 5 viewports (320/375/768/1024/1440)
- **Regression**: Login flow, signup flow, logout flow, resume creation flow must work identically

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.

```
Wave 1 (Start Immediately — design foundation + infrastructure):
├── Task 1: Design token system + dark mode CSS variables [deep]
├── Task 2: ThemeProvider context + React hook [quick]
├── Task 3: Typographic wordmark Logo component [quick]
├── Task 4: Mobile navigation component (full-screen overlay) [visual-engineering]
├── Task 5: Theme toggle component [visual-engineering]
└── Task 6: FOUC prevention script + metadata update [quick]

Wave 2 (After Wave 1 — shared layout, MAX PARALLEL):
├── Task 7: Header component (auth-aware, responsive) [visual-engineering]
├── Task 8: Footer component [visual-engineering]
├── Task 9: Layout component + RootLayout integration [quick]
├── Task 10: Custom 404 page (not-found.tsx) [visual-engineering]
└── Task 11: Extract HeroSection from landing page [visual-engineering]

Wave 3 (After Wave 2 — page redesigns, MAX PARALLEL):
├── Task 12: Redesigned login page (centered-brand pattern) [visual-engineering]
├── Task 13: Redesigned signup page (centered-brand pattern) [visual-engineering]
├── Task 14: Extract FeaturesSection + SocialProofSection from landing [visual-engineering]
├── Task 15: Extract BuilderSection from landing + compose landing page [visual-engineering]
├── Task 16: Apply Layout + redesign dashboard list page [visual-engineering]
└── Task 17: Apply Layout + redesign dashboard detail page [visual-engineering]

Wave 4 (After Wave 3 — system-wide cleanup + QA):
├── Task 18: Remove all .glass-card references (system-wide audit) [quick]
├── Task 19: Replace hardcoded colors with semantic tokens [quick]
├── Task 20: Playwright QA — landing page (light + dark, 5 viewports) [unspecified-high]
├── Task 21: Playwright QA — login/signup (light + dark, 3 viewports) [unspecified-high]
├── Task 22: Playwright QA — dashboard pages (light + dark, 3 viewports) [unspecified-high]
└── Task 23: Playwright QA — regression (auth flows, resume creation) [unspecified-high]

Wave FINAL (After Wave 4 — 4 parallel reviews, then user okay):
├── Task F1: Plan Compliance Audit (oracle)
├── Task F2: Code Quality Review (unspecified-high)
├── Task F3: Real Manual QA (unspecified-high + playwright)
└── Task F4: Scope Fidelity Check (deep)
→ Present results → Get explicit user okay

Critical Path: Task 1 → Task 6 → Task 9 → Task 12-17 → Task 20-23 → F1-F4 → user okay
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 6 (Waves 2, 3, and 4)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1-6 | — | 7-17, all downstream | 1 |
| 7 | 1-5 | 9, 12-17 | 2 |
| 8 | 1-3 | 9, 14-15 | 2 |
| 9 | 6-8 | 12-17 | 2 |
| 10 | 1-3 | — | 2 |
| 11 | 1-3 | 14-15 | 2 |
| 12 | 7, 9 | 21 | 3 |
| 13 | 7, 9 | 21 | 3 |
| 14 | 8, 9, 11 | 15, 20 | 3 |
| 15 | 9, 14 | 20 | 3 |
| 16 | 7, 9 | 22 | 3 |
| 17 | 7, 9 | 22 | 3 |
| 18 | 1-17 | 20-23 | 4 |
| 19 | 1-17 | 20-23 | 4 |
| 20-23 | 1-19 | F1-F4 | 4 |

### Agent Dispatch Summary

| Wave | Count | Tasks | Profile Mix |
|------|-------|-------|-------------|
| 1 | 6 | T1-T6 | 1×deep, 3×quick, 2×visual-engineering |
| 2 | 5 | T7-T11 | 4×visual-engineering, 1×quick |
| 3 | 6 | T12-T17 | 6×visual-engineering |
| 4 | 6 | T18-T23 | 2×quick, 4×unspecified-high |
| FINAL | 4 | F1-F4 | 1×oracle, 2×unspecified-high, 1×deep |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [x] 1. **Design Token System + Dark Mode CSS Variables**

  **What to do**:
  - Rewrite `src/app/globals.css` from scratch:
    - Remove all `.glass-card`, `.glass-card-strong`, `.gradient-text`, `.gradient-text-subtle`, `.btn-primary`, `.input-glow` classes
    - Define CSS custom properties for light mode: `--color-canvas`, `--color-surface`, `--color-surface-raised`, `--color-ink-primary`, `--color-ink-secondary`, `--color-ink-muted`, `--color-accent`, `--color-accent-hover`, `--color-border`, `--color-error`, `--color-success`
    - Define `.dark` overrides for all CSS custom properties
    - Map all variables into `@theme inline {}` block so Tailwind utilities can reference them: `--color-canvas-*: var(--color-canvas)`, etc.
    - Add `@custom-variant dark (&:where(.dark, .dark *));`
    - Define new semantic utility classes: `.btn-primary` (rebuilt with new tokens), `.btn-secondary`, `.card` (replacing glass-card), `.input-field` (replacing input-glow), `.section-container`, `.badge`
    - Keep only essential animations (fadeInUp, fadeIn) — remove unused ones (pulseGlow, scaleIn, slideDown)
    - Add `@font-face` for Inter (regular 400, medium 500, semibold 600, bold 700) and Instrument Serif (regular 400, italic 400) via Google Fonts `@import` or `next/font` if already configured
  - Color palette design (Premium & Bold):
    - **Canvas**: Dark-indigo (`#14141E` dark) / Warm off-white (`#FBFBF9` light)
    - **Surface**: Charcoal (`#23232E` dark) / Pure white (`#FFFFFF` light)
    - **Surface Raised**: Lighter charcoal (`#2C2C38` dark) / Cool gray (`#F5F5F4` light)
    - **Ink Primary**: Near-white (`#F0EFED` dark) / Warm charcoal (`#1C1B1A` light)
    - **Ink Secondary**: Muted gray (`#98969E` dark) / Warm gray (`#6B6966` light)
    - **Ink Muted**: Dim gray (`#63626B` dark) / Light warm gray (`#A8A6A2` light)
    - **Accent**: Electric indigo (`#5B5AF7` — a single saturated voltage)
    - **Accent Hover**: Brighter indigo (`#6F6EF9`)
    - **Border**: Subtle gray (`#2E2E38` dark) / Warm gray (`#E8E7E3` light)
    - **Error**: Warm red (`#EF4444` both modes)
    - **Success**: Emerald (`#10B981` both modes)
  - Typography tokens:
    - `--font-display`: 'Instrument Serif', serif (hero headings, brand moments)
    - `--font-sans`: 'Inter', system-ui, sans-serif (body, UI)
    - `@theme { --font-display: var(--font-display); --font-sans: var(--font-sans); }`
  - Spacing + radius tokens:
    - Standard radius: `0.5rem` (cards, inputs), subtle radius: `0.25rem` (badges), full radius: `9999px` (buttons)
  - Remove the old `body` gradient background — use `bg-canvas` from tokens

  **Must NOT do**:
  - Don't add `@import url(...)` for Google Fonts — use `next/font` in layout.tsx instead (already configured pattern)
  - Don't remove `@import "tailwindcss"` — it must remain as the first line
  - Don't define colors that aren't mapped into `@theme inline` — they must be usable as Tailwind utilities

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: This is the architectural foundation — every other task depends on getting the token system right. Requires thorough understanding of Tailwind v4's CSS-first approach and dark mode architecture.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Color theory, typography pairing, and design token architecture for Premium & Bold aesthetic
  - **Skills Evaluated but Omitted**:
    - `customize-opencode`: Not relevant — this is application design, not OpenCode config

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-6 — but technically must complete FIRST since all other tasks read globals.css)
  - Note: While in Wave 1, Tasks 2-5 can reference the planned token names before globals.css is finalized if they coordinate
  - **Blocks**: Tasks 7-19 (all UI components read these tokens)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL):
  - `src/app/globals.css` — Current CSS file to fully rewrite (existing 164 lines). Understand current `@theme`, animations, and utility classes that need replacement.
  - `src/app/layout.tsx` — Current font imports (Geist via `next/font`). Replace with Inter + Instrument Serif.
  - `node_modules/next/dist/docs/` — Next.js documentation (as noted in AGENTS.md rules — check for any breaking changes)
  - Tailwind CSS v4 official docs: `@theme inline` directive — Maps CSS variables to Tailwind utilities so `bg-canvas` works as a class name.

  **Why Each Reference Matters**:
  - `globals.css`: Must understand what to REMOVE (glass classes, old animations) and what to REPURPOSE (fadeInUp, skeleton)
  - `layout.tsx`: Font imports happen here via `next/font/google` — need to swap Geist for Inter + Instrument Serif
  - Tailwind v4 `@theme inline`: Critical pattern — without this, CSS variables won't work as Tailwind utility classes

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: CSS variables resolve correctly in light mode
    Tool: Playwright
    Preconditions: App loaded without `.dark` class on html element
    Steps:
      1. Navigate to http://localhost:3000
      2. Evaluate JS: getComputedStyle(document.documentElement).getPropertyValue('--color-canvas')
      3. Assert returned value is light mode canvas (should NOT be #14141E)
    Expected Result: CSS variable returns light mode value, background is warm off-white
    Failure Indicators: Dark mode colors in light mode, undefined variables, or 404
    Evidence: .sisyphus/evidence/task-1-tokens-light.png (screenshot)

  Scenario: CSS variables switch correctly in dark mode
    Tool: Playwright
    Preconditions: App loaded with `.dark` class on html element
    Steps:
      1. Navigate to http://localhost:3000
      2. Evaluate JS: document.documentElement.classList.add('dark')
      3. Evaluate JS: getComputedStyle(document.documentElement).getPropertyValue('--color-canvas')
      4. Assert returned value is #14141E (dark-indigo)
    Expected Result: All dark mode CSS variables resolve correctly
    Failure Indicators: Light mode colors leaking into dark mode
    Evidence: .sisyphus/evidence/task-1-tokens-dark.png (screenshot)

  Scenario: Tailwind utilities resolve from theme tokens
    Tool: Bash
    Preconditions: globals.css rewritten with @theme inline
    Steps:
      1. Run: grep -c '@theme inline' src/app/globals.css
      2. Assert: output is >= 1
      3. Run: grep '--color-canvas' src/app/globals.css
      4. Assert: both :root and .dark definitions exist
    Expected Result: @theme inline block maps all CSS variables
    Failure Indicators: Missing @theme inline, missing dark mode definitions
    Evidence: .sisyphus/evidence/task-1-theme-verification.txt (grep output)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of light mode rendering
  - [ ] Screenshot of dark mode rendering
  - [ ] grep output confirming @theme inline structure

  **Commit**: YES (groups with Tasks 2-6)
  - Message: `feat(design): add Premium & Bold design token system with dark mode`
  - Files: `src/app/globals.css`, `src/app/layout.tsx`

---

- [x] 2. **ThemeProvider Context + React Hook**

  **What to do**:
  - Create `src/components/ThemeProvider.tsx`:
    - React context: `ThemeContext` with `{ theme: 'light' | 'dark' | 'system', resolvedTheme: 'light' | 'dark', setTheme: (t) => void, toggleTheme: () => void }`
    - On mount: read `localStorage.getItem('theme')`, fallback to `'system'`
    - Resolve system preference: `window.matchMedia('(prefers-color-scheme: dark)')`
    - Apply `.dark` class to `document.documentElement` based on resolved theme
    - Listen for `matchMedia` changes when theme is 'system'
    - Persist to `localStorage.setItem('theme', value)` on change
    - Export `useTheme()` hook
    - Wrap children with `ThemeContext.Provider`
  - Wrap app in `layout.tsx`: `<ThemeProvider><AuthProvider>{children}</AuthProvider></ThemeProvider>`

  **Must NOT do**:
  - Don't use cookies for theme (complexity not needed)
  - Don't import from `useAuth` or any other hook
  - Don't trigger unnecessary re-renders — use `useCallback` for setTheme/toggleTheme

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard React context pattern — single file, well-understood state management
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 3-6)
  - **Blocks**: Tasks 5 (ThemeToggle), 7 (Header), 9 (Layout)
  - **Blocked By**: None (can start immediately — just needs agreement on context shape)

  **References**:
  - `src/hooks/useAuth.tsx` — Existing context pattern to follow (AuthProvider structure, export pattern). Same pattern: create context, provider wraps children, export hook.
  - `src/app/layout.tsx` — Where ThemeProvider will be inserted (wrap around AuthProvider).

  **Acceptance Criteria**:
  - [ ] `ThemeProvider` wraps app in layout.tsx
  - [ ] `useTheme()` returns `{ theme, resolvedTheme, setTheme, toggleTheme }`
  - [ ] Theme persists across page refresh (localStorage)
  - [ ] System preference respected on first visit (no stored theme)
  - [ ] `matchMedia` listener fired when OS theme changes and theme === 'system'

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Theme persists across page refresh
    Tool: Playwright
    Preconditions: localStorage has theme='dark'
    Steps:
      1. Set localStorage: localStorage.setItem('theme', 'dark')
      2. Navigate to http://localhost:3000
      3. Assert document.documentElement.classList.contains('dark') is true
      4. Reload page
      5. Assert document.documentElement.classList.contains('dark') is still true
    Expected Result: Dark mode persists after refresh
    Failure Indicators: Theme resets to light after refresh
    Evidence: .sisyphus/evidence/task-2-persist.png (screenshot)

  Scenario: System preference detected on first visit
    Tool: Playwright
    Preconditions: localStorage cleared, OS set to dark mode
    Steps:
      1. Clear localStorage: localStorage.removeItem('theme')
      2. Emulate colorScheme: 'dark' (Playwright built-in)
      3. Navigate to http://localhost:3000
      4. Assert document.documentElement.classList.contains('dark') is true
    Expected Result: Dark mode activated from system preference
    Failure Indicators: Light mode despite dark system preference
    Evidence: .sisyphus/evidence/task-2-system-pref.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of dark mode persisting after refresh
  - [ ] Screenshot of system preference detection

  **Commit**: YES (groups with Tasks 1, 3-6)
  - Message: `feat(design): add ThemeProvider context with system preference detection`
  - Files: `src/components/ThemeProvider.tsx`, `src/app/layout.tsx`

---

- [x] 3. **Typographic Wordmark Logo Component**

  **What to do**:
  - Create `src/components/Logo.tsx`:
    - Accept optional `size` prop: `'sm' | 'md' | 'lg'` (default `'md'`)
    - Accept optional `href` prop (default `'/'`)
    - Render as `<Link href={href}>` wrapping:
      - Small "wethinkdigital" text in Inter (font-sans), muted ink color, very small (`text-xs tracking-widest uppercase`)
      - Below: "Resume" in Instrument Serif (font-display), larger (`text-2xl` for md), ink-primary color
      - Optional: A subtle geometric accent mark (a small indigo diamond `◆` or dot before "Resume")
    - Sizing map: sm → `text-xl`, md → `text-2xl`, lg → `text-4xl`
    - Responsive: on mobile, the "wethinkdigital" line hides (use `hidden sm:block`)
  - Logo structure (stacked):
    ```
    wethinkdigital
    ◆ Resume
    ```
  - Use semantic tokens: `text-ink-primary`, `text-ink-muted`, `text-accent`

  **Must NOT do**:
  - Don't use an image/icon file — pure CSS typography
  - Don't hardcode colors — use semantic Tailwind tokens from Task 1
  - Don't add complex SVG or animation

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component, typographic layout, straightforward implementation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Typography hierarchy, visual balance for the wordmark design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 4-6)
  - **Blocks**: Tasks 4 (MobileNav), 7 (Header), 8 (Footer), 10 (404), 12-17 (all pages)
  - **Blocked By**: Task 1 (needs token names like `text-ink-primary`)

  **References**:
  - `src/app/page.tsx:72-76` — Current logo markup (`✦ Resume Builder` with `gradient-text-subtle`). Replace this pattern everywhere.
  - `src/app/dashboard/page.tsx` — Dashboard header also has inline logo. Will be replaced by Header component.
  - `src/components/AuthForm.tsx` — AuthForm also has an inline logo link. Replace with Logo component.

  **Acceptance Criteria**:
  - [ ] Logo renders with "wethinkdigital" (small, muted, uppercase) above "◆ Resume" (serif, prominent)
  - [ ] "wethinkdigital" hides on mobile (only "◆ Resume" visible)
  - [ ] Links to `/` by default, accepts custom href
  - [ ] Uses semantic tokens only (no hardcoded colors)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Logo renders correctly at default size
    Tool: Playwright
    Preconditions: App running, light mode
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert text "wethinkdigital" is visible (desktop viewport 1024px)
      3. Assert text "Resume" is visible
      4. Assert text "Resume" uses Instrument Serif font (evaluate JS: getComputedStyle)
    Expected Result: Stacked wordmark with proper typography
    Failure Indicators: Missing text, wrong font-family, missing accent mark
    Evidence: .sisyphus/evidence/task-3-logo-desktop.png (screenshot)

  Scenario: Logo hides sub-brand on mobile
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Set viewport to 375px (iPhone)
      2. Navigate to http://localhost:3000
      3. Assert text "wethinkdigital" is NOT visible
      4. Assert text "Resume" IS visible
    Expected Result: Only "Resume" visible on mobile
    Failure Indicators: wethinkdigital text still visible at 375px
    Evidence: .sisyphus/evidence/task-3-logo-mobile.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of logo on desktop (1024px)
  - [ ] Screenshot of logo on mobile (375px)

  **Commit**: YES (groups with Tasks 1-2, 4-6)
  - Message: `feat(design): add typographic wordmark Logo component`
  - Files: `src/components/Logo.tsx`

---

- [x] 4. **Mobile Navigation Component (Full-Screen Overlay)**

  **What to do**:
  - Create `src/components/MobileNav.tsx`:
    - Props: `isOpen: boolean`, `onClose: () => void`
    - Full-screen overlay: fixed position, inset-0, z-50, canvas background
    - Content (centered, flex-col):
      - Top: Logo component (size `lg`)
      - Middle: Nav links — "Home" (`/`), "Dashboard" (`/dashboard`), "Sign In" (`/login`) or "Log Out" (auth-aware using `useAuth().token`)
      - Bottom: ThemeToggle component
    - Animation: fade + scale entrance/exit using Tailwind transition + opacity
    - Close on: link click, Escape key (`useEffect` with keydown listener), overlay backdrop click (optional, not on content)
    - Focus trap: when open, focus first interactive element
    - Prevent body scroll when open: `document.body.style.overflow = 'hidden'`
    - ARIA: `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`

  **Must NOT do**:
  - Don't import from any UI library
  - Don't use position-based animations (translate from right) — use fade+scale for premium feel
  - Don't forget to restore body scroll on unmount

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component with animation, accessibility requirements, and auth-aware state
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Overlay design, animation smoothness, responsive interaction patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-3, 5-6)
  - **Blocks**: Task 7 (Header uses MobileNav), Task 9 (Layout)
  - **Blocked By**: Task 3 (Logo), Task 5 (ThemeToggle)

  **References**:
  - `src/app/page.tsx:72-100` — Current header nav links (Home, Dashboard, Sign in / Dashboard, Log out). Auth-aware logic to replicate.
  - `src/hooks/useAuth.tsx` — `useAuth()` provides `token`, `logout`. Use to determine auth state for nav links.
  - `src/components/Logo.tsx` — Import and use in overlay header area.

  **Acceptance Criteria**:
  - [ ] Full-screen overlay with fade+scale animation
  - [ ] Nav links match current auth-aware behavior
  - [ ] Escape key closes the overlay
  - [ ] Link click closes overlay and navigates
  - [ ] Body scroll prevented when open, restored when closed
  - [ ] ARIA attributes present (role="dialog", aria-modal)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Mobile nav opens and navigates
    Tool: Playwright
    Preconditions: App running, mobile viewport (375px), logged out
    Steps:
      1. Navigate to http://localhost:3000
      2. Click hamburger button (assert exists first)
      3. Assert overlay is visible (check role="dialog" element)
      4. Assert "Home" link is visible
      5. Assert "Dashboard" link is visible
      6. Assert "Sign In" link is visible
      7. Click "Sign In" link
      8. Assert navigated to /login
      9. Assert overlay is closed
    Expected Result: Nav opens, links work, navigation occurs, overlay closes
    Failure Indicators: Overlay doesn't open, links don't navigate, overlay stays open
    Evidence: .sisyphus/evidence/task-4-nav-open.png (screenshot), .sisyphus/evidence/task-4-nav-navigate.png

  Scenario: Escape key closes mobile nav
    Tool: Playwright
    Preconditions: Mobile nav open
    Steps:
      1. Open mobile nav (click hamburger)
      2. Press Escape key
      3. Assert overlay is NOT visible
      4. Assert body overflow is restored (scrollable)
    Expected Result: Escape closes overlay cleanly
    Failure Indicators: Overlay stays open after Escape
    Evidence: .sisyphus/evidence/task-4-escape-close.png (screenshot after close)

  Scenario: Auth-aware links change after login
    Tool: Playwright
    Preconditions: Logged in (token in localStorage)
    Steps:
      1. Login via API: set localStorage token
      2. Navigate to http://localhost:3000 (mobile viewport)
      3. Open mobile nav
      4. Assert "Log Out" link is visible (not "Sign In")
      5. Click "Log Out"
      6. Assert navigated to /, token removed from localStorage
    Expected Result: Nav reflects logged-in state, logout works
    Failure Indicators: Wrong links shown, logout fails
    Evidence: .sisyphus/evidence/task-4-auth-aware.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of open nav overlay
  - [ ] Screenshot after navigation
  - [ ] Screenshot of auth-aware links

  **Commit**: YES (groups with Tasks 1-3, 5-6)
  - Message: `feat(design): add full-screen mobile navigation overlay`
  - Files: `src/components/MobileNav.tsx`

---

- [x] 5. **Theme Toggle Component**

  **What to do**:
  - Create `src/components/ThemeToggle.tsx`:
    - Accept optional `variant` prop: `'icon' | 'switch'` (default `'icon'`)
    - `'icon'` variant: A button with sun ☀️ / moon 🌙 icon (or SVG) that calls `toggleTheme()`
    - `'switch'` variant: A pill-shaped toggle with sun/moon icons on either side (for settings or mobile nav)
    - Uses `useTheme()` hook — reads `theme` and `resolvedTheme`, calls `toggleTheme()`
    - Hover state: subtle color transition
    - Focus: visible outline ring
    - Transition: smooth icon swap (opacity crossfade or rotate)
    - ARIA: `aria-label="Toggle theme"`, `aria-pressed` for switch variant
  - Icons: Use simple inline SVG paths for sun and moon (no icon library needed)
    - Sun: circle + rays (6-8 lines radiating)
    - Moon: crescent shape (circle with overlapping circle clip)

  **Must NOT do**:
  - Don't use emoji characters for icons — they render inconsistently
  - Don't use `lucide-react` or any icon library
  - Don't add a third variant — keep icon + switch only

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Interactive UI component with animation, accessibility, and multiple visual variants
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Icon design (inline SVG), micro-interactions, toggle UX patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-4, 6)
  - **Blocks**: Tasks 4 (MobileNav), 7 (Header)
  - **Blocked By**: Task 2 (ThemeProvider — needs `useTheme` hook)

  **References**:
  - `src/components/ThemeProvider.tsx` — Created in Task 2. Import `useTheme()` to get `theme`, `resolvedTheme`, `toggleTheme`.
  - `src/components/MobileNav.tsx` — Created in Task 4. Will import ThemeToggle for the bottom section.

  **Acceptance Criteria**:
  - [ ] Icon variant: button with sun/moon SVG that calls toggleTheme
  - [ ] Switch variant: pill toggle with sun/moon icons
  - [ ] Smooth transition between icon states
  - [ ] Focus ring visible for keyboard accessibility
  - [ ] ARIA label present
  - [ ] Actually toggles `.dark` class on document.documentElement

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Theme toggle switches light → dark
    Tool: Playwright
    Preconditions: Light mode, app running
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert .dark class NOT present on html element
      3. Click theme toggle button (find by aria-label="Toggle theme")
      4. Assert .dark class IS present on html element
      5. Assert localStorage.getItem('theme') === 'dark'
    Expected Result: Theme toggles from light to dark, persisted
    Failure Indicators: Class not toggled, localStorage not updated
    Evidence: .sisyphus/evidence/task-5-toggle-light-to-dark.png (before/after screenshots)

  Scenario: Theme toggle switches dark → light
    Tool: Playwright
    Preconditions: Dark mode
    Steps:
      1. Set localStorage.setItem('theme', 'dark')
      2. Navigate to http://localhost:3000
      3. Assert .dark class present
      4. Click theme toggle
      5. Assert .dark class NOT present
      6. Assert localStorage.getItem('theme') === 'light'
    Expected Result: Theme toggles from dark to light
    Failure Indicators: Dark class remains, localStorage unchanged
    Evidence: .sisyphus/evidence/task-5-toggle-dark-to-light.png
  ```

  **Evidence to Capture**:
  - [ ] Before/after screenshots of theme toggle
  - [ ] Evidence of localStorage update

  **Commit**: YES (groups with Tasks 1-4, 6)
  - Message: `feat(design): add ThemeToggle component with icon and switch variants`
  - Files: `src/components/ThemeToggle.tsx`

---

- [x] 6. **FOUC Prevention Script + Metadata Update**

  **What to do**:
  - In `src/app/layout.tsx`:
    - Add an inline `<script>` in `<head>` (before any CSS/body render):
      ```js
      (function() {
        try {
          var theme = localStorage.getItem('theme');
          if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          }
        } catch(e) {}
      })();
      ```
    - This runs BEFORE React hydrates — zero FOUC
    - Use `dangerouslySetInnerHTML` or Next.js `<Script strategy="beforeInteractive">`
  - Update metadata in `layout.tsx`:
    - `title`: "WeThinkDigital Resume — AI-Powered Resume Builder"
    - `description`: "Build professional, ATS-friendly resumes in minutes with AI. Stand out to recruiters with beautifully designed resumes."
    - Add OpenGraph metadata: `og:title`, `og:description`, `og:type: website`
    - Add Twitter card: `twitter:card: summary_large_image`
  - Swap fonts in layout.tsx: Replace `Geist` imports with `Inter` (weights: 400, 500, 600, 700) and `Instrument_Serif` (weights: 400, 400i) from `next/font/google`
    - Inter: `variable: '--font-inter'`
    - Instrument Serif: `variable: '--font-instrument-serif'`
  - Update `body` className to use new font variables: `font-sans` should use Inter variable

  **Must NOT do**:
  - Don't add `<meta>` tags for routes that don't exist (no pricing, no about)
  - Don't use `next/head` — use the metadata export in layout.tsx
  - Don't remove existing favicon or viewport meta tags

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Script injection + metadata update — well-defined, small scope
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-5)
  - **Blocks**: Task 9 (Layout integration — needs fonts and FOUC script ready)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/app/layout.tsx` — Current file. Modify metadata, font imports, add inline script.
  - Tailwind CSS v4 dark mode docs: Confirmed pattern — `@custom-variant dark (&:where(.dark, .dark *))` with inline `<head>` script for FOUC prevention.

  **Acceptance Criteria**:
  - [ ] FOUC script prevents white flash on dark-mode-first loads
  - [ ] Inter and Instrument Serif loaded via next/font/google
  - [ ] Geist imports removed
  - [ ] Metadata includes proper title, description, OG tags

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: No FOUC on dark mode load
    Tool: Playwright
    Preconditions: localStorage set to 'dark'
    Steps:
      1. Set localStorage.setItem('theme', 'dark')
      2. Navigate to http://localhost:3000
      3. Immediately evaluate: document.documentElement.classList.contains('dark') — should be true BEFORE React renders
      4. Take screenshot immediately
      5. Assert background is dark (not white flash)
    Expected Result: Page loads dark immediately, no white flash
    Failure Indicators: White background visible before dark mode kicks in
    Evidence: .sisyphus/evidence/task-6-no-fouc.png (screenshot)

  Scenario: Metadata renders correctly
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to http://localhost:3000
      2. Evaluate: document.title
      3. Assert: title contains "WeThinkDigital Resume"
      4. Evaluate: document.querySelector('meta[name="description"]').content
      5. Assert: description is non-empty and contains "AI-Powered"
    Expected Result: Proper title and meta description
    Failure Indicators: Missing or default Next.js metadata
    Evidence: .sisyphus/evidence/task-6-metadata.png (screenshot of browser tab)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot proving no white flash on dark mode load
  - [ ] Screenshot of browser tab showing new title

  **Commit**: YES (groups with Tasks 1-5)
  - Message: `feat(design): add FOUC prevention, metadata, and premium font stack`
  - Files: `src/app/layout.tsx`

- [x] 7. **Header Component (Auth-Aware, Responsive)**

  **What to do**:
  - Create `src/components/Header.tsx`:
    - Fixed/sticky header, z-40, full width, canvas background with bottom border (`border-b border-border`)
    - Max-width container (`max-w-7xl mx-auto px-4 sm:px-6`)
    - Left: `<Logo />` component
    - Right (desktop): Nav links (auth-aware — from `useAuth().token`) + `<ThemeToggle />`
      - Logged out: "Home", "Sign In" (`/login`), "Get Started" (`/signup` as a primary button)
      - Logged in: "Home", "Dashboard" (`/dashboard`), "Log Out" (calls `logout()`)
    - Right (mobile): Hamburger button (visible `md:hidden`) that opens `<MobileNav />`
    - Desktop nav links hidden on mobile (`hidden md:flex`)
    - All links use `text-ink-secondary hover:text-ink-primary` transition
    - "Get Started" / primary CTA button uses `btn-primary` from design tokens
    - Smooth appearance: no animation on load, just static
  - Replace all inline header code in:
    - `src/app/page.tsx` — remove the inline `<header>` block (lines ~72-100)
    - `src/app/dashboard/page.tsx` — remove the inline `<header>` block
    - `src/app/dashboard/[resumeId]/page.tsx` — remove the inline `<header>` block

  **Must NOT do**:
  - Don't import `useAuth` differently from how it's currently used — same pattern
  - Don't use the old glass-card styling for the header — use `bg-canvas border-b border-border`
  - Don't forget to call `useAuth()` at the top of the component

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Responsive navigation component with state dependencies, conditional rendering, and component composition
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Navigation UX patterns, responsive breakpoint handling, button hierarchy

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-11)
  - **Blocks**: Tasks 9 (Layout), 12-17 (all page redesigns)
  - **Blocked By**: Tasks 1-5 (tokens, ThemeToggle, Logo, MobileNav)

  **References**:
  - `src/app/page.tsx:72-100` — Current landing page header code to extract (links, auth logic, structure)
  - `src/app/dashboard/page.tsx` — Current dashboard header (duplicate pattern). Replace after Header is created.
  - `src/components/Logo.tsx` — Import and use in header left side
  - `src/components/ThemeToggle.tsx` — Import and use in header right side
  - `src/components/MobileNav.tsx` — Import and use for mobile navigation trigger
  - `src/hooks/useAuth.tsx` — Use `token` and `logout` for auth-aware rendering

  **Acceptance Criteria**:
  - [ ] Header renders on all pages (via Layout — implemented in Task 9)
  - [ ] Desktop: logo left, nav links + theme toggle right
  - [ ] Mobile: logo left, hamburger right
  - [ ] Auth-aware links change based on login state
  - [ ] "Log Out" calls `logout()` and redirects
  - [ ] No glass-card styling — uses new semantic tokens

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Header shows correct links when logged out (desktop)
    Tool: Playwright
    Preconditions: Logged out, 1024px viewport
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert: Logo visible (check for text "Resume")
      3. Assert: "Home" link visible
      4. Assert: "Sign In" link visible, href="/login"
      5. Assert: "Get Started" button visible (primary styled)
      6. Assert: Theme toggle visible
    Expected Result: Correct logged-out nav links, theme toggle present
    Failure Indicators: Wrong links, missing theme toggle, broken hrefs
    Evidence: .sisyphus/evidence/task-7-header-logged-out.png (screenshot)

  Scenario: Header shows correct links when logged in (desktop)
    Tool: Playwright
    Preconditions: Logged in, 1024px viewport
    Steps:
      1. Login via localStorage: set token
      2. Navigate to http://localhost:3000
      3. Assert: "Home" link visible
      4. Assert: "Dashboard" link visible, href="/dashboard"
      5. Assert: "Log Out" button visible
      6. Assert: "Sign In" / "Get Started" NOT visible
    Expected Result: Correct logged-in nav links
    Failure Indicators: Logged-out links still showing, missing dashboard link
    Evidence: .sisyphus/evidence/task-7-header-logged-in.png (screenshot)

  Scenario: Mobile hamburger opens MobileNav
    Tool: Playwright
    Preconditions: 375px viewport
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert: Desktop nav links hidden
      3. Assert: Hamburger button visible
      4. Click hamburger
      5. Assert: MobileNav overlay visible (full-screen nav opens)
    Expected Result: Mobile nav triggered from hamburger
    Failure Indicators: Hamburger missing, overlay doesn't open
    Evidence: .sisyphus/evidence/task-7-header-mobile-hamburger.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of header (logged out, desktop)
  - [ ] Screenshot of header (logged in, desktop)
  - [ ] Screenshot of header (mobile with hamburger)

  **Commit**: YES (groups with Tasks 8-11)
  - Message: `feat(design): add shared Header component with responsive auth-aware navigation`
  - Files: `src/components/Header.tsx`

---

- [x] 8. **Footer Component**

  **What to do**:
  - Create `src/components/Footer.tsx`:
    - Full-width, canvas background, top border (`border-t border-border`)
    - Max-width container (`max-w-7xl mx-auto px-4 sm:px-6 py-8`)
    - Three-column grid (stacks on mobile):
      - Column 1: `<Logo />` (size `sm`) + short tagline: "AI-powered resumes that get you hired."
      - Column 2: "Product" links — Home (`/`), Features (anchor `#features`), Dashboard (`/dashboard`)
      - Column 3: "Company" links — "Powered by WeThinkDigital" (link to `https://wethinkdigital.solutions`)
    - Bottom bar: copyright `© {year} WeThinkDigital Solutions. All rights reserved.` + subtle theme toggle (icon variant)
    - All links: `text-ink-muted hover:text-ink-secondary` transition
    - Responsive: columns stack vertically on mobile (`grid-cols-1 sm:grid-cols-3`)
    - Divider between columns on desktop: subtle `border-border` vertical lines

  **Must NOT do**:
  - Don't include social media links unless verified
  - Don't use the old glass-card styling
  - Don't add newsletter signup or any form

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout component with responsive grid, consistent with Premium & Bold aesthetic
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Footer design patterns, typography hierarchy, responsive grid layout

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 9-11)
  - **Blocks**: Tasks 9 (Layout), 14-15 (landing page)
  - **Blocked By**: Task 3 (Logo)

  **References**:
  - `src/components/Logo.tsx` — Import for footer branding (size sm)
  - `src/components/ThemeToggle.tsx` — Import for subtle footer toggle (icon variant)

  **Acceptance Criteria**:
  - [ ] Three-column layout on desktop, stacked on mobile
  - [ ] Logo + tagline in first column
  - [ ] Navigation links in second column
  - [ ] Company link in third column
  - [ ] Copyright bar at bottom with year
  - [ ] All links use semantic tokens

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Footer renders correctly on desktop
    Tool: Playwright
    Preconditions: 1024px viewport
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to bottom
      3. Assert: Three columns visible (grid layout)
      4. Assert: Logo visible in first column
      5. Assert: "Product" heading visible
      6. Assert: "Powered by WeThinkDigital" link visible
      7. Assert: Copyright text contains current year
    Expected Result: Full footer with all sections
    Failure Indicators: Missing columns, broken links, wrong year
    Evidence: .sisyphus/evidence/task-8-footer-desktop.png (screenshot)

  Scenario: Footer stacks on mobile
    Tool: Playwright
    Preconditions: 375px viewport
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to bottom
      3. Assert: Columns stacked vertically (not side by side)
      4. Assert: All content still visible, no horizontal scroll
    Expected Result: Footer content stacks vertically on mobile
    Failure Indicators: Horizontal scroll, cut-off content, columns side by side
    Evidence: .sisyphus/evidence/task-8-footer-mobile.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of footer on desktop
  - [ ] Screenshot of footer on mobile

  **Commit**: YES (groups with Tasks 7, 9-11)
  - Message: `feat(design): add shared Footer component with responsive layout`
  - Files: `src/components/Footer.tsx`

---

- [x] 9. **Layout Component + RootLayout Integration**

  **What to do**:
  - Create `src/components/Layout.tsx`:
    - Accept `children: React.ReactNode`
    - Accept optional `variant` prop: `'default' | 'auth'` (default `'default'`)
    - `'default'`: Render `<Header />` + `<main className="flex-1">{children}</main>` + `<Footer />`
    - `'auth'`: Render ONLY `<div className="flex min-h-screen items-center justify-center">{children}</div>` — no header, no footer (the Premium SaaS auth page pattern)
    - Wrap in a fragment or div with `min-h-screen flex flex-col`
  - Update `src/app/layout.tsx`:
    - Import `Layout` component
    - Wrap children: `<ThemeProvider><AuthProvider><Layout>{children}</Layout></AuthProvider></ThemeProvider>`
    - Remove the `min-h-full flex flex-col` from body className (Layout handles this)
  - Update `src/app/login/page.tsx` and `src/app/signup/page.tsx`:
    - Set `variant="auth"` on Layout (or use a per-page wrapper that skips header/footer)

  **Must NOT do**:
  - Don't remove AuthProvider or ThemeProvider from layout.tsx
  - Don't change body element classes in a way that breaks dark mode
  - Don't add route-specific logic inside Layout — keep it purely layout

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Layout composition — straightforward component integration
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-8, 10-11)
  - **Blocks**: Tasks 12-17 (all page redesigns — they need Layout to be in place)
  - **Blocked By**: Tasks 6 (fonts, FOUC), 7 (Header), 8 (Footer)

  **References**:
  - `src/app/layout.tsx` — Current root layout. Modify to wrap children with Layout component.
  - `src/components/Header.tsx` — Import for default variant
  - `src/components/Footer.tsx` — Import for default variant

  **Acceptance Criteria**:
  - [ ] Default variant: Header + main + Footer structure
  - [ ] Auth variant: centered content only, no navigation
  - [ ] Layout wraps all pages via RootLayout
  - [ ] Dark mode classes still applied correctly to html element

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Default layout shows Header + Footer on landing page
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert: Header visible (Logo + nav links)
      3. Assert: Footer visible (scroll to bottom)
      4. Assert: Main content between Header and Footer
    Expected Result: Full layout structure on landing page
    Failure Indicators: Missing Header, missing Footer, content covered by Header
    Evidence: .sisyphus/evidence/task-9-layout-default.png (screenshot)

  Scenario: Auth layout hides Header + Footer on login page
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to http://localhost:3000/login
      2. Assert: Header NOT visible (no nav links)
      3. Assert: Footer NOT visible
      4. Assert: Content is vertically centered (check flexbox centering)
    Expected Result: Clean auth page with centered content only
    Failure Indicators: Header/Footer visible on login page
    Evidence: .sisyphus/evidence/task-9-layout-auth.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of landing page with full layout
  - [ ] Screenshot of login page with auth layout (no nav/footer)

  **Commit**: YES (groups with Tasks 7-8, 10-11)
  - Message: `feat(design): add Layout component with default and auth variants`
  - Files: `src/components/Layout.tsx`, `src/app/layout.tsx`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`

---

- [x] 10. **Custom 404 Page (not-found.tsx)**

  **What to do**:
  - Create `src/app/not-found.tsx`:
    - Client component (`"use client"` — needed for theme/dark mode)
    - Layout: centered content, full viewport height
    - Large "404" text in Instrument Serif (font-display), accent color, huge size (`text-[10rem]` on desktop, scaling down for mobile)
    - Subtitle: "Page not found" in Inter, ink-secondary
    - Description: "The page you're looking for doesn't exist or has been moved."
    - CTA: "Back to Home" button (`btn-primary`) linking to `/`
    - Subtle decorative element: a few geometric shapes or lines (pure CSS, no images)
    - Uses semantic tokens throughout
    - responsive: 404 text scales from `text-7xl` (mobile) to `text-[10rem]` (desktop)

  **Must NOT do**:
  - Don't use an image/illustration — keep it typographic + geometric
  - Don't use the old glass-card classes

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual design page with typographic emphasis and geometric decoration
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 404 page design patterns, typography as visual anchor, geometric CSS decoration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-9, 11)
  - **Blocks**: None (standalone page — not required by other tasks)
  - **Blocked By**: Task 3 (Logo — optional, can add for branding)

  **References**:
  - `src/components/Logo.tsx` — Optional: add small logo above 404 for brand consistency
  - `src/app/globals.css` — Design tokens (Task 1) — use `text-accent`, `font-display`, etc.

  **Acceptance Criteria**:
  - [ ] 404 page renders for any non-existent route
  - [ ] Large typographic "404" in Instrument Serif
  - [ ] Descriptive text + "Back to Home" CTA
  - [ ] Responsive scaling (mobile → desktop)
  - [ ] Works in both light and dark mode

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: 404 page renders for unknown route
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to http://localhost:3000/nonexistent-page-xyz
      2. Assert: Large "404" text visible
      3. Assert: "Page not found" subtitle visible
      4. Assert: "Back to Home" link exists, href="/"
      5. Assert: No console errors (check browser console)
    Expected Result: Custom 404 page with proper content
    Failure Indicators: Default Next.js 404, broken styling, console errors
    Evidence: .sisyphus/evidence/task-10-404-light.png (screenshot)

  Scenario: 404 page renders correctly in dark mode
    Tool: Playwright
    Preconditions: Dark mode
    Steps:
      1. Set theme to dark
      2. Navigate to http://localhost:3000/broken-link
      3. Assert: Background is dark canvas color (not white)
      4. Assert: Text is readable (ink-primary on dark canvas)
      5. Assert: 404 number has accent color (still visible on dark)
    Expected Result: 404 page looks good in dark mode
    Failure Indicators: White background in dark mode, invisible text
    Evidence: .sisyphus/evidence/task-10-404-dark.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of 404 in light mode
  - [ ] Screenshot of 404 in dark mode

  **Commit**: YES (groups with Tasks 7-9, 11)
  - Message: `feat(design): add custom 404 page with brand styling`
  - Files: `src/app/not-found.tsx`

---

- [x] 11. **Extract HeroSection from Landing Page**

  **What to do**:
  - Create `src/components/HeroSection.tsx`:
    - Extract the hero section from `src/app/page.tsx` (lines ~102-148)
    - Props: none (self-contained for now)
    - Two-column grid (`grid-cols-1 lg:grid-cols-2 gap-12`)
    - Left column:
      - Badge pill: "AI-Powered Resume Builder" with small accent dot (replace old pulsing dot with static accent dot)
      - Heading: "Build a beautiful resume in minutes, not hours" — split into two lines, first line in font-display (Instrument Serif), second line in font-sans (Inter)
      - Subheading: Keep existing text but restyle with `text-ink-secondary text-lg`
      - CTAs: "Get started free" (`btn-primary`, links to `/signup`) + "See how it works" (`btn-secondary`, links to `#features`)
    - Right column:
      - Replace Unsplash image with CSS geometric composition (overlapping rounded rectangles, accent gradient blobs — pure CSS, no external images)
      - Or: A simple device mockup frame showing a resume preview (CSS-only)
    - Responsive: stacked on mobile (text first, visual second)
    - Section padding: `pt-20 pb-16 sm:pt-32 sm:pb-24`

  **Must NOT do**:
  - Don't reference the old Unsplash image URL (remove it)
  - Don't use glass-card classes
  - Don't hardcode animation delays — use the stagger pattern if needed

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Hero section is the most important visual element — needs strong typography, layout, and CSS decoration
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Hero section design, typography hierarchy, CSS geometric decoration, CTA placement

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-10)
  - **Blocks**: Tasks 14-15 (need HeroSection to compose landing page)
  - **Blocked By**: Task 1 (tokens)

  **References**:
  - `src/app/page.tsx:102-148` — Current hero section to extract and redesign. Read full section for existing text content, CTA links, structure.
  - `src/app/globals.css` — Design tokens created in Task 1. Use `font-display`, `text-ink-primary`, `text-ink-secondary`, `btn-primary`.

  **Acceptance Criteria**:
  - [ ] Hero renders with Instrument Serif heading + Inter subheading
  - [ ] Badge pill with accent dot
  - [ ] Two CTAs: primary (Get started) + secondary (See how it works)
  - [ ] Right column has CSS-only geometric decoration (no Unsplash image)
  - [ ] Fully responsive (stacks on mobile)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Hero section renders correctly on desktop
    Tool: Playwright
    Preconditions: 1024px viewport, light mode
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert: "AI-Powered Resume Builder" badge visible
      3. Assert: Heading uses Instrument Serif font (evaluate getComputedStyle)
      4. Assert: "Get started free" button visible
      5. Assert: "See how it works" link visible
      6. Assert: Right column has decorative elements (no broken image)
    Expected Result: Premium hero section with proper typography and CTAs
    Failure Indicators: Broken image (old Unsplash), wrong fonts, missing CTAs
    Evidence: .sisyphus/evidence/task-11-hero-desktop.png (screenshot)

  Scenario: Hero section stacks correctly on mobile
    Tool: Playwright
    Preconditions: 375px viewport
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert: Two-column layout is now stacked (text on top)
      3. Assert: Heading readable (not tiny, not overflowing)
      4. Assert: CTAs still visible, tappable size
      5. Assert: No horizontal scroll
    Expected Result: Mobile-friendly hero layout
    Failure Indicators: Horizontal scroll, overlapping text, tiny buttons
    Evidence: .sisyphus/evidence/task-11-hero-mobile.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of hero on desktop
  - [ ] Screenshot of hero on mobile

  **Commit**: YES (groups with Tasks 7-10)
  - Message: `feat(design): extract HeroSection with premium typography and CSS decoration`
  - Files: `src/components/HeroSection.tsx`

---

- [x] 12. **Redesigned Login Page (Centered-Brand Auth Pattern)**

  **What to do**:
  - Rewrite `src/app/login/page.tsx`:
    - Use `Layout variant="auth"` — no header, no footer
    - Centered card: `max-w-md w-full mx-auto`
    - Top: `<Logo size="lg" />` centered
    - Heading: "Welcome back" in `font-display` (Instrument Serif), `text-3xl`
    - Subtitle: "Sign in to continue building your resume" in `text-ink-secondary`
    - AuthForm: keep the existing `<AuthForm mode="login" onSubmit={handleLogin} error={error} />`
    - Below form: "Don't have an account? Create one" → link to `/signup`
    - Visual: Clean card with subtle border (`border border-border rounded-xl p-8`), shadow token
    - Background: canvas color (not gradient)
    - Error state: passes `error` to AuthForm (existing pattern)
    - Loading state: handled by AuthForm internally
    - Add subtle decorative element: a small accent geometric shape above the logo (CSS-only)

  **Must NOT do**:
  - Don't change the AuthForm component — only restyle the page wrapping it
  - Don't change the `handleLogin` logic (same `useAuth().login` call, same redirect)
  - Don't add social login buttons or forgot password — backend doesn't support them

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Auth page redesign with visual hierarchy, typography, and the centered-brand pattern
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Auth page UX patterns, form presentation, visual hierarchy for conversion

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13-17)
  - **Blocks**: Task 21 (QA)
  - **Blocked By**: Tasks 7 (Header for Layout reference), 9 (Layout component)

  **References**:
  - `src/app/login/page.tsx` — Current login page (28 lines). Rewrite in place.
  - `src/components/AuthForm.tsx` — Existing AuthForm component. Do NOT modify — just import and wrap.
  - `src/components/Logo.tsx` — Import for centered brand logo
  - `src/components/Layout.tsx` — Use `variant="auth"` to skip header/footer

  **Acceptance Criteria**:
  - [ ] Login page shows centered brand logo + form (no nav, no footer)
  - [ ] "Welcome back" heading in Instrument Serif
  - [ ] Clean card with border and proper spacing
  - [ ] Login flow works identically to current (redirect to /dashboard)
  - [ ] Error message from API displays correctly

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Login page renders with centered-brand layout
    Tool: Playwright
    Preconditions: Logged out, 1024px viewport, light mode
    Steps:
      1. Navigate to http://localhost:3000/login
      2. Assert: Logo visible and centered
      3. Assert: "Welcome back" heading visible
      4. Assert: Email input visible
      5. Assert: Password input visible
      6. Assert: "Sign In" submit button visible
      7. Assert: "Don't have an account" link points to /signup
      8. Assert: No Header or Footer visible
    Expected Result: Clean, centered auth page with brand logo
    Failure Indicators: Header/footer visible, missing logo, missing form fields
    Evidence: .sisyphus/evidence/task-12-login-light.png (screenshot)

  Scenario: Login page works in dark mode
    Tool: Playwright
    Preconditions: Dark mode
    Steps:
      1. Set theme to dark
      2. Navigate to http://localhost:3000/login
      3. Assert: Background is dark canvas color
      4. Assert: Card has visible border (border-border on dark)
      5. Assert: Input text readable on dark background
      6. Assert: Labels readable
    Expected Result: Login page fully functional in dark mode
    Failure Indicators: White flash, invisible text, missing borders
    Evidence: .sisyphus/evidence/task-12-login-dark.png (screenshot)

  Scenario: Login flow works (regression)
    Tool: Playwright
    Preconditions: Backend running
    Steps:
      1. Navigate to http://localhost:3000/login
      2. Fill email: test@example.com
      3. Fill password: password123
      4. Click "Sign In"
      5. Wait for redirect to /dashboard
      6. Assert navigated to /dashboard
    Expected Result: Login works identically to before redesign
    Failure Indicators: Form doesn't submit, redirect fails, error not displayed
    Evidence: .sisyphus/evidence/task-12-login-flow.png (screenshot of dashboard after login)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of login page in light mode
  - [ ] Screenshot of login page in dark mode
  - [ ] Screenshot of successful login redirect

  **Commit**: YES (groups with Tasks 13-17)
  - Message: `feat(design): redesign login page with centered-brand auth layout`
  - Files: `src/app/login/page.tsx`

---

- [x] 13. **Redesigned Signup Page (Centered-Brand Auth Pattern)**

  **What to do**:
  - Rewrite `src/app/signup/page.tsx`:
    - Use `Layout variant="auth"` — no header, no footer
    - Centered card: `max-w-md w-full mx-auto`
    - Top: `<Logo size="lg" />` centered
    - Heading: "Create your account" in `font-display` (Instrument Serif), `text-3xl`
    - Subtitle: "Start building professional resumes in minutes" in `text-ink-secondary`
    - AuthForm: keep the existing `<AuthForm mode="signup" onSubmit={handleSignup} error={error} />`
    - Below form: "Already have an account? Sign in" → link to `/login`
    - Visual: Same card style as login page (consistent auth pattern)
    - Same decorative accent element as login page for visual consistency

  **Must NOT do**:
  - Don't change AuthForm component
  - Don't change the `handleSignup` logic
  - Don't add extra signup fields (name, confirm password, etc.) — keep the same API contract

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Auth page — same pattern as login, consistent visual treatment
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Consistent auth page pattern, signup UX flow

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 14-17)
  - **Blocks**: Task 21 (QA)
  - **Blocked By**: Tasks 7 (Header), 9 (Layout)

  **References**:
  - `src/app/signup/page.tsx` — Current signup page (28 lines). Rewrite in place.
  - `src/components/AuthForm.tsx` — Existing AuthForm (do NOT modify)
  - `src/app/login/page.tsx` — The redesigned login page from Task 12. Copy the visual pattern for consistency.
  - `src/components/Logo.tsx` — Centered brand logo
  - `src/components/Layout.tsx` — Use `variant="auth"`

  **Acceptance Criteria**:
  - [ ] Signup page shows centered brand logo + form
  - [ ] "Create your account" heading in Instrument Serif
  - [ ] Consistent visual style with login page
  - [ ] Signup flow works identically (redirect to /dashboard)
  - [ ] Error message displays correctly

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Signup page renders correctly
    Tool: Playwright
    Preconditions: Logged out, 1024px viewport, light mode
    Steps:
      1. Navigate to http://localhost:3000/signup
      2. Assert: Logo visible and centered
      3. Assert: "Create your account" heading visible
      4. Assert: Email input visible
      5. Assert: Password input visible
      6. Assert: "Create Account" submit button visible
      7. Assert: "Already have an account" link points to /login
    Expected Result: Clean signup page with consistent auth pattern
    Failure Indicators: Mismatched visual style with login, missing fields
    Evidence: .sisyphus/evidence/task-13-signup-light.png (screenshot)

  Scenario: Signup flow works (regression)
    Tool: Playwright
    Preconditions: Backend running
    Steps:
      1. Navigate to http://localhost:3000/signup
      2. Fill email: newuser@example.com
      3. Fill password: password123
      4. Click "Create Account"
      5. Wait for redirect to /dashboard
      6. Assert navigated to /dashboard
    Expected Result: Signup works identically to before redesign
    Failure Indicators: Form doesn't submit, redirect fails
    Evidence: .sisyphus/evidence/task-13-signup-flow.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of signup page in light mode
  - [ ] Screenshot of successful signup redirect

  **Commit**: YES (groups with Tasks 12, 14-17)
  - Message: `feat(design): redesign signup page with centered-brand auth layout`
  - Files: `src/app/signup/page.tsx`

---

- [x] 14. **Extract FeaturesSection + Create SocialProofSection**

  **What to do**:
  - Extract Features from landing page into `src/components/FeaturesSection.tsx`:
    - Pull existing 3 feature cards from `src/app/page.tsx` (lines ~150-169)
    - Keep existing feature content: AI-Powered, Beautiful Templates, Iterate & Refine
    - Redesign cards: remove glass-card, use `card` class from design tokens (border, subtle shadow, rounded-xl, p-6)
    - Icons: Replace inline SVG paths with cleaner geometric icon shapes (simple CSS shapes or refined SVGs)
    - Add hover effect: subtle border color shift to accent on hover
    - Section heading: "Everything you need to land the job" in `font-display`
    - Section subtitle: "Our AI handles the formatting so you can focus on what matters — your experience"
    - Grid: `grid-cols-1 md:grid-cols-3 gap-6`
    - Section id: `id="features"` (so Hero CTA anchor link works)
  - Create `src/components/SocialProofSection.tsx` (NEW — not extracted):
    - Simple stats bar or testimonial section
    - Three stats: "10,000+ Resumes Created" | "ATS-Optimized" | "4.8/5 User Rating"
    - Each stat: large number in `font-display text-accent`, label below in `text-ink-secondary text-sm`
    - Layout: horizontal on desktop (`flex justify-around`), stacked on mobile
    - Subtle divider line above and below (`border-t border-b border-border`)
    - Section padding: `py-12`
    - No real testimonials needed — keep it to verifiable claims or generic stats

  **Must NOT do**:
  - Don't use fake testimonial photos or names — keep to stats/metrics only
  - Don't change the actual feature content descriptions
  - Don't use glass-card classes

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Card design + social proof section — both need strong visual hierarchy and consistent styling
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Feature card design, social proof/stats patterns, consistent card system

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12-13, 15-17)
  - **Blocks**: Task 15 (landing page composition)
  - **Blocked By**: Task 1 (tokens), Task 11 (HeroSection — for consistent section style)

  **References**:
  - `src/app/page.tsx:150-169` — Current features section to extract. Read for existing content and SVG icons.
  - `src/app/globals.css` — Design tokens from Task 1. Use `card` class, `text-accent`, `font-display`.
  - `src/components/HeroSection.tsx` — Reference for consistent section padding and style.

  **Acceptance Criteria**:
  - [ ] Features section with 3 redesigned cards (no glass-card)
  - [ ] Social proof stats bar with 3 metrics
  - [ ] `id="features"` on section for anchor link
  - [ ] Responsive grid (3 columns desktop, stack mobile)
  - [ ] Hover effect on cards

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Features section renders with new card design
    Tool: Playwright
    Preconditions: 1024px viewport, light mode
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to #features section
      3. Assert: "Everything you need to land the job" heading visible
      4. Assert: 3 feature cards visible in a row
      5. Assert: Cards have border (not glass-card blur effect)
      6. Assert: "AI-Powered" card visible
      7. Assert: "Beautiful Templates" card visible
      8. Assert: "Iterate & Refine" card visible
    Expected Result: Clean card-based features section
    Failure Indicators: Glass-card classes present, cards stacked on desktop, missing content
    Evidence: .sisyphus/evidence/task-14-features-desktop.png (screenshot)

  Scenario: Social proof stats render correctly
    Tool: Playwright
    Preconditions: 1024px viewport
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll between features and builder sections
      3. Assert: Three stats visible horizontally
      4. Assert: Large numbers in accent color
      5. Assert: Labels below each number
    Expected Result: Social proof stats bar between features and builder
    Failure Indicators: Stats missing, stacked on desktop, wrong colors
    Evidence: .sisyphus/evidence/task-14-social-proof.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of features section
  - [ ] Screenshot of social proof section

  **Commit**: YES (groups with Tasks 12-13, 15-17)
  - Message: `feat(design): extract FeaturesSection and add SocialProofSection`
  - Files: `src/components/FeaturesSection.tsx`, `src/components/SocialProofSection.tsx`

---

- [x] 15. **Extract BuilderSection + Compose Landing Page**

  **What to do**:
  - Create `src/components/BuilderSection.tsx`:
    - Extract builder section from `src/app/page.tsx` (lines ~171-220)
    - Section heading: "Start building your resume" in `font-display`
    - Keep existing `<PromptInput>` + `<FileUpload>` components and logic
    - Keep the "or" divider pattern
    - Keep the `handleSubmit` logic (import `useAuth` and `useResume` — same hooks, same API calls)
    - Redesign the section container: remove old glass-card styling
    - Keep error display
    - Section id: `id="builder"`
    - Remove the login guard (already handled by `useAuth` in the hook)
  - Rewrite `src/app/page.tsx`:
    - Import and compose: `<HeroSection />` + `<FeaturesSection />` + `<SocialProofSection />` + `<BuilderSection />`
    - Remove ALL inline section code — the page becomes a thin composition
    - Remove the inline header (now handled by Layout/Header)
    - Remove `"use client"` if possible (check: if composed sections are client components, the page may need it)
    - Page should be ~30 lines max (just imports + section composition)

  **Must NOT do**:
  - Don't change the `handleSubmit` logic — same FormData creation, same `createResume` call, same redirect
  - Don't remove the file upload functionality
  - Don't change PromptInput or FileUpload component APIs

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Section extraction + page composition with functional logic preservation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Section layout design, component composition

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12-14, 16-17)
  - **Blocks**: Task 20 (QA)
  - **Blocked By**: Tasks 9 (Layout), 14 (FeaturesSection, SocialProofSection)

  **References**:
  - `src/app/page.tsx:171-220` — Current builder section to extract. Read for PromptInput + FileUpload logic.
  - `src/components/PromptInput.tsx` — Existing component (do NOT modify)
  - `src/components/FileUpload.tsx` — Existing component (do NOT modify)
  - `src/hooks/useResume.ts` — `createResume` import (same hook)
  - `src/hooks/useAuth.tsx` — `useAuth()` for token check

  **Acceptance Criteria**:
  - [ ] Builder section retains all existing functionality (prompt + file upload + submit)
  - [ ] Resume creation flow works identically
  - [ ] Landing page is now thin composition (~30 lines)
  - [ ] No remaining inline sections in page.tsx
  - [ ] Builder section has proper heading and styling

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Builder section renders with prompt input
    Tool: Playwright
    Preconditions: Logged in, 1024px viewport
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to #builder section
      3. Assert: "Start building your resume" heading visible
      4. Assert: PromptInput textarea visible
      5. Assert: "Build My Resume" button visible
      6. Assert: FileUpload area visible
    Expected Result: Builder section with all interactive elements
    Failure Indicators: Missing components, broken imports, blank section
    Evidence: .sisyphus/evidence/task-15-builder-desktop.png (screenshot)

  Scenario: Resume creation flow works (regression)
    Tool: Playwright
    Preconditions: Logged in, backend running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to builder section
      3. Type "Software engineer with 5 years experience" in prompt textarea
      4. Click "Build My Resume"
      5. Wait for redirect to /dashboard/[resumeId]
      6. Assert navigated to detail page with iframe
    Expected Result: Resume creation flow unchanged
    Failure Indicators: Submit broken, wrong redirect, API error
    Evidence: .sisyphus/evidence/task-15-resume-creation.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of builder section
  - [ ] Screenshot of successful resume creation

  **Commit**: YES (groups with Tasks 12-14, 16-17)
  - Message: `feat(design): extract BuilderSection and compose landing page from sections`
  - Files: `src/components/BuilderSection.tsx`, `src/app/page.tsx`

---

- [x] 16. **Apply Layout + Redesign Dashboard List Page**

  **What to do**:
  - Rewrite `src/app/dashboard/page.tsx`:
    - Remove inline `<header>` block (replaced by Layout/Header)
    - Remove inline logo and logout button (now in Header component)
    - Keep all existing logic: `useAuth`, `useResume.loadResumes`, loading state, empty state, resume grid
    - Restyle all UI elements with new tokens:
      - Page title: "Your Resumes" in `font-display text-3xl`
      - "New Resume" button: `btn-primary`
      - Resume cards: replace glass-card with `card` class
      - Empty state: centered, with icon + message + CTA to create first resume
    - Keep the `ResumeCard` component as-is (it will be updated in Task 18-19 to remove glass classes)
    - Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
    - Container: `max-w-7xl mx-auto px-4 sm:px-6 py-8`
    - Loading state: skeleton cards (use existing `.skeleton` class with new colors)

  **Must NOT do**:
  - Don't modify ResumeCard component — just restyle the page
  - Don't change the data fetching logic (`loadResumes`, polling)
  - Don't change the link paths to resume detail pages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Dashboard page redesign with card grid, empty state, and consistent layout application
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Dashboard layout patterns, card grid design, empty state UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12-15, 17)
  - **Blocks**: Task 22 (QA)
  - **Blocked By**: Tasks 7 (Header via Layout), 9 (Layout)

  **References**:
  - `src/app/dashboard/page.tsx` — Current dashboard page. Read fully. Restyle, keep all logic.
  - `src/components/ResumeCard.tsx` — Keep as-is for now (Task 18 will remove glass classes)
  - `src/hooks/useAuth.tsx` — Same hook usage, same pattern

  **Acceptance Criteria**:
  - [ ] Header from Layout (not inline)
  - [ ] "Your Resumes" title in Instrument Serif
  - [ ] Resume grid with new card styling
  - [ ] Empty state properly styled
  - [ ] Loading skeleton styled with new tokens
  - [ ] "New Resume" button links to `/`

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Dashboard shows resume grid (with resumes)
    Tool: Playwright
    Preconditions: Logged in, some resumes exist
    Steps:
      1. Navigate to http://localhost:3000/dashboard
      2. Assert: Header visible (from Layout)
      3. Assert: "Your Resumes" title visible in Instrument Serif
      4. Assert: "New Resume" button visible
      5. Assert: Resume cards visible in grid
      6. Assert: Cards have border styling (not glass blur)
    Expected Result: Dashboard with proper layout and card grid
    Failure Indicators: Missing header, glass-card classes, broken grid
    Evidence: .sisyphus/evidence/task-16-dashboard-with-resumes.png (screenshot)

  Scenario: Dashboard shows empty state
    Tool: Playwright
    Preconditions: Logged in, no resumes
    Steps:
      1. Navigate to http://localhost:3000/dashboard
      2. Assert: Empty state message visible ("No resumes yet" or similar)
      3. Assert: CTA to create first resume visible
    Expected Result: Helpful empty state with next action
    Failure Indicators: Blank page, broken empty state
    Evidence: .sisyphus/evidence/task-16-dashboard-empty.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of dashboard with resumes
  - [ ] Screenshot of empty dashboard state

  **Commit**: YES (groups with Tasks 12-15, 17)
  - Message: `feat(design): redesign dashboard list page with new layout`
  - Files: `src/app/dashboard/page.tsx`

---

- [x] 17. **Apply Layout + Redesign Dashboard Detail Page**

  **What to do**:
  - Rewrite `src/app/dashboard/[resumeId]/page.tsx`:
    - Remove inline `<header>` block (replaced by Layout/Header)
    - Keep all existing logic: `useAuth`, `useResume.loadResume`, polling, PDF preview, RefinementChat
    - Restyle all UI elements:
      - Back link: "← Back to Dashboard" with `text-ink-muted hover:text-ink-primary`
      - Resume title: `font-display text-2xl`
      - Status badge: Use semantic badge class (replace hardcoded `bg-emerald-500`, `bg-rose-50`, etc.)
      - PDF preview container: Replace hardcoded gray colors with semantic tokens
      - RefinementChat sidebar: Keep component as-is (it will use design tokens from globals)
      - Loading state: skeleton with new token colors
      - Error state: styled with semantic error token
      - Accepted/completed screen: Green checkmark with semantic success token, download button
    - Layout: Two-column on desktop (`grid-cols-1 lg:grid-cols-[1fr_400px]`), stacked on mobile
    - Container: `max-w-7xl mx-auto px-4 sm:px-6 py-8`
    - Replace any `gray-*` classes with `ink-*` or `surface-*` semantic tokens

  **Must NOT do**:
  - Don't modify `RefinementChat.tsx`, `PdfPreview.tsx`, or any child component
  - Don't change the polling logic (3-second interval, status checks)
  - Don't change the `window.print()` PDF download logic
  - Don't change any hook calls (`loadResume`, `refineResume`, `getPdfBlob`)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex page with two-column layout, status badges, preview, and chat — needs careful restyling while preserving all logic
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Detail page layout, status badge design, preview presentation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12-16)
  - **Blocks**: Task 22 (QA)
  - **Blocked By**: Tasks 7 (Header via Layout), 9 (Layout)

  **References**:
  - `src/app/dashboard/[resumeId]/page.tsx` — Current detail page. Read fully. Restyle, keep ALL logic.
  - `src/components/RefinementChat.tsx` — Do NOT modify. Just ensure it renders correctly with new tokens.
  - `src/components/PdfPreview.tsx` — Do NOT modify. Will be updated in Task 19 for hardcoded colors.
  - `src/hooks/useResume.ts` — Same hook usage, same pattern

  **Acceptance Criteria**:
  - [ ] Header from Layout (not inline)
  - [ ] Back link to dashboard
  - [ ] Resume title in Instrument Serif
  - [ ] Status badges use semantic tokens (not hardcoded colors)
  - [ ] Two-column layout on desktop, stacked on mobile
  - [ ] PDF preview renders correctly
  - [ ] RefinementChat renders correctly
  - [ ] All existing functionality preserved

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Detail page renders with resume preview
    Tool: Playwright
    Preconditions: Logged in, a resume exists
    Steps:
      1. Navigate to http://localhost:3000/dashboard/[existing-resume-id]
      2. Assert: Header visible (from Layout)
      3. Assert: "← Back to Dashboard" link visible
      4. Assert: Resume title in Instrument Serif
      5. Assert: PDF preview iframe visible (or generating state)
      6. Assert: RefinementChat sidebar visible
    Expected Result: Detail page with two-column layout
    Failure Indicators: Missing header, broken layout, missing preview
    Evidence: .sisyphus/evidence/task-17-detail-desktop.png (screenshot)

  Scenario: Detail page works in dark mode
    Tool: Playwright
    Preconditions: Logged in, resume exists, dark mode
    Steps:
      1. Set theme to dark
      2. Navigate to http://localhost:3000/dashboard/[existing-resume-id]
      3. Assert: Background is dark canvas color
      4. Assert: Text readable (not white on white or black on black)
      5. Assert: Status badges visible and readable
      6. Assert: Chat messages readable
    Expected Result: Detail page fully functional in dark mode
    Failure Indicators: Invisible text, white flash, broken contrast
    Evidence: .sisyphus/evidence/task-17-detail-dark.png (screenshot)
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of detail page on desktop
  - [ ] Screenshot of detail page in dark mode

  **Commit**: YES (groups with Tasks 12-16)
  - Message: `feat(design): redesign dashboard detail page with new layout and tokens`
  - Files: `src/app/dashboard/[resumeId]/page.tsx`

---

- [x] 18. **Remove All .glass-card References (System-Wide Audit)**

  **What to do**:
  - Search entire codebase for `.glass-card`, `.glass-card-strong`, `.gradient-text`, `.gradient-text-subtle` classes
  - For each file found, replace with new semantic classes:
    - `.glass-card` → `card` (border + rounded-xl + shadow + bg-surface)
    - `.glass-card-strong` → `card card-raised` (slightly elevated variant)
    - `.gradient-text` → `text-accent` (for brand-colored text) or `font-display` (for display headings)
    - `.gradient-text-subtle` → `text-ink-primary` (or `font-display` for headings)
  - Add `card` and `card-raised` utility classes to `globals.css` if not already present:
    ```css
    .card { @apply bg-surface border border-border rounded-xl shadow-sm; }
    .card-raised { @apply shadow-md; }
    ```
  - Files likely affected: `AuthForm.tsx`, `ResumeCard.tsx`, `PromptInput.tsx`, `FileUpload.tsx`, and possibly others
  - After replacement, ensure visual consistency — cards should look cohesive

  **Must NOT do**:
  - Don't remove classes that are still used by other components
  - Don't add new visual features — this is PURE replacement, not redesign

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Search-and-replace across codebase with clear mapping rules
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 19)
  - **Blocks**: Tasks 20-23 (QA — needs clean codebase)
  - **Blocked By**: Tasks 1-17 (all page redesigns must be done first)

  **References**:
  - `src/app/globals.css:20-33` — Current glass-card classes to understand what they do (backdrop blur, white bg, shadow). The replacement `card` class must provide equivalent visual separation without the blur effect.
  - `src/app/globals.css:35-48` — Current gradient-text classes to understand and replace.

  **Acceptance Criteria**:
  - [ ] Zero `.glass-card` references in entire codebase (verify with grep)
  - [ ] Zero `.glass-card-strong` references
  - [ ] Zero `.gradient-text` references (except possibly in globals.css as legacy)
  - [ ] Zero `.gradient-text-subtle` references
  - [ ] All cards use `card` or `card-raised` classes
  - [ ] App renders without styling errors

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: No glass classes remain in codebase
    Tool: Bash
    Preconditions: All tasks 1-17 completed
    Steps:
      1. Run: grep -r "glass-card" src/ --include="*.tsx" --include="*.ts" --include="*.css"
      2. Assert: No output (zero matches)
      3. Run: grep -r "gradient-text" src/ --include="*.tsx" --include="*.ts"
      4. Assert: No output (zero matches in component files)
    Expected Result: All glassmorphism classes removed
    Failure Indicators: Any remaining glass-card or gradient-text usage
    Evidence: .sisyphus/evidence/task-18-grep-output.txt (grep results)
  ```

  **Evidence to Capture**:
  - [ ] grep output proving zero glass-class references

  **Commit**: YES (groups with Task 19)
  - Message: `chore(design): remove all glassmorphism classes, migrate to new card tokens`
  - Files: Multiple (all files with glass-card references)

---

- [x] 19. **Replace Hardcoded Colors with Semantic Tokens**

  **What to do**:
  - Audit all component files for hardcoded color classes:
    - `gray-*` → replace with `ink-*` or `surface-*` equivalents
    - `slate-*` → replace with semantic equivalents
    - `rose-*` → replace with `error` token class (if defined) or keep only in form error context
    - `emerald-*` → replace with `success` token class
    - `indigo-*` / `purple-*` / `pink-*` → replace with `accent` or `accent-hover`
    - Hex codes → replace with Tailwind semantic classes referencing tokens
  - Files to check:
    - `src/components/AuthForm.tsx` — error banner (rose-50, rose-200, rose-600)
    - `src/components/ResumeCard.tsx` — status badge colors
    - `src/components/PdfPreview.tsx` — gray-* classes for preview container
    - `src/components/FileUpload.tsx` — border and text colors
    - `src/components/PromptInput.tsx` — border and focus colors
    - `src/app/dashboard/[resumeId]/page.tsx` — any remaining hardcoded colors after Task 17
  - If a semantic token doesn't exist for a needed color, add it to `globals.css`

  **Must NOT do**:
  - Don't change component behavior — only color classes
  - Don't remove classes that serve a structural purpose (flex, grid, padding, etc.)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Search-and-replace color migration with clear mapping rules
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 18)
  - **Blocks**: Tasks 20-23 (QA)
  - **Blocked By**: Tasks 1-17

  **References**:
  - `src/app/globals.css` — Design token definitions from Task 1. Know what semantic tokens are available.
  - `src/components/AuthForm.tsx` — Error colors to migrate
  - `src/components/PdfPreview.tsx` — Gray colors to migrate
  - `src/components/ResumeCard.tsx` — Status badge colors to migrate

  **Acceptance Criteria**:
  - [ ] Zero `gray-*` classes in component files (verify with grep)
  - [ ] Zero hex color codes in component files (globals.css is the ONLY exception)
  - [ ] All colors use semantic Tailwind tokens (`text-ink-*`, `bg-surface-*`, `text-accent`, etc.)
  - [ ] App renders correctly with new color tokens

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: No hardcoded colors remain
    Tool: Bash
    Preconditions: All tasks 1-18 completed
    Steps:
      1. Run: grep -rn "#[0-9a-fA-F]" src/components/ src/app/ --include="*.tsx" | grep -v "globals.css" | grep -v ".next"
      2. Assert: No output (zero hex codes in component files)
      3. Run: grep -rn "gray-" src/components/ src/app/ --include="*.tsx"
      4. Assert: No output
    Expected Result: All colors migrated to semantic tokens
    Failure Indicators: Hex codes in components, gray-* classes remaining
    Evidence: .sisyphus/evidence/task-19-color-audit.txt
  ```

  **Evidence to Capture**:
  - [ ] grep output proving zero hardcoded colors

  **Commit**: YES (groups with Task 18)
  - Message: `chore(design): replace all hardcoded colors with semantic design tokens`
  - Files: Multiple (all files with hardcoded colors)

---

- [x] 20. **Playwright QA — Landing Page (Light + Dark, 5 Viewports)**

  **What to do**:
  - Execute comprehensive Playwright QA for the landing page (`/`):
    - Test at viewports: 320px, 375px, 768px, 1024px, 1440px
    - Test in light mode and dark mode (10 combinations total)
    - Assertions per viewport/theme:
      - Header visible with correct auth-aware links
      - Hero section: heading, CTAs, decorative elements visible
      - Features section: 3 cards visible, proper grid layout
      - Social proof: stats bar visible
      - Builder section: PromptInput + FileUpload visible
      - Footer visible with all columns
      - No horizontal scroll at any viewport
      - No text overflow or overlapping elements
      - Theme toggle works and persists
    - Capture screenshots at each breakpoint + theme
    - Save evidence to `.sisyphus/evidence/task-20/`

  **Must NOT do**:
  - Don't skip any viewport or theme
  - Don't test features not on landing page (dashboard, auth)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Systematic QA across multiple viewports and themes — requires Playwright expertise
  - **Skills**: [`dev-browser`]
    - `dev-browser`: Playwright automation for comprehensive browser testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 21-23)
  - **Blocks**: Final Verification (F1-F4)
  - **Blocked By**: Tasks 1-19 (all implementation)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Landing page at all viewports — light mode
    Tool: Playwright
    Preconditions: Light mode, app running
    Steps:
      1. For each viewport [320, 375, 768, 1024, 1440]:
         a. Set viewport size
         b. Navigate to http://localhost:3000
         c. Wait for page to fully load (networkidle)
         d. Assert: No horizontal scroll (scrollWidth <= innerWidth)
         e. Assert: Header visible
         f. Assert: Hero heading visible
         g. Scroll to features: assert 3 cards visible
         h. Scroll to builder: assert PromptInput visible
         i. Scroll to footer: assert footer visible
         j. Take fullPage screenshot
    Expected Result: All viewports render correctly in light mode
    Failure Indicators: Horizontal scroll, missing sections, overlapping elements
    Evidence: .sisyphus/evidence/task-20/light-{viewport}.png (5 screenshots)

  Scenario: Landing page at all viewports — dark mode
    Tool: Playwright
    Preconditions: Dark mode
    Steps:
      1. Same as above but with .dark class on html element
      2. Additional assertion: background is dark canvas color (not white)
    Expected Result: All viewports render correctly in dark mode
    Failure Indicators: White backgrounds, invisible text, poor contrast
    Evidence: .sisyphus/evidence/task-20/dark-{viewport}.png (5 screenshots)
  ```

  **Evidence to Capture**:
  - [ ] 10 screenshots (5 viewports × 2 themes)

  **Commit**: NO (QA evidence only, no code changes)

---

- [x] 21. **Playwright QA — Login/Signup Pages (Light + Dark, 3 Viewports)**

  **What to do**:
  - Execute Playwright QA for login and signup pages:
    - Test at viewports: 375px, 768px, 1024px
    - Test in light + dark mode (6 combinations per page)
    - Assertions:
      - No Header or Footer visible (auth layout)
      - Logo centered above form
      - Form fields visible and styled correctly
      - Submit button visible
      - Mode-switch link visible ("Don't have an account?" / "Already have an account?")
      - No horizontal scroll
      - Dark mode: readable text, visible borders, no white backgrounds
    - Functional test: login flow (fill form → submit → redirect to dashboard)
    - Functional test: signup flow (fill form → submit → redirect to dashboard)
    - Functional test: error display (submit with invalid credentials → error shown)
    - Save evidence to `.sisyphus/evidence/task-21/`

  **Must NOT do**:
  - Don't test dashboard or landing page — those are separate QA tasks

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Auth page QA with functional flow testing — needs Playwright expertise
  - **Skills**: [`dev-browser`]
    - `dev-browser`: Playwright for form interaction and navigation testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20, 22-23)
  - **Blocks**: Final Verification
  - **Blocked By**: Tasks 1-19

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Login and signup visual QA
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. For each page [/login, /signup] × each theme [light, dark] × each viewport [375, 768, 1024]:
         a. Navigate to page
         b. Assert auth layout (no header/footer)
         c. Assert logo centered
         d. Assert form visible
         e. Take screenshot
    Expected Result: All combinations render correctly
    Evidence: .sisyphus/evidence/task-21/{page}-{theme}-{viewport}.png (12 screenshots)

  Scenario: Login functional flow
    Tool: Playwright
    Preconditions: Backend running, valid test credentials
    Steps:
      1. Navigate to /login
      2. Fill email: test@example.com
      3. Fill password: TestPass123!
      4. Click "Sign In"
      5. Wait for navigation to /dashboard
      6. Assert URL is /dashboard
      7. Assert localStorage has token
    Expected Result: Successful login flow
    Evidence: .sisyphus/evidence/task-21/login-success.png

  Scenario: Error on invalid credentials
    Tool: Playwright
    Preconditions: Backend running
    Steps:
      1. Navigate to /login
      2. Fill email: wrong@example.com
      3. Fill password: wrongpassword
      4. Click "Sign In"
      5. Assert error message visible (wait for API response)
    Expected Result: Error message displayed
    Evidence: .sisyphus/evidence/task-21/login-error.png
  ```

  **Evidence to Capture**:
  - [ ] 12 visual QA screenshots
  - [ ] Login success screenshot
  - [ ] Login error screenshot

  **Commit**: NO (QA evidence only)

---

- [x] 22. **Playwright QA — Dashboard Pages (Light + Dark, 3 Viewports)**

  **What to do**:
  - Execute Playwright QA for dashboard pages:
    - Test `/dashboard` (list) + `/dashboard/[id]` (detail)
    - Viewports: 375px, 768px, 1024px
    - Light + dark mode
    - Assertions for dashboard list:
      - Header visible (from Layout)
      - "Your Resumes" title visible
      - "New Resume" button links to /
      - Resume grid or empty state visible
      - No horizontal scroll
    - Assertions for dashboard detail:
      - Back link visible
      - Resume title in Instrument Serif
      - PDF preview or generating state visible
      - Refinement chat sidebar visible
      - Status badges use semantic tokens (no hardcoded colors)
    - Functional test: navigate from list → detail → back to list
    - Functional test: logout from dashboard (click logout in header → redirected to /)
    - Save evidence to `.sisyphus/evidence/task-22/`

  **Must NOT do**:
  - Don't test resume creation — that's Task 23

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Dashboard QA with navigation flow testing
  - **Skills**: [`dev-browser`]
    - `dev-browser`: Playwright for dashboard navigation and assertion testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20-21, 23)
  - **Blocks**: Final Verification
  - **Blocked By**: Tasks 1-19

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Dashboard pages visual QA
    Tool: Playwright
    Preconditions: Logged in, at least one resume exists for detail page
    Steps:
      1. For each page [/dashboard, /dashboard/{id}] × each theme × each viewport:
         a. Navigate to page
         b. Assert layout structure
         c. Take screenshot
    Expected Result: All combinations render correctly
    Evidence: .sisyphus/evidence/task-22/dashboard-{page}-{theme}-{viewport}.png (12 screenshots)

  Scenario: Logout flow from dashboard
    Tool: Playwright
    Preconditions: Logged in
    Steps:
      1. Navigate to /dashboard
      2. Click "Log Out" in header
      3. Assert redirected to /
      4. Assert token removed from localStorage
    Expected Result: Clean logout flow
    Evidence: .sisyphus/evidence/task-22/logout-success.png
  ```

  **Evidence to Capture**:
  - [ ] 12 visual QA screenshots
  - [ ] Logout success screenshot

  **Commit**: NO (QA evidence only)

---

- [x] 23. **Playwright QA — Regression (Auth Flows, Resume Creation)**

  **What to do**:
  - Execute regression tests to verify all existing functionality works:
    - **Signup flow**: navigate to /signup → fill form → submit → redirect to /dashboard → token in localStorage
    - **Login flow**: navigate to /login → fill form → submit → redirect to /dashboard → token in localStorage
    - **Resume creation**: navigate to / → type prompt → click build → redirect to /dashboard/[id] → iframe renders
    - **Logout flow**: click logout → redirect to / → token removed
    - **Theme persistence**: toggle dark → reload → dark persists
    - **Mobile nav**: open nav → navigate → nav closes → page loaded
    - **404 page**: navigate to /nonexistent → 404 page renders with brand styling
    - Record any deviations from expected behavior
    - Save evidence to `.sisyphus/evidence/task-23/`

  **Must NOT do**:
  - Don't skip any flow — each is a regression check

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: End-to-end regression testing across all critical user flows
  - **Skills**: [`dev-browser`]
    - `dev-browser`: Playwright for full user journey testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20-22)
  - **Blocks**: Final Verification
  - **Blocked By**: Tasks 1-19

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Full user journey (signup → create resume → view → logout)
    Tool: Playwright
    Preconditions: Backend running, clean state
    Steps:
      1. Navigate to /signup
      2. Fill: newuser@test.com / TestPass123!
      3. Submit → assert redirected to /dashboard
      4. Click "New Resume" → assert redirected to /
      5. Type prompt: "Experienced software engineer"
      6. Click "Build My Resume"
      7. Wait for redirect to /dashboard/[id]
      8. Assert PDF preview or generating state visible
      9. Click "Log Out" in header
      10. Assert redirected to /
    Expected Result: Complete user journey works end-to-end
    Failure Indicators: Any step fails
    Evidence: .sisyphus/evidence/task-23/full-journey.mp4 or series of screenshots

  Scenario: Theme persistence across navigation
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to /
      2. Toggle theme to dark
      3. Navigate to /login → assert still dark
      4. Navigate to /signup → assert still dark
      5. Navigate back to / → assert still dark
      6. Reload page → assert still dark
    Expected Result: Theme persists across all navigation
    Failure Indicators: Theme resets between pages
    Evidence: .sisyphus/evidence/task-23/theme-persistence.png (collage)
  ```

  **Evidence to Capture**:
  - [ ] Full user journey screenshots
  - [ ] Theme persistence evidence

  **Commit**: NO (QA evidence only)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build` (or `next build`). Review all changed files for: hardcoded colors (hex codes outside globals.css), leftover `.glass-card` / `.glass-card-strong` classes, `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic variable names.
  Output: `Build [PASS/FAIL] | Glass [N remaining] | Hardcoded [N instances] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: theme toggle in header + mobile nav + page navigation. Test edge cases: empty dashboard, very long resume titles, rapid theme toggling, mobile nav open + resize to desktop. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Wave | Commit Message | Files |
|------|---------------|-------|
| 1 | `feat(design): add design token system, theme infrastructure, and core components` | globals.css, layout.tsx, ThemeProvider.tsx, Logo.tsx, MobileNav.tsx, ThemeToggle.tsx |
| 2 | `feat(design): extract shared Layout, Header, Footer, and 404 page` | Header.tsx, Footer.tsx, Layout.tsx, not-found.tsx, HeroSection.tsx |
| 3 | `feat(design): redesign all pages with new brand identity and layout` | login/page.tsx, signup/page.tsx, page.tsx, FeaturesSection.tsx, SocialProofSection.tsx, BuilderSection.tsx, dashboard/page.tsx, dashboard/[resumeId]/page.tsx |
| 4 | `chore(design): remove legacy glass classes, hardcoded colors, and verify` | All files with .glass-card references, PdfPreview.tsx, detail page |

---

## Success Criteria

### Verification Commands
```bash
npm run dev          # Expected: App loads on localhost:3000 without errors
next build           # Expected: Successful build, no warnings
ls .sisyphus/evidence/*.png | wc -l  # Expected: >= 30 evidence screenshots
# Manual: Visit all 5 pages, toggle theme, test on mobile — all must work
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build succeeds with zero errors
- [ ] Zero `.glass-card` or `.glass-card-strong` references remaining
- [ ] Zero hardcoded hex colors outside globals.css
- [ ] All Playwright QA scenarios pass
- [ ] Design tokens system drives ALL visual decisions
- [ ] Dark mode works seamlessly across all pages
- [ ] No horizontal scroll at any viewport
- [ ] Auth flows (login, signup, logout) unchanged from current behavior
- [ ] Resume creation/refinement flow unchanged
