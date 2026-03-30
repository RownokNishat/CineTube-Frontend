# CineTube Frontend Integration Guideline

## Base Setup
1. Base API URL: `https://cine-tube-backend-hto3.vercel.app/api/v1`
2. Auth model: cookie-based session (`better-auth.session_token` + access token cookie).
3. Frontend must send credentials on every protected request.
4. Shared response shape:
   - `success: boolean`
   - `message: string`
   - `data: object | array`
   - `meta` for paginated endpoints

## Critical Frontend Rules
1. Treat `401` as unauthenticated and redirect to login.
2. Treat `403` as role/permission denied.
3. Treat `409` as business conflict (already reviewed, already liked, already in watchlist, already purchased).
4. For delete requests, prefer path-parameter endpoints over body-based delete.
5. After payment success redirect, always verify purchase before showing `Watch Now`.

## 1. Auth + User APIs
1. `POST /auth/register`
2. `POST /auth/login`
3. `GET /auth/me`
4. `POST /auth/change-password`
5. `POST /auth/logout`
6. `GET /users/me`
7. `PATCH /users/me`
   - Body: `name` (required, min 2), `image` (optional URL or null)

## 2. Media Browse + Access APIs
1. `GET /media`
2. `GET /media/:id`
3. `GET /media/:id/access` (authenticated)
   - Output: `hasAccess`, `reason` (`free`, `purchased`, `purchase_required`)

UI rule:
1. If `hasAccess=true`: show `Watch Now`.
2. If `hasAccess=false`: show `Buy Now`.

## 3. Purchase APIs
1. `POST /media/purchase/checkout` (authenticated)
2. `GET /media/purchases/verify?sessionId=...` (authenticated)
3. `GET /media/purchases/my-purchases` (authenticated)
4. `POST /stripe/webhook` (backend-only)

Payment UX sequence:
1. User clicks Buy Now.
2. Checkout is created and user is redirected to Stripe.
3. Stripe returns to success page with `session_id`.
4. Frontend calls verify endpoint until confirmed.
5. Once confirmed, frontend calls `/media/:id/access` and switches button to `Watch Now`.

## 4. Watchlist APIs (authenticated)
1. `GET /watchlist`
2. `POST /watchlist/:mediaId`
   - Compatibility: `POST /watchlist` with `mediaId` in body/query
3. `DELETE /watchlist/:mediaId`
   - Also supports watchlist entry id
4. `GET /watchlist/:mediaId/status`
   - Compatibility: `/watchlist/status?mediaId=...`
5. `DELETE /watchlist/clear`

Best practice:
1. Use `/watchlist/:mediaId/status` for toggle state.
2. Use `/watchlist/:mediaId` for add/remove.
3. Avoid relying on DELETE body unless necessary.

## 5. Reviews, Likes, Comments (User)
1. `GET /reviews/media/:mediaId`
2. `POST /reviews/media/:mediaId` (authenticated)
3. `GET /reviews/:reviewId`
4. `PATCH /reviews/:reviewId` (authenticated, owner only, unpublished only)
5. `DELETE /reviews/:reviewId` (authenticated, owner only)
6. `POST /reviews/:reviewId/like`
7. `DELETE /reviews/:reviewId/like`
8. `GET /reviews/:reviewId/comments`
9. `POST /reviews/:reviewId/comments` (authenticated)
10. `PATCH /reviews/comments/:commentId` (authenticated, owner only)
11. `DELETE /reviews/comments/:commentId` (authenticated, owner only)
12. `POST /reviews/comments/:commentId/replies` (authenticated)
13. `POST /reviews/comments/:commentId/like`
14. `DELETE /reviews/comments/:commentId/like`

## 6. Review Moderation + Analytics (Admin)
1. `PATCH /reviews/:reviewId/approve`
2. `PATCH /reviews/:reviewId/unpublish`
3. `DELETE /reviews/:reviewId/admin`
4. `DELETE /reviews/comments/:commentId/admin`
5. `GET /reviews/media/:mediaId/stats`

## 7. Media Management (Admin)
1. `POST /media`
2. `PATCH /media/:id`
3. `DELETE /media/:id`

Use for catalog fields: title, synopsis, genre, year, director, cast, platform, pricing, links, poster, status.

## 8. Frontend Integration Checklist
1. Configure one API client with credentials enabled.
2. Centralize handling for `401`, `403`, `409`, `422/400`, `500`.
3. Build auth guard using `/auth/me` or `/users/me`.
4. Build entitlement guard using `/media/:id/access`.
5. Build purchase success flow around `/media/purchases/verify`.
6. Build watchlist toggle around `/watchlist/:mediaId/status`.
7. Build optimistic UI for likes/comments/watchlist with rollback on failure.
8. Build admin-only routes/pages gated by role.
9. Use server messages for toast notifications.
10. For paginated endpoints, always consume `meta`.
