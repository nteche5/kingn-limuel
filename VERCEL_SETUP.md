## Deploy to Vercel

Follow these steps to deploy this Next.js app to Vercel.

### 1) Create a Vercel project
- Push this repo to GitHub, GitLab, or Bitbucket
- Go to `https://vercel.com/new` and import the repository

### 2) Build settings (detected automatically)
- Framework preset: Next.js
- Build command: `next build`
- Output: `.vercel/output` (managed by Vercel)

No custom `vercel.json` is required.

### 3) Set environment variables
Set the following under Vercel → Project → Settings → Environment Variables (Production):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (used by admin/server only)
- `MAILCHANNELS_FROM` or `EMAIL_USER` (the "from" email used by contact form)
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `NEXT_PUBLIC_ADMIN_PASSWORD`

Optional alternatives if you switch email provider:
- `SENDGRID_API_KEY` (if you later enable SendGrid in `src/lib/emailService.ts`)

### 4) Add a custom domain (optional)
- In Vercel → Domains, add your domain and update DNS as instructed

### 5) Trigger a deploy
- Any push to the default branch will auto-deploy
- Use Preview Deployments for PRs

### Notes
- API routes under `src/app/api/*` run on Vercel Serverless by default
- Images are unoptimized on purpose (`images.unoptimized = true`) so no external loaders are required
- If you previously deployed to Cloudflare/Netlify, those configs are removed and won’t affect Vercel


