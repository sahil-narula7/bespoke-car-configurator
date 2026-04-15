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
```

## Repository

https://github.com/sahil-narula7/bespoke-car-configurator
