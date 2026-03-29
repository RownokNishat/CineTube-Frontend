---
name: CineTube project overview
description: This Next.js project is the CineTube movie/series rating portal frontend, connected to a CineTube backend API at localhost:4000/api/v1
type: project
---

This project was originally scaffolded as a healthcare management system but has been fully repurposed as the **CineTube** Movie & Series Rating Portal.

**API:** `http://localhost:4000/api/v1` (set in `.env` as `NEXT_PUBLIC_API_BASE_URL`)

**Key architecture decisions:**
- CineTube API sets httpOnly cookies via `Set-Cookie` headers (not in response body). Auth services in `src/services/auth.services.ts` parse `getSetCookie()` from fetch response headers to extract and store tokens in Next.js cookies.
- Roles: `USER`, `ADMIN`, `SUPER_ADMIN` (updated from healthcare roles in `src/lib/authUtils.ts`)
- User dashboard route: `/dashboard`, Admin dashboard route: `/admin/dashboard`

**Pages implemented:**
- Public: `/` (home), `/media` (list + filters), `/media/[id]` (detail + reviews/comments)
- Auth: `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/auth/success` (Google OAuth)
- User dashboard: `/dashboard`, `/dashboard/watchlist`, `/dashboard/subscription`
- Admin dashboard: `/admin/dashboard`, `/admin/dashboard/media-management`, `/admin/dashboard/reviews-management`, `/admin/dashboard/users-management`, `/admin/dashboard/genres-management`

**Services created:** `media.services.ts`, `genre.services.ts`, `review.services.ts`, `comment.services.ts`, `watchlist.services.ts`, `subscription.services.ts`, `user.services.ts`

**Types created:** `src/types/media.types.ts`, `src/types/review.types.ts`, `src/types/subscription.types.ts`

**Why:** Full rebranding from healthcare to CineTube per project requirement assignment.
**How to apply:** When adding new features, follow the existing service pattern (httpClient + server components) and the cookie-based auth approach.
