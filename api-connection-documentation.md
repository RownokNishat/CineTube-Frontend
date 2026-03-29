# CineTube API — Frontend Integration Guide

> A complete reference for connecting any frontend (Next.js, React, etc.) to the CineTube backend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Environment Setup](#3-environment-setup)
4. [Running the Server](#4-running-the-server)
5. [Base URL & Response Format](#5-base-url--response-format)
6. [Authentication System](#6-authentication-system)
7. [API Endpoints Reference](#7-api-endpoints-reference)
8. [Frontend Integration Guide](#8-frontend-integration-guide)
9. [Data Models Reference](#9-data-models-reference)
10. [Error Handling](#10-error-handling)
11. [File Uploads](#11-file-uploads)
12. [Payments (Stripe)](#12-payments-stripe)
13. [Deployment](#13-deployment)

---

## 1. Project Overview

**CineTube** is a movie and series rating & streaming portal. The backend is a RESTful API built with Node.js, Express, TypeScript, and Prisma ORM (PostgreSQL).

**Key Features:**
- Email/password authentication with OTP email verification
- Google OAuth login
- Session-based auth via `better-auth`
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Media management (movies & series with genres, pricing tiers)
- Review & rating system with nested comments and likes
- Watchlist per user
- Subscription plans (Free, Monthly, Yearly) via Stripe
- Cloudinary file uploads
- Email notifications via Nodemailer

---

## 2. Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js 20+                         |
| Framework    | Express 5                           |
| Language     | TypeScript 5                        |
| ORM          | Prisma 7 (PostgreSQL)               |
| Auth         | better-auth 1.5 + JWT               |
| Payments     | Stripe                              |
| File Storage | Cloudinary                          |
| Email        | Nodemailer (SMTP)                   |
| Validation   | Zod 4                               |
| Build        | tsx (dev) / esbuild (prod)          |

---

## 3. Environment Setup

Create a `.env` file in the `a5-prisma/` directory using this template:

```env
# Server
PORT=4000
NODE_ENV=development

# Database (PostgreSQL connection string)
DATABASE_URL="postgres://username:password@host:5432/database?sslmode=require"

# Frontend URL (used for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:3000

# Better-auth
BETTER_AUTH_SECRET=your-secret-32-chars-minimum
BETTER_AUTH_URL=http://localhost:4000

# JWT
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (SMTP)
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=587
EMAIL_SENDER_SMTP_USER=your-email@gmail.com
EMAIL_SENDER_SMTP_PASS=your-app-password
EMAIL_SENDER_SMTP_FROM="CineTube <noreply@cinetube.com>"

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Super Admin (auto-seeded on first run)
SUPER_ADMIN_EMAIL=superadmin@cinetube.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
```

---

## 4. Running the Server

```bash
# Install dependencies
npm install

# Run Prisma migrations
npm run migrate

# Seed the database (creates super admin)
# This runs automatically on server start

# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Prisma Studio (database GUI)
npm run studio
```

The server starts at `http://localhost:4000` by default.

---

## 5. Base URL & Response Format

### Base URL

```
Development:  http://localhost:4000/api/v1
Production:   https://your-domain.vercel.app/api/v1
```

> **Note:** The `better-auth` routes are at `/api/auth/*` (not `/api/v1/auth`). The custom auth routes (`/api/v1/auth/*`) wrap the better-auth internals with additional logic.

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

**Paginated List:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Media fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [ ... ]
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized access! No session token provided.",
  "errorDetails": { ... }
}
```

---

## 6. Authentication System

The project uses **two layers** of authentication:

| Layer | Purpose | Cookie Name |
|-------|---------|------------|
| `better-auth` session | Primary session management, OAuth | `better-auth.session_token` |
| JWT access token | API request authorization | `accessToken` |
| JWT refresh token | Token renewal | `refreshToken` |

All cookies are `httpOnly`, `sameSite: none`, `secure: true`.

### Authentication Flow

```
1. User registers / logs in
   → Server creates better-auth session
   → Server sets accessToken and refreshToken cookies

2. Each protected request
   → Middleware checks better-auth.session_token cookie
   → Middleware also verifies accessToken JWT
   → req.user is populated with { userId, role, email }

3. Token expiry
   → Call POST /api/v1/auth/refresh-token to renew accessToken
```

### Frontend Auth Configuration

When making requests from your frontend, **always include credentials**:

```typescript
// fetch
fetch(`${BASE_URL}/api/v1/auth/me`, {
  credentials: "include",
})

// axios
axios.defaults.withCredentials = true

// Next.js fetch (server component)
fetch(`${BASE_URL}/api/v1/auth/me`, {
  credentials: "include",
  cache: "no-store",
})
```

### CORS — Allowed Origins

The server allows requests from:
- `http://localhost:3000`
- `http://localhost:5000`
- The value of `FRONTEND_URL` env variable
- The value of `BETTER_AUTH_URL` env variable

To add your frontend URL, set `FRONTEND_URL` in `.env`.

---

## 7. API Endpoints Reference

### 7.1 Auth Routes — `/api/v1/auth`

#### POST `/api/v1/auth/register`
Register a new user. Triggers email verification OTP.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Response:** `201`
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

#### POST `/api/v1/auth/login`
Login with email and password.

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Response:** `200` — Sets `accessToken`, `refreshToken`, `better-auth.session_token` cookies.
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```

---

#### GET `/api/v1/auth/login/google`
Initiate Google OAuth. Redirect the user to this URL.

```typescript
// In your frontend:
window.location.href = `${BASE_URL}/api/v1/auth/login/google`
```

---

#### GET `/api/v1/auth/google/success`
Callback URL after successful Google OAuth. Redirects to `FRONTEND_URL/auth/success`.

---

#### GET `/api/v1/auth/me`
Get the currently authenticated user. **Protected.**

**Response:** `200`
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "ACTIVE",
    "image": null,
    "profile": { ... }
  }
}
```

---

#### POST `/api/v1/auth/verify-email`
Verify email with OTP sent during registration.

**Request body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

---

#### POST `/api/v1/auth/forget-password`
Request a password reset OTP via email.

**Request body:**
```json
{
  "email": "john@example.com"
}
```

---

#### POST `/api/v1/auth/reset-password`
Reset password using OTP.

**Request body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPassword@123"
}
```

---

#### POST `/api/v1/auth/change-password`
Change password for logged-in user. **Protected.**

**Request body:**
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

---

#### POST `/api/v1/auth/refresh-token`
Get a new access token using the refresh token cookie.

**Response:** Sets new `accessToken` cookie.

---

#### POST `/api/v1/auth/logout`
Logout the user. Clears all auth cookies.

---

### 7.2 User Routes — `/api/v1/users`

#### GET `/api/v1/users`
Get all users. **Protected (ADMIN, SUPER_ADMIN only).**

**Query params:**
```
?page=1&limit=10&searchTerm=john&role=USER&status=ACTIVE
```

---

#### GET `/api/v1/users/:id`
Get a single user by ID. **Protected.**

---

#### PATCH `/api/v1/users/:id`
Update user profile. **Protected.**

**Request body (multipart/form-data):**
```
name: string
image: File (optional)
```

---

#### DELETE `/api/v1/users/:id`
Soft-delete a user. **Protected (ADMIN, SUPER_ADMIN only).**

---

### 7.3 Media Routes — `/api/v1/media`

#### GET `/api/v1/media`
Get all published media (movies & series). Public.

**Query params:**
```
?page=1
&limit=10
&searchTerm=inception
&mediaType=MOVIE           # MOVIE | SERIES
&pricingType=FREE          # FREE | PREMIUM
&genre=Action
&releaseYear=2010
&sortBy=createdAt          # Field to sort by
&sortOrder=desc            # asc | desc
```

---

#### GET `/api/v1/media/:id`
Get a single media item with full details.

---

#### POST `/api/v1/media`
Create a new media entry. **Protected (ADMIN, SUPER_ADMIN only).**

**Request body (multipart/form-data):**
```
title: string
synopsis: string
releaseYear: number
director: string
cast: string[]
mediaType: MOVIE | SERIES
pricingType: FREE | PREMIUM
streamingLink: string (url)
streamingPlatform: string
genreIds: string[]
poster: File
trailer: string (url, optional)
```

---

#### PATCH `/api/v1/media/:id`
Update a media entry. **Protected (ADMIN, SUPER_ADMIN only).**

---

#### DELETE `/api/v1/media/:id`
Delete a media entry. **Protected (ADMIN, SUPER_ADMIN only).**

---

### 7.4 Genre Routes — `/api/v1/genres`

#### GET `/api/v1/genres`
Get all genres. Public.

**Response:**
```json
{
  "data": [
    { "id": "genre_id", "name": "Action" },
    { "id": "genre_id", "name": "Drama" }
  ]
}
```

---

#### POST `/api/v1/genres`
Create a genre. **Protected (ADMIN, SUPER_ADMIN only).**

```json
{ "name": "Thriller" }
```

---

### 7.5 Review Routes — `/api/v1/reviews`

#### GET `/api/v1/reviews`
Get all published reviews. Public.

**Query params:**
```
?mediaId=media_id&page=1&limit=10&sortBy=rating&sortOrder=desc
```

---

#### POST `/api/v1/reviews`
Create a review. **Protected (USER).**

```json
{
  "mediaId": "media_id",
  "rating": 8,
  "content": "Great movie!",
  "isSpoiler": false,
  "tags": ["cinematography", "acting"]
}
```

---

#### PATCH `/api/v1/reviews/:id`
Update own review. **Protected.**

---

#### DELETE `/api/v1/reviews/:id`
Delete own review or any review (admin). **Protected.**

---

#### POST `/api/v1/reviews/:id/like`
Toggle like on a review. **Protected.**

---

### 7.6 Comment Routes — `/api/v1/comments`

#### GET `/api/v1/comments`
Get comments for a review.

```
?reviewId=review_id&page=1&limit=10
```

---

#### POST `/api/v1/comments`
Add a comment to a review. **Protected.**

```json
{
  "reviewId": "review_id",
  "content": "I agree!",
  "parentId": null
}
```

> Set `parentId` to an existing comment ID to reply to a comment.

---

#### POST `/api/v1/comments/:id/like`
Toggle like on a comment. **Protected.**

---

### 7.7 Watchlist Routes — `/api/v1/watchlist`

#### GET `/api/v1/watchlist`
Get current user's watchlist. **Protected.**

---

#### POST `/api/v1/watchlist`
Add media to watchlist. **Protected.**

```json
{ "mediaId": "media_id" }
```

---

#### DELETE `/api/v1/watchlist/:mediaId`
Remove from watchlist. **Protected.**

---

### 7.8 Subscription Routes — `/api/v1/subscriptions`

#### GET `/api/v1/subscriptions/plans`
Get available subscription plans and pricing. Public.

---

#### GET `/api/v1/subscriptions/me`
Get current user's active subscription. **Protected.**

---

#### POST `/api/v1/subscriptions/checkout`
Create a Stripe checkout session. **Protected.**

```json
{ "plan": "MONTHLY" }
```

**Response:**
```json
{
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}
```

Redirect the user to `checkoutUrl`.

---

#### POST `/api/v1/subscriptions/cancel`
Cancel active subscription. **Protected.**

---

---

## 8. Frontend Integration Guide

### 8.1 Next.js Setup (Recommended)

**Install dependencies:**
```bash
npm install axios js-cookie
# or
npm install @tanstack/react-query axios
```

**Create an API client (`lib/api.ts`):**
```typescript
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  withCredentials: true,               // required for cookies
  headers: { "Content-Type": "application/json" },
})

// Auto-retry with refreshed token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await api.post("/auth/refresh-token")
        return api(original)
      } catch {
        // Redirect to login
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)
```

**Environment variable (`next.config.ts`):**
```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### 8.2 Auth Integration

**Login:**
```typescript
const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password })
  return data.data  // user object
}
```

**Register:**
```typescript
const register = async (name: string, email: string, password: string) => {
  const { data } = await api.post("/auth/register", { name, email, password })
  return data.data
}
```

**Get current user (client-side):**
```typescript
const getMe = async () => {
  const { data } = await api.get("/auth/me")
  return data.data
}
```

**Get current user (Next.js server component):**
```typescript
import { cookies } from "next/headers"

async function getUser() {
  const cookieStore = cookies()
  const res = await fetch(`${process.env.API_URL}/api/v1/auth/me`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.data
}
```

**Google OAuth:**
```typescript
// Redirect to initiate OAuth
const loginWithGoogle = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login/google`
}

// After redirect, backend sends user to: FRONTEND_URL/auth/success
// Create this page to handle post-OAuth state
```

**Logout:**
```typescript
const logout = async () => {
  await api.post("/auth/logout")
  // Clear any local state and redirect
  router.push("/login")
}
```

---

### 8.3 Querying Media

```typescript
// All movies
const { data } = await api.get("/media", {
  params: { mediaType: "MOVIE", page: 1, limit: 10 }
})

// Search
const { data } = await api.get("/media", {
  params: { searchTerm: "inception" }
})

// Single media with reviews
const { data } = await api.get(`/media/${mediaId}`)
```

---

### 8.4 File Uploads (Cloudinary via API)

When uploading a poster image:
```typescript
const uploadMedia = async (formData: FormData) => {
  const { data } = await api.post("/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.data
}
```

---

### 8.5 Subscription Checkout

```typescript
const subscribe = async (plan: "MONTHLY" | "YEARLY") => {
  const { data } = await api.post("/subscriptions/checkout", { plan })
  // Redirect to Stripe
  window.location.href = data.data.checkoutUrl
}
```

After payment, Stripe redirects back to the URL configured in your Stripe dashboard.

---

### 8.6 TanStack Query Example

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Get media list
export const useMedia = (params = {}) =>
  useQuery({
    queryKey: ["media", params],
    queryFn: () => api.get("/media", { params }).then((r) => r.data),
  })

// Get current user
export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then((r) => r.data.data),
    retry: false,
  })

// Login mutation
export const useLogin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api.post("/auth/login", body).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  })
}
```

---

## 9. Data Models Reference

### User

```typescript
type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
  status: "ACTIVE" | "BLOCKED" | "DELETED"
  needPasswordChange: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

### Media

```typescript
type Media = {
  id: string
  title: string
  synopsis: string
  releaseYear: number
  director: string
  cast: string[]
  streamingPlatform: string
  streamingLink: string
  posterUrl: string
  trailerUrl: string | null
  mediaType: "MOVIE" | "SERIES"
  status: "DRAFT" | "PUBLISHED"
  pricingType: "FREE" | "PREMIUM"
  createdAt: string
  updatedAt: string
  genres: Genre[]
}
```

### Review

```typescript
type Review = {
  id: string
  userId: string
  mediaId: string
  rating: number             // 1–10
  content: string
  isSpoiler: boolean
  tags: string[]
  status: "PENDING" | "PUBLISHED" | "UNPUBLISHED"
  createdAt: string
  user: Pick<User, "id" | "name" | "image">
  _count: { likes: number; comments: number }
}
```

### Subscription

```typescript
type Subscription = {
  id: string
  userId: string
  plan: "FREE" | "MONTHLY" | "YEARLY"
  status: "ACTIVE" | "EXPIRED" | "CANCELLED"
  startDate: string
  endDate: string
  amount: number
  stripeCustomerId: string | null
  stripePaymentId: string | null
}
```

---

## 10. Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK |
| 201  | Created |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (not logged in or token expired) |
| 403  | Forbidden (insufficient role) |
| 404  | Not Found |
| 409  | Conflict (e.g., email already exists) |
| 500  | Internal Server Error |

### Validation Errors (Zod)

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorDetails": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Frontend Error Handler

```typescript
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong"
    const statusCode = error.response?.status

    // Show toast or redirect based on statusCode
    if (statusCode === 401) router.push("/login")
    else toast.error(message)

    return Promise.reject(error)
  }
)
```

---

## 11. File Uploads

The server uses **Multer** for multipart parsing and **Cloudinary** for storage.

**Supported upload fields:**

| Endpoint | Field Name | Type |
|----------|------------|------|
| POST /media | `poster` | image |
| PATCH /users/:id | `image` | image |

**Max file size:** Configured in `multer.config.ts` (default: 5MB).

**Returned URL format:** `https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}`

---

## 12. Payments (Stripe)

### Webhook Setup

For local development, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:4000/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`.

### Subscription Plans

| Plan | Duration |
|------|----------|
| FREE | Unlimited |
| MONTHLY | 30 days |
| YEARLY | 365 days |

### Checkout Flow

```
1. Frontend → POST /api/v1/subscriptions/checkout { plan: "MONTHLY" }
2. Backend  → Creates Stripe checkout session → Returns { checkoutUrl }
3. Frontend → Redirects user to checkoutUrl
4. Stripe   → Processes payment → Sends webhook to backend
5. Backend  → Updates subscription status in DB
6. Stripe   → Redirects user to success/cancel URL (configured in Stripe Dashboard)
```

---

## 13. Deployment

### Vercel (Recommended)

The project includes `vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "dist/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "dist/server.js" }]
}
```

**Steps:**
1. Push to GitHub
2. Import in Vercel
3. Set all environment variables in Vercel dashboard
4. Set `FRONTEND_URL` to your deployed frontend URL
5. Set `BETTER_AUTH_URL` to your Vercel deployment URL
6. Deploy

**Build command:** `npm run build` (runs `prisma generate && tsc`)

### Environment Variables for Production

Make sure to update these for production:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
BETTER_AUTH_URL=https://your-backend.vercel.app
DATABASE_URL=<production-neon/supabase/railway-url>
```

> **Note:** `better-auth` cookies are configured with `secure: true` and `sameSite: none` to support cross-origin cookie sharing between frontend and backend on different domains.

---

## Quick Reference Cheatsheet

```
POST   /api/v1/auth/register          — Register
POST   /api/v1/auth/login             — Login
GET    /api/v1/auth/me                — Get current user [auth]
POST   /api/v1/auth/logout            — Logout [auth]
POST   /api/v1/auth/refresh-token     — Refresh access token
POST   /api/v1/auth/verify-email      — Verify email OTP
POST   /api/v1/auth/forget-password   — Request reset OTP
POST   /api/v1/auth/reset-password    — Reset password
POST   /api/v1/auth/change-password   — Change password [auth]
GET    /api/v1/auth/login/google      — Google OAuth

GET    /api/v1/users                  — List users [admin]
GET    /api/v1/users/:id              — Get user [auth]
PATCH  /api/v1/users/:id             — Update user [auth]

GET    /api/v1/media                  — List media
GET    /api/v1/media/:id              — Get media
POST   /api/v1/media                  — Create media [admin]
PATCH  /api/v1/media/:id             — Update media [admin]
DELETE /api/v1/media/:id             — Delete media [admin]

GET    /api/v1/genres                 — List genres
POST   /api/v1/genres                 — Create genre [admin]

GET    /api/v1/reviews                — List reviews
POST   /api/v1/reviews                — Create review [auth]
POST   /api/v1/reviews/:id/like       — Toggle like [auth]

GET    /api/v1/comments               — List comments
POST   /api/v1/comments               — Add comment [auth]
POST   /api/v1/comments/:id/like      — Toggle like [auth]

GET    /api/v1/watchlist              — Get watchlist [auth]
POST   /api/v1/watchlist              — Add to watchlist [auth]
DELETE /api/v1/watchlist/:mediaId     — Remove from watchlist [auth]

GET    /api/v1/subscriptions/plans    — Get plans
GET    /api/v1/subscriptions/me       — My subscription [auth]
POST   /api/v1/subscriptions/checkout — Start checkout [auth]
POST   /api/v1/subscriptions/cancel   — Cancel subscription [auth]
```

---

*Generated for a5-prisma — CineTube Backend*
