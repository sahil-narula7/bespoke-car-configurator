# Sahil Narula Atelier

Luxury automotive commission and enquiry experience built with Next.js App Router.

## Live Demo

- Netlify URL: https://sahilnarula-atelier.netlify.app/

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- GSAP + Lenis for smooth scroll and reveals
- Optional Sanity CMS content integration

## Features

- Premium single-page presentation with 3D hero canvas
- Product motion reel with sound controls and autoplay fallback
- Commission enquiry form with API endpoint validation
- Mobile navigation menu
- Favicon support via app/favicon.ico

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

http://localhost:3000

## Optional Environment Variables

If using Sanity CMS, create a .env.local file and configure:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

If these are not set, local fallback content is used.

For owner/admin access, also configure:

```bash
OWNER_USERNAME=owner
OWNER_PASSWORD=your-strong-password
ADMIN_TOKEN=your-secret-token-here
AUTH_SESSION_SECRET=another-long-random-secret
```

Notes:
- `OWNER_USERNAME` / `OWNER_PASSWORD` are used for owner login page.
- `ADMIN_TOKEN` still works for bearer-token API access (automation/scripts).
- `AUTH_SESSION_SECRET` signs the owner session cookie.

## Deploy to Netlify

### Option 1: Netlify UI (recommended)

1. Push code to GitHub
2. In Netlify, choose Add new site -> Import an existing project
3. Select repository: sahil-narula7/bespoke-car-configurator
4. Build command: npm run build
5. Publish directory: .next
6. Deploy site

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run sync:excel
npm run sync:excel:watch
```

## Owner Local Excel Auto-Update

If your site runs on a remote host, customer submissions are saved server-side. To keep an Excel file on the owner's local machine updated automatically, run the local sync worker.

Required environment variables:

```bash
SUBMISSIONS_API_URL=https://your-domain.com/api/admin/submissions?format=json
ADMIN_TOKEN=your-secret-token-here
OWNER_EXCEL_PATH=~/Downloads/owner-commission-submissions.xlsx
POLL_INTERVAL_MS=30000
```

Commands:

```bash
# One-time sync
npm run sync:excel

# Continuous background sync (polling)
npm run sync:excel:watch
```

## Owner Dashboard

Use owner login and dashboard routes:

- Login: `/owner/login`
- Dashboard: `/owner`

The dashboard shows submissions and allows Excel download while authenticated.

## Repository

https://github.com/sahil-narula7/bespoke-car-configurator
