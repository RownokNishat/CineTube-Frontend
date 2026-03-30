# Premium Movies - Stripe Integration Implementation

## Overview
This document outlines the implementation of premium movie purchases using Stripe dummy payments in the healthcare management system.

## Changes Made

### 1. Environment Variables (.env)
Added Stripe configuration:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdefghijklmnop
STRIPE_SECRET_KEY=sk_test_abcdefghijklmnopqrstuvwxyz
```
> **Note**: Update these with your actual Stripe test keys from the [Stripe Dashboard](https://dashboard.stripe.com)

### 2. Media Services (`src/services/media.services.ts`)
Added three new functions for premium media handling:

#### `createMediaCheckoutSession(mediaId: string)`
- Initiates a Stripe checkout session for premium movies
- Returns checkout URL and session ID
- **Backend Endpoint**: `POST /media/purchase/checkout`

#### `getUserMediaAccess(mediaId: string)`
- Checks if the current user has access to a specific media
- Returns boolean access status
- **Backend Endpoint**: `GET /media/{id}/access`

#### `getPurchasedMedia()`
- Retrieves list of all media purchased by the user
- **Backend Endpoint**: `GET /media/purchases/my-purchases`

### 3. Server Actions (`src/app/_actions/media.actions.ts`)
Created new server actions for safe client-server communication:

#### `createMediaCheckoutSessionAction(mediaId: string)`
- Wraps the media checkout service with error handling
- Redirects to Stripe checkout on success

#### `checkUserMediaAccessAction(mediaId: string)`
- Validates user access to premium content
- Handles errors gracefully

### 4. Purchase Button Component (`src/components/modules/Media/PurchaseButton.tsx`)
New client component that:
- Shows "Sign in to Watch" for unauthenticated users
- Displays "Buy Now - $9.99" button for authenticated users
- Shows confirmation dialog before payment
- Displays loading state during checkout
- Handles errors and displays error messages
- Redirects to Stripe checkout URL on confirmation

**Features:**
- Login redirect for unauthenticated users
- Confirmation dialog with price display
- Loading indicators
- Error handling with user feedback
- Prevents duplicate submissions

### 5. Media Detail Page Updates (`src/app/(commonLayout)/media/[id]/page.tsx`)
Enhanced with premium content handling:

**Logic:**
- Free media: Always shows "Watch Now" button
- Premium media (not purchased): Shows "Buy Now" button
- Premium media (purchased): Shows "Watch Now" button
- Fetches user's purchase status for premium media
- Updated login prompt to mention purchase option

**Component Flow:**
```
Media Detail Page
├── Check user authentication
├── Fetch media details
├── If Premium: Check purchase status
└── Render appropriate button:
    ├── PurchaseButton (premium, not owned)
    ├── Watch Now (free or purchased)
    └── Login (unauthenticated)
```

### 6. Type Definitions (`src/types/media.types.ts`)
Added new types:

- **MediaPurchase**: Represents a completed purchase
  - userId, mediaId, purchaseDate
  - Stripe payment details
  - Status: COMPLETED | PENDING | FAILED

- **MediaCheckoutSession**: Stripe session response
  - checkoutUrl, sessionId

- **MediaAccessInfo**: User's access status
  - hasAccess boolean
  - Optional purchase details

## Backend Requirements

The frontend expects the following backend endpoints:

### 1. Create Checkout Session
```
POST /media/purchase/checkout
Body: { mediaId: string }
Response: { checkoutUrl: string, sessionId: string }
```

### 2. Check User Access
```
GET /media/{id}/access
Response: { hasAccess: boolean }
```

### 3. Get Purchased Media
```
GET /media/purchases/my-purchases
Response: Media[]
```

### 4. Payment Webhook (Backend only)
- Listen to `payment_intent.succeeded` events
- Update media purchase records in database
- Grant user access to premium content

## Frontend Flow

### User Journey - Purchasing Premium Movie

1. **View Premium Movie**
   - User visits media detail page
   - Premium badge shows on movie card
   - "Buy Now - $9.99" button displayed

2. **Initiate Purchase**
   - User clicks "Buy Now" button
   - Confirmation dialog appears with:
     - Movie title
     - Price ($9.99)
     - Confirmation message

3. **Stripe Checkout**
   - User confirms purchase
   - App calls `createMediaCheckoutSessionAction`
   - Frontend redirected to Stripe checkout page
   - User enters card details (test cards available)

4. **Payment Success**
   - Stripe processes payment
   - Backend webhook updates purchase record
   - Backend grants user access
   - User redirected back to app (via Stripe settings)

5. **Access Content**
   - User can now see "Watch Now" button
   - Direct access to streaming link

## Testing

### Stripe Test Cards
Use these for testing:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Any future expiry date and any 3-digit CVC.

### Test Scenarios
1. **Free Media**: No purchase button, direct "Watch Now"
2. **Premium Unowned**: Shows "Buy Now" button
3. **Premium Owned**: Shows "Watch Now" button
4. **Unauthenticated**: Shows "Sign in to Watch" button
5. **Failed Payment**: Error message displayed, can retry

## Configuration Notes

1. **Stripe Keys**
   - Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Use test keys for development
   - Switch to live keys for production

2. **Price Configuration**
   - Currently hardcoded to $9.99 in components
   - Can be made dynamic by adding price field to Media type
   - Backend can store per-movie pricing

3. **Access Duration**
   - Currently permanent (null expiryDate)
   - Can be modified for subscription-based access
   - Update MediaPurchase.expiryDate field as needed

## Security Considerations

1. **Client-side**: Never expose STRIPE_SECRET_KEY
2. **Server-side**: Validate all purchase requests
3. **Webhook**: Verify Stripe signatures
4. **Authorization**: Check user ownership before granting access
5. **Payment Verification**: Confirm payment before enabling access

## Future Enhancements

1. **Dynamic Pricing**: Configure price per movie
2. **Subscription Tiers**: Monthly/yearly premium access
3. **Rentals**: Time-limited access (24-48 hours)
4. **Bundles**: Purchase multiple movies at discount
5. **Wishlist Integration**: Notify on price drops
6. **Refunds**: Handle refund requests via Stripe
7. **Analytics**: Track purchase behavior and popular content

## Troubleshooting

### Checkout URL Not Generated
- Verify backend endpoint exists: `POST /media/purchase/checkout`
- Check Stripe keys in .env
- Ensure mediaId is valid

### "Sign in to Watch" Not Appearing
- Verify `getUserInfo()` is working
- Check authentication token in headers
- Verify user is actually logged in

### Access Status Not Updating
- Backend webhook may not be processing
- Check backend logs for Stripe webhook errors
- Verify database was updated on purchase

## File Structure
```
src/
├── _actions/
│   └── media.actions.ts (NEW)
├── services/
│   └── media.services.ts (UPDATED)
├── types/
│   └── media.types.ts (UPDATED)
├── components/
│   └── modules/Media/
│       └── PurchaseButton.tsx (NEW)
└── app/
    └── (commonLayout)/media/[id]/
        └── page.tsx (UPDATED)
```

## Related Configuration
- Stripe API keys location: `.env`
- Purchase button styling: Uses shadcn/ui components
- Icons used: lucide-react (Lock, AlertCircle, Loader2)
