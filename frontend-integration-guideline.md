Fixed on backend. The key moderation mismatch is now resolved.

What I changed for reviews
1. Public media reviews endpoint remains public and returns published reviews only.
2. Added admin-only review list endpoint that supports status filtering (including pending).
3. Added explicit reject action for admins.
4. Enriched stats pending payload so admin UI can render pending queue directly.
5. Kept approve/unpublish/delete moderation endpoints for admin.

Backend review API map (final)

User/public review APIs
1. GET /api/v1/reviews/media/:mediaId
Purpose: public list for users. Returns published reviews only.
2. POST /api/v1/reviews/media/:mediaId
Purpose: create review (authenticated).
3. GET /api/v1/reviews/:reviewId
Purpose: get single review.
4. PATCH /api/v1/reviews/:reviewId
Purpose: author edits own unpublished review.
5. DELETE /api/v1/reviews/:reviewId
Purpose: author deletes own review.
6. POST /api/v1/reviews/:reviewId/like
Purpose: like review.
7. DELETE /api/v1/reviews/:reviewId/like
Purpose: unlike review.
8. GET /api/v1/reviews/:reviewId/comments
Purpose: list comments.
9. POST /api/v1/reviews/:reviewId/comments
Purpose: add comment.
10. PATCH /api/v1/reviews/comments/:commentId
Purpose: edit own comment.
11. DELETE /api/v1/reviews/comments/:commentId
Purpose: delete own comment.
12. POST /api/v1/reviews/comments/:commentId/replies
Purpose: reply to comment.
13. POST /api/v1/reviews/comments/:commentId/like
Purpose: like comment.
14. DELETE /api/v1/reviews/comments/:commentId/like
Purpose: unlike comment.

Admin moderation APIs
1. GET /api/v1/reviews/admin/media/:mediaId?status=PENDING&page=1&limit=10
Purpose: admin table source for pending/other statuses.
2. PATCH /api/v1/reviews/:reviewId/approve
Purpose: approve pending review to published.
3. PATCH /api/v1/reviews/:reviewId/reject
Purpose: reject pending review (marks unpublished).
4. PATCH /api/v1/reviews/:reviewId/unpublish
Purpose: unpublish published review.
5. DELETE /api/v1/reviews/:reviewId/admin
Purpose: admin delete inappropriate review.
6. DELETE /api/v1/reviews/comments/:commentId/admin
Purpose: admin delete inappropriate comment.
7. GET /api/v1/reviews/media/:mediaId/stats
Purpose: analytics + pending counts and pending summaries.

Frontend connection guideline (no code)

Admin reviews management
1. Stats card must call: /reviews/media/:mediaId/stats
2. Pending table must call: /reviews/admin/media/:mediaId?status=PENDING
3. Approved table should call: /reviews/admin/media/:mediaId?status=PUBLISHED
4. Rejected table should call: /reviews/admin/media/:mediaId?status=UNPUBLISHED
5. After approve/reject/unpublish/delete, immediately refetch both:
- stats endpoint
- current table endpoint

User reviews page
1. Reviews list should call only /reviews/media/:mediaId
2. Do not use admin endpoint on user screens.
3. Create review should optimistically add “pending moderation” state in UI.
4. If create returns 409, show “You already reviewed this title”.

Moderation state model to use in UI
1. PENDING: waiting admin action
2. PUBLISHED: visible publicly
3. UNPUBLISHED: rejected/hidden by admin

Expected status handling
1. 200/201: success
2. 400: validation/business rule error
3. 401: login required
4. 403: role/ownership denied
5. 404: review/comment/media not found
6. 409: duplicate action (already reviewed/liked)

Watchlist note
- Use /api/v1/watchlist/:mediaId for add/remove and /api/v1/watchlist/:mediaId/status for toggle checks.
- Backend now also supports compatibility shapes, but these param routes are the safest primary integration path.

Connection verification checklist
1. Admin pending count from stats equals row count from admin pending list query.
2. Approve action moves item from pending list to published list.
3. Reject action removes item from pending list and appears in unpublished list.
4. User-side list never shows pending/unpublished reviews.
5. Like/comment actions return correct counters after refetch.

