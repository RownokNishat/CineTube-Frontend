# CineTube Frontend (L2B6-Frontend-PH-Healthcare-Management-System)

Frontend application for the Movie and Series Rating and Streaming Portal assignment.

## Overview

This app provides user and admin interfaces for:

- Authentication (email/password and social login redirect)
- Home page with featured sections and search/filter experience
- Media discovery and details pages
- Review, like, comment, and watchlist interactions
- User dashboard (watchlist, purchase history, subscription)
- Admin dashboard (media, genres, reviews, comments, users, payments, subscriptions)

## Requirement Coverage

Frontend screens and workflows align with the project requirements:

- User registration/login and profile flows
- Movie/series exploration with filters and sorting
- Media details with review and comment interactions
- Watchlist and purchase/subscription flows
- Admin content moderation and management dashboards
- Responsive layout for mobile and desktop

## Tech Stack

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Axios
- Zod

## Prerequisites

- Node.js 20+
- npm 10+
- Bun (required because scripts run bun --bun next ...)

## Project Structure

- src/app/(commonLayout)
- src/app/(dashboardLayout)
- src/components/modules
- src/components/ui
- src/services
- src/app/_actions
- src/lib
- src/types

## Environment Setup

Create a .env file in this folder with:

- NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1

If backend auth routes are used directly for OAuth redirects, ensure the base URL points to your deployed backend domain in production.

## Installation and Local Run

1. Install dependencies
	npm install

2. Start development server
	npm run dev

3. Open in browser
	http://localhost:3000

## Scripts

- npm run dev -> run Next.js in dev mode
- npm run build -> production build
- npm run start -> serve production build
- npm run lint -> lint src
- npm run type-check -> run TypeScript checks

## Backend Connection

The app consumes backend APIs from a5-prisma.

Required backend availability:

- Auth routes
- Media and genre routes
- Review and comment routes
- Watchlist routes
- Subscription and purchase routes
- Admin payment dashboard route

Reference docs:

- api-connection-documentation.md
- frontend-integration-guideline.md

## Admin and User Areas

### User Area

- Browse media catalog
- Submit reviews and comments
- Manage watchlist
- Access purchase history and subscription

### Admin Area

- Manage media library and genres
- Moderate reviews and comments
- Manage users
- View payment analytics and subscription information

## Deployment

### Vercel

1. Set NEXT_PUBLIC_API_BASE_URL to deployed backend base URL
2. Deploy frontend
3. Confirm cookies/CORS settings are aligned with backend FRONTEND_URL

## Submission Checklist

- Frontend repository includes this README
- Environment variable documented
- Build and lint commands documented
- Backend integration points documented
- User and admin feature scope documented
