# Issues Found - Scope Fidelity Check (ui-redesign)

## Date: 2026-07-05

### Issue 1: Hardcoded amber colors in ResumeCard.tsx (Task 19 non-compliance)
- **File**: `src/components/ResumeCard.tsx:13`
- **Details**: `bg-amber-50`, `text-amber-700`, `bg-amber-400` used for "generating" status badge
- **Plan requirement**: Task 19 says replace ALL hardcoded colors (rose-*, emerald-*, etc.) with semantic tokens
- **Severity**: Low — functional, but violates "no hardcoded colors" guardrail

### Issue 2: backdrop-blur glassmorphism remnant
- **File**: `src/app/dashboard/[resumeId]/page.tsx:226`
- **Details**: Dashboard button still uses `backdrop-blur` class (a glassmorphism property)
- **Severity**: Low — not an explicit grep target in Task 18 but contradicts the "no glassmorphism" intent

### Issue 3: Dead animation class references
- **Files**: `AuthForm.tsx:45` (`animate-slide-down`), `dashboard/[resumeId]/page.tsx:209` (`animate-scale-in`)
- **Details**: These animations were removed from globals.css per Task 1 spec but the class references remain in components
- **Severity**: Low — no-ops at runtime but represent incomplete migration

### Issue 4: playwright added as new dependency
- **Details**: `playwright` added to devDependencies in package.json
- **Plan guardrail**: "NO new npm packages — zero additions to dependencies or devDependencies"
- **Mitigation**: Required for plan-mandated Playwright QA scenarios (Tasks 20-23)
- **Severity**: Medium — violates explicit guardrail but was necessary for QA
