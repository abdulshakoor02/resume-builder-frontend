# Fix Hydration Mismatch on `<html>` Element

## Problem
The inline `<script>` in `<head>` adds the `dark` class to `<html>` on the client before React hydrates, causing a server/client className mismatch.

## Fix
Add `suppressHydrationWarning` to the `<html>` tag in `src/app/layout.tsx` (line 47). This is the standard Next.js pattern for theme scripts that modify `<html>`.

```tsx
<html
  lang="en"
  className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
  suppressHydrationWarning
>
```

## File to change
- `src/app/layout.tsx` — add `suppressHydrationWarning` prop to `<html>`