One important security note
- Your .env content in chat includes real secrets (Stripe, DB, OAuth, SMTP, JWT). Rotate them immediately in provider dashboards.

Admin payments dashboard API contract

Recommended primary route
1. GET /api/v1/admin/payments/dashboard
Purpose: admin-only payment analytics for the payments management page.

Why this route
1. The current frontend page is admin-scoped, so this should not be a generic /stats endpoint.
2. Payment analytics should be isolated from unrelated admin dashboard metrics.
3. A dedicated route avoids future contract drift and makes authorization clearer.

Required auth
1. Require authenticated ADMIN or SUPER_ADMIN.
2. Return 401 if not logged in.
3. Return 403 if logged in but not admin.

Recommended query params
1. period=30d | 90d | 12m
Purpose: controls the analytics window.
2. groupBy=day | month
Purpose: controls chart bucket aggregation.

Minimum response shape required by current frontend
```json
{
	"success": true,
	"statusCode": 200,
	"message": "Payment dashboard fetched successfully",
	"data": {
		"paymentCount": 128,
		"userCount": 64,
		"totalRevenue": 5432.5,
		"barChartData": [
			{ "month": "2026-01-01T00:00:00.000Z", "count": 30 },
			{ "month": "2026-02-01T00:00:00.000Z", "count": 42 },
			{ "month": "2026-03-01T00:00:00.000Z", "count": 56 }
		],
		"pieChartData": [
			{ "status": "PAID", "count": 120 },
			{ "status": "PENDING", "count": 5 },
			{ "status": "FAILED", "count": 3 }
		]
	}
}
```

Field meanings
1. paymentCount
Purpose: total completed or finalized payment records in the selected period.
2. userCount
Purpose: distinct users who made payments in the selected period, or total platform users if that is what you want for revenue-per-user. Pick one rule and keep it stable.
3. totalRevenue
Purpose: sum of successful payment amounts.
4. barChartData
Purpose: time-series transaction counts. The frontend currently labels this as monthly trend, but it can support day or month buckets if the field name stays stable.
5. pieChartData
Purpose: grouped payment statuses for the “Payment Status Mix” card.

Recommended status enum values
1. PAID
2. PENDING
3. FAILED
4. REFUNDED
5. CANCELLED

Recommended backend aggregation rules
1. paymentCount should count only successful payments unless you explicitly want all attempts.
2. totalRevenue should include only successful captured payments.
3. pieChartData should include all tracked statuses, even if some counts are zero.
4. barChartData should be sorted ascending by time.
5. month should be an ISO string, even if the bucket is daily.

Optional but useful response additions
1. averagePaymentAmount
Purpose: removes the need for frontend calculation.
2. revenuePerUser
Purpose: removes ambiguity around which userCount denominator is used.
3. recentTransactions
Purpose: lets the admin page show a latest-payments table later.

Suggested recentTransactions shape
```json
{
	"id": "txn_123",
	"userId": "user_123",
	"userName": "John Doe",
	"userEmail": "john@example.com",
	"amount": 49.99,
	"currency": "USD",
	"status": "PAID",
	"source": "SUBSCRIPTION",
	"sourceId": "sub_123",
	"provider": "STRIPE",
	"providerPaymentId": "pi_123",
	"createdAt": "2026-03-31T08:00:00.000Z"
}
```

Related existing route you can keep separately
1. GET /api/v1/subscriptions/plans
Purpose: frontend already uses this for rendering plan cards on the same page.

Frontend connection note
1. If you implement GET /api/v1/admin/payments/dashboard, the frontend service should stop guessing with /stats fallbacks and call only this route.
2. The current page can already consume paymentCount, userCount, totalRevenue, barChartData, and pieChartData directly.

Verification checklist for backend
1. Admin can open /admin/dashboard/payments-management without 404.
2. Non-admin gets 403.
3. paymentCount matches the total of successful payment records.
4. totalRevenue matches Stripe or stored transaction totals for successful payments.
5. barChartData renders at least one bucket when payment data exists.
6. pieChartData includes stable status labels and counts.

## Implementation Status

