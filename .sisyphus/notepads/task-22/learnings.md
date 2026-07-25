# Task 22: Dashboard & Detail QA Learnings

## Key Findings
- Dashboard has NO middleware redirect. Auth guard is inline React (shows "Sign in to view your resumes" when no token).
- Layout component (default variant) wraps ALL pages via RootLayout with Header + Footer.
- Login page uses `Layout variant="auth"` but is still wrapped by outer Layout(default), so Header still appears on login page.
- Theme controlled via `localStorage('theme')` + `document.documentElement.classList` toggle.

## Tokens
- Token stored in `localStorage.getItem("token")`
- No backend running → unauthenticated state tested only
- Both dashboard and detail pages work without token (show guards/error states gracefully)

## Horizontal Scroll
- All viewports (375, 768, 1024) showed no horizontal scroll
- Responsive design works correctly
