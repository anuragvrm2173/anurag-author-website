# Operations Guide

## 1. Deployment Process

### Production deploy

1. Install dependencies:
   - npm install
2. Run lint:
   - npm run lint
3. Build production bundle:
   - npm run build
4. Deploy to Vercel production:
   - npm run deploy

### Preview deploy

- npm run deploy:preview

## 2. Supabase Setup

### Initial bootstrap

1. Run database schema from supabase/schema.sql.
2. Generate seed SQL:
   - npm run seed:content
3. Run generated seed file:
   - supabase/seed-content.sql
4. Create storage bucket named media.
5. Add admin user record in public.admin_users.

### Required app environment values

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_ADMIN_ALLOWED_EMAIL

## 3. Vercel Environment Variables

Set all values from .env.example in Vercel project settings.

Minimum required for core production behavior:

- VITE_SITE_URL
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_ADMIN_ALLOWED_EMAIL
- VITE_CONTACT_FORM_ENDPOINT

Optional but recommended depending on integrations:

- VITE_TURNSTILE_SITE_KEY
- VITE_ADMIN_NOTIFICATION_ENDPOINT
- Newsletter provider values
- Analytics and verification values
- Social profile values

### Email notifications via Supabase Edge Function

For reliable first-party email notifications (recommended):

1. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy admin-notify --project-id <your-project-id>
   ```

2. **Set Edge Function secrets in Supabase dashboard:**
   ```bash
   supabase secrets set \
     RESEND_API_KEY="sk_live_..." \
     ADMIN_NOTIFY_TO_EMAIL="admin@example.com" \
     ADMIN_NOTIFY_ALLOWED_ORIGINS="https://anuragverma-author.vercel.app"
   ```

3. **Get the function URL** from Supabase Functions dashboard and set in Vercel:
   - `VITE_ADMIN_NOTIFICATION_ENDPOINT=https://<project-ref>.supabase.co/functions/v1/admin-notify`

4. **Redeploy production:**
   ```bash
   npm run deploy
   ```

If `VITE_ADMIN_NOTIFICATION_ENDPOINT` is not set, contact/review/buy-now forms will use `VITE_CONTACT_FORM_ENDPOINT` fallback (less reliable).

## 4. Backup Procedure

### Database backup

1. Use Supabase dashboard backup/export for Postgres snapshots.
2. Export key tables on a schedule:
   - books
   - blog_posts
   - reviews
   - messages
   - newsletter_subscribers
   - site_settings
   - admin_users
3. Store exports in a restricted backup location with retention policy.

### Media backup

1. Export the media storage bucket contents.
2. Store in versioned object storage with lifecycle policy.

## 5. Restore Procedure

### Database restore

1. Restore latest verified Postgres snapshot or SQL export.
2. Verify table row counts and key records.
3. Validate admin login and content rendering paths.

### Media restore

1. Restore media bucket files.
2. Spot-check public URLs used by admin media listing and book assets.

## 6. Admin Creation

1. Create user in Supabase Auth.
2. Insert user id and email into public.admin_users with role admin.
3. Confirm user email matches VITE_ADMIN_ALLOWED_EMAIL if fallback authorization is relied on.

## 7. Rotating Keys and Secrets

Rotate on a scheduled cadence and after any incident:

- Supabase anon key (if policy requires rotation)
- Newsletter provider API keys
- Contact/admin notification endpoint credentials
- Vercel project tokens used in CI/CD
- Turnstile site/secret pair (secret is backend only)

### Supabase Edge Function secrets rotation

For `admin-notify` function, these secrets are managed in Supabase project settings (not in .env):

- `RESEND_API_KEY` (required for email delivery)
- `ADMIN_NOTIFY_TO_EMAIL` (required, target inbox)
- `ADMIN_NOTIFY_FROM_EMAIL` (optional, defaults to Resend onboarding sender)
- `ADMIN_NOTIFY_ALLOWED_ORIGINS` (comma-separated origins allowed, e.g., `https://anuragverma-author.vercel.app`)
- `TURNSTILE_SECRET_KEY` (optional, enables Turnstile verification if set)

To rotate secrets:

1. Update values in Supabase project settings
2. Verify `VITE_ADMIN_NOTIFICATION_ENDPOINT` is still correct in Vercel
3. Redeploy Vercel production: `npm run deploy`

After rotation:

1. Update values in Vercel environment settings.
2. Redeploy.
3. Run smoke checks for contact, newsletter, review, buy-lead, and admin login flows.

## 8. Common Troubleshooting

### Build fails

- Run npm install and npm run lint.
- Ensure Node environment and dependency lock are consistent.

### Admin login fails

- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
- Verify admin user exists in auth.users and public.admin_users.
- Verify Auth redirect settings in Supabase dashboard.

### Forms succeed locally but not in production

- Check Vercel environment variables.
- Check CORS and endpoint availability.
- Confirm Turnstile is either configured correctly or intentionally disabled.

### Media upload/listing fails

- Confirm media bucket exists.
- Confirm storage policies permit intended operations.

### Analytics missing

- Verify GA and Clarity IDs in Vercel env.
- Confirm CSP and script loading in production HTML.

## 9. Security Validation Checklist

Before each production release:

1. Confirm security headers are present in vercel.json.
2. Confirm CSP still allows required integrations.
3. Confirm URL sanitization remains centralized and in use.
4. Confirm dialog accessibility behavior remains intact for active dialogs.
5. Run npm run lint and npm run build.