**COMPLETED**: GET /api/v1/admin/payments/dashboard

Status: ✅ Live and tested
- Route: `GET /api/v1/admin/payments/dashboard`
- Auth: checkAuth(ADMIN, SUPER_ADMIN) - returns 403 if not admin
- Response: Matches the exact shape specified above
- Data aggregation:
  - paymentCount: sum of completed Purchase records + active Subscription records
  - userCount: distinct userId count from both payment types
  - totalRevenue: sum of amount fields from completed payments
  - barChartData: grouped by month (ISO string) with ascending sort
  - pieChartData: status distribution (COMPLETED, PENDING, FAILED)

Frontend service can now stop using the `/stats` fallback chain and call only `/admin/payments/dashboard`.

Home page and media catalog API contract

What the frontend now supports immediately
1. Home page uses existing media listing for:
- Top Rated This Week via `sortBy=averageRating`
- Newly Added via `sortBy=createdAt`
- Search + filters via `searchTerm`, `genre`, `streamingPlatform`, `releaseYear`
2. Media catalog page uses:
- `genre` filter
- `streamingPlatform` filter
- `releaseYear` filter
- `minRating` filter
- `sortBy=createdAt`
- `sortBy=averageRating`
- `sortBy=mostLiked` placeholder already wired on frontend

Backend additions required to fully satisfy the requested pages

1. Editor-curated and featured titles
Recommended fields on media model
1. `isFeatured: boolean`
2. `isEditorPick: boolean`

Recommended admin CRUD support
1. `POST /api/v1/media`
Accept optional fields:
- `isFeatured`
- `isEditorPick`
2. `PATCH /api/v1/media/:id`
Accept optional fields:
- `isFeatured`
- `isEditorPick`

Recommended public catalog query params
1. `GET /api/v1/media?featured=true`
Purpose: homepage featured spotlight candidates.
2. `GET /api/v1/media?editorPick=true`
Purpose: homepage editor’s picks section.

Recommended behavior
1. Only published media should be returned on public pages.
2. If `featured=true` is provided, return only featured published titles.
3. If `editorPick=true` is provided, return only editor-picked published titles.
4. Support combining these with `limit`, `page`, `sortBy`, `genre`, and `mediaType`.

2. Most liked sorting for All Movie/Series page
Recommended public route support
1. `GET /api/v1/media?sortBy=mostLiked&sortOrder=desc`
Purpose: sort titles by total likes across published reviews for that title.

Aggregation rule for `mostLiked`
1. For each media item, sum likes across all published reviews belonging to that media.
2. Sort descending by that aggregated count.
3. Break ties by `averageRating desc`, then `createdAt desc`.

Recommended response additions on media list item
```json
{
	"id": "media_123",
	"title": "Inception",
	"streamingPlatform": "Netflix",
	"averageRating": 8.8,
	"_count": {
		"reviews": 42,
		"likes": 315
	},
	"isFeatured": true,
	"isEditorPick": true
}
```

Why `_count.likes` matters
1. It lets the catalog card show popularity context.
2. It lets the frontend confirm the backend’s most-liked ordering.

3. Media details admin moderation support
Frontend behavior now expects this admin route to work on the media details page:
1. `GET /api/v1/reviews/admin/media/:mediaId?page=1&limit=50`
Purpose: fetch all review states for the current title when an admin is viewing the details page.

Expected review item shape
1. Include `status` on every review.
2. Include `_count.likes` and `_count.comments`.
3. Include user info for moderation context.

4. Existing moderation actions used on media details page
1. `PATCH /api/v1/reviews/:reviewId/approve`
2. `PATCH /api/v1/reviews/:reviewId/unpublish`
3. `DELETE /api/v1/reviews/:reviewId/admin`

Verification checklist for these page requirements
1. Home page featured spotlight changes when admin marks a title as featured.
2. Home page editor’s picks section contains only editor-picked published titles.
3. `/media?sortBy=mostLiked` returns titles ordered by total published review likes.
4. Media cards include platform, average rating, and review count.
5. Admin can open a media detail page and approve, unpublish, or delete a review inline.

Made changes.