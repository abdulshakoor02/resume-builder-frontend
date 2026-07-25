## Session Learnings — Layout Component

### Files Created
- `src/components/Layout.tsx` — Default variant (Header + main + Footer) and auth variant (centered content only)
- `src/components/Header.tsx` — Minimal stub with WeThinkDigital branding
- `src/components/Footer.tsx` — Minimal stub with copyright

### Files Modified
- `src/app/layout.tsx` — Imported Layout, wrapped `{children}` with `<Layout>`
- `src/app/login/page.tsx` — Imported Layout, wrapped content with `<Layout variant="auth">`
- `src/app/signup/page.tsx` — Same pattern as login

### Key Decisions
- Layout is purely structural (no route logic inside)
- Auth variant strips header/footer for auth pages (Premium SaaS pattern)
- Header/Footer stubs created since they were dependencies not yet built

### Final Manual QA Results — Task 24 (2026-07-05)

**VERDICT: APPROVE ✅**

All 6 test categories passed:

1. **Auth Layout Fix (CRITICAL)**: `/login` and `/signup` show only Logo + form content. NO header nav, NO footer. Bug regression confirmed fixed.

2. **Normal Layout**: `/` and `/dashboard` both render full `banner` header with nav links + `contentinfo` footer with product/company links.

3. **Dark Mode Persistence**: `.dark` class persisted across all page navigations (dashboard → / → /login → /signup). Toggle works both directions. Theme persists on all page types including auth pages.

4. **Mobile Responsiveness (375px)**: No horizontal scroll on any page. Hamburger menu ("Open navigation") present on landing. Auth pages render cleanly at mobile width.

5. **Page Status**: All pages render without 404: `/` (landing), `/login`, `/signup`, `/dashboard`. `/nonexistent` shows proper 404 page (Logo + "404" + "Page not found" + "Back to Home").

6. **Evidence**: 7 screenshots saved to `.sisyphus/evidence/task-24/`:
   - login-auth-layout-no-header.png (PROOF: auth page has no header)
   - landing-dark.png, login-dark.png, signup-dark.png (dark mode)
   - mobile-landing-375.png, mobile-hamburger-open-375.png (mobile)
   - 404-page.png (404 rendering)

**Known Issues (pre-existing, not regressions)**:
- Hydration mismatch warning on `<html>` className (font CSS modules) — Next.js dev mode artifact, present on all pages, unrelated to layout changes.

**Evidence from previous QA tasks (46 screenshots)** preserved in `.sisyphus/evidence/task-20/` through `task-23/`.
