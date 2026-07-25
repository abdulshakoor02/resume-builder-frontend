# Layout: FOUC Prevention, Fonts, and Metadata

## Learnings
- FOUC prevention script must be inline in `<head>` via `dangerouslySetInnerHTML`, not `next/script` — executes before React hydrates
- Script reads `localStorage.getItem('theme')` first, falls back to `matchMedia('(prefers-color-scheme: dark)')` if no stored preference
- Font CSS variables (`--font-inter`, `--font-instrument-serif`) are set on `<html className>` — referenced in `globals.css` `@theme`
- `ThemeProvider` wraps `AuthProvider` (outer = ThemeProvider, inner = AuthProvider) in the body
- OG meta tags and Twitter card are set via Next.js `Metadata` export — no manual `<meta>` tags needed
