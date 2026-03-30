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

Made changes.