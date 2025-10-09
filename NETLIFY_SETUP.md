# Netlify Setup (Production)

This project uses Next.js App Router with API routes that require Supabase. To run on Netlify, set the following environment variables and plugin.

## Required Environment Variables (case-sensitive)

Set these in Netlify → Site settings → Build & deploy → Environment → Environment variables.

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_STORAGE_BUCKET (default: `property-files`)
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (if using Google Maps)

## How to add variables (UI)

1. Open your site in Netlify
2. Go to Settings → Build & deploy → Environment → Environment variables
3. Add each variable with its value
4. Click Save
5. Go to Deploys → Trigger deploy → Clear cache and deploy site

## How to add variables (CLI)

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL https://YOUR-PROJECT.supabase.co --context production
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY <your-anon-key> --context production
netlify env:set SUPABASE_SERVICE_ROLE_KEY <your-service-role-key> --context production
netlify env:set SUPABASE_STORAGE_BUCKET property-files --context production
netlify env:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY <your-google-maps-key> --context production
```

Then trigger a new deploy from the Netlify UI (Deploys → Trigger deploy → Clear cache and deploy site).

## Build settings

This repo already contains `netlify.toml` and `@netlify/plugin-nextjs` configuration. No further build settings are required.

## Runtime notes

- Server-only Supabase client uses `SUPABASE_SERVICE_ROLE_KEY` in API routes. Ensure this key is set only in Netlify (never committed to git).
- API routes specify Node runtime, allowing secure access to secrets at runtime.
- If you see "Supabase admin not configured" errors, a required env var is missing in Netlify Production context. Double-check names and re-deploy with cache cleared.
