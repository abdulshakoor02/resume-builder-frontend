# Learnings - Scope Fidelity Check (ui-redesign)

## Date: 2026-07-05

### What went well
- All 20 implementation tasks faithfully matched their "What to do" specs
- CSS design token system is architecturally solid — all variables match plan color palette exactly
- Layout component's default/auth variant pattern correctly applied across all pages
- ZERO glass-card or gradient-text references remain (Task 18: fully compliant)
- All semantic utilities (btn-primary, card, input-field, badge, section-container) present and consistent
- Landing page successfully decomposed to 20-line section composition
- No unaccounted files — every modified file traces to a planned task

### What had minor gaps
- `amber-*` colors overlooked in ResumeCard status badge — only non-semantic color remaining
- `backdrop-blur` missed in the glassmorphism purge since Task 18 targeted class names, not CSS properties
- Animation cleanup was one-sided: globals.css removed slideDown/scaleIn but component references weren't cleaned
- Playwright dep technically violates "no new deps" but is required for plan-mandated QA

### Verification approach
- Direct file reads of all 6 key components + 5 pages + layout + globals.css
- Grep for: glass-card, gradient-text, gray-*, rose-*, emerald-*, indigo-*, backdrop-blur, hex codes
- git diff analysis for scope creep detection
- Plan-to-implementation mapping for all 20 tasks
