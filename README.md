# Sahil Narula Atelier

Luxury automotive commission and enquiry experience built with Next.js.

## Quick Start

### Live site

- Public site: https://sahilnarula-atelier.netlify.app/
- Owner login: https://sahilnarula-atelier.netlify.app/owner/login
- Owner dashboard: https://sahilnarula-atelier.netlify.app/owner

### Visitors

1. Open the public site.
2. Scroll to the commission form.
3. Fill in the form and submit.
4. The site confirms the request was received.

### Owner

1. Open the owner login page.
2. Sign in with the Netlify owner credentials.
3. View submissions in the dashboard.
4. Download today’s Excel file or log out.

## Owner Setup on Netlify

Set these environment variables on the production site:

```bash
OWNER_USERNAME=owner
OWNER_PASSWORD=your-strong-password
AUTH_SESSION_SECRET=another-long-random-secret
ADMIN_TOKEN=your-secret-token-here
```

Then trigger a new deploy in Netlify.

## Local Development

```bash
npm install
npm run dev
```

Open:

- http://localhost:3000
- http://localhost:3000/owner/login
- http://localhost:3000/owner

## Optional Sanity Variables

If you use Sanity CMS, add these too:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

## Owner Local Excel Sync

If the owner wants a spreadsheet on a local computer, use the sync worker:

```bash
SUBMISSIONS_API_URL=https://your-domain.com/api/admin/submissions?format=json
ADMIN_TOKEN=your-secret-token-here
OWNER_EXCEL_PATH=~/Downloads/owner-commission-submissions.xlsx
POLL_INTERVAL_MS=30000
```

Run:

```bash
npm run sync:excel
npm run sync:excel:watch
```

## Netlify Deploy

1. Push to GitHub.
2. In Netlify, import the repository.
3. Build command: `npm run build`.
4. Publish directory: `.next`.
5. Add the owner environment variables.
6. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run sync:excel
npm run sync:excel:watch
```

## Repository

https://github.com/sahilnarula7/bespoke-car-configurator
