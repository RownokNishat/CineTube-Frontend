**Missing / Incomplete Items**

Related handoff doc: see `frontend-integration-guideline.md` for current API integration rules and endpoint contracts.

1. **Rent flow is missing (only purchase exists)**
- Requirement asks for buy or rent (time-limited access).
- Current media payment service only has purchase endpoints in media.services.ts.
- No rent UI/action on details page in [src/app/(commonLayout)/media/[id]/page.tsx](src/app/(commonLayout)/media/[id]/page.tsx).

2. **Purchase history UI page is missing**
- Service exists (`getPurchasedMedia`) in media.services.ts, but no visible user page rendering purchased titles/history.
- I couldn’t find a dashboard/page wired to this API.

3. **Admin payments/sales analytics page is not implemented**
- Requirement asks for sales/rental analytics.
- Admin payments page is currently placeholder only in src/app/(dashboardLayout)/admin/dashboard/payments-management/page.tsx/admin/dashboard/payments-management/page.tsx).

4. **Admin comment moderation UI is missing**
- You now have backend admin comment delete endpoint, but frontend has no admin comment moderation screen/actions.
- Comment service currently has only user-level get/create/like in comment.services.ts.
- No admin comment management route/components found.

5. **Media filters missing required fields**
- Requirement includes filtering by streaming platform, release year, rating range, popularity.
- Current filter UI has search/type/pricing/genre/sort only in MediaFilters.tsx.

6. **“All Movie/Series” page does not match requirement wording**
- Requirement says this page should list published reviews and allow sort/filter like “Most Liked”.
- Current page lists media cards, not review feed, in src/app/(commonLayout)/media/page.tsx/media/page.tsx).

7. **Home page missing “Editor’s Picks” section**
- Home includes Top Rated + Newly Added + Movies/Series + pricing in src/app/(commonLayout)/page.tsx/page.tsx).
- No separate admin-curated “Editor’s Picks” section found.

8. **User edit/delete own unpublished reviews appears missing in UI**
- Requirement asks users can edit/delete their own unpublished reviews.
- User review section currently supports create/like/comment, but no edit/delete controls in ReviewSection.tsx.
- User review actions file also lacks update/delete actions in review.actions.ts.

9. **Extra informational pages (About/Contact/FAQ) not present**
- Requirement note suggests adding these.
- No routes/files found for About/Contact/FAQ.

**Partially Done (worth noting)**

1. **Admin review moderation is now mostly done**
- Approve/unpublish/admin-delete are wired in:
  - review.services.ts
  - src/app/(dashboardLayout)/admin/dashboard/reviews-management/_action.ts/admin/dashboard/reviews-management/_action.ts)
  - src/app/(dashboardLayout)/admin/dashboard/reviews-management/ReviewActionButtons.tsx/admin/dashboard/reviews-management/ReviewActionButtons.tsx)
- Stats panel support added via mediaId in src/app/(dashboardLayout)/admin/dashboard/reviews-management/page.tsx/admin/dashboard/reviews-management/page.tsx).

2. **Stripe purchase flow exists and works better now**
- Success verification + redirect path is in place, but still depends on authenticated session continuity.

If you want, I can now implement the highest-impact missing set in this order:
1. Admin comment moderation UI + actions  
2. Purchase history page for users  
3. Payments analytics page (admin)  
4. Media filters: platform, year, rating range, popularity