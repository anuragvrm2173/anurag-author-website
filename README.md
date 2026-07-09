# Anurag Verma Author Website

A premium editorial React application for books, essays, and reader connection.

## 📚 Documentation

Additional project documentation:

- **CHANGELOG.md** - Release history and notable changes.
- **OPERATIONS.md** - Deployment, Supabase setup, environment variables, backups, security, and production operations.
- **CONTRIBUTING.md** - Development workflow, coding standards, branching strategy, and pull request guidelines.

Before making production changes, review **OPERATIONS.md**.

For development conventions, see **CONTRIBUTING.md**.

## Project Structure

```text
src/
 ├── components/
 ├── pages/
 ├── sections/
 ├── services/
 ├── hooks/
 ├── context/
 ├── layouts/
 ├── routes/
 ├── data/
 ├── utils/
 └── assets/
```

## Architecture Overview

```text
Public Website
  │
  ▼
Runtime Services
  │
 ┌──────┴──────┐
 │             │
Supabase   JS Fallback
  │
  ▼
Admin CMS
```

## Core Routes
- `/`
- `/about`
- `/library`
- `/library/:bookId`
- `/reviews`
- `/blog`
- `/contact`
- `/search`
- `/privacy`
- `/terms`
- `*` (404)

## Design System
- Background: `#F8F6F1`
- Primary text: `#111111`
- Body text: `#2B2B2B`
- Accent: `#C9A34E`
- Heading font: `Cormorant Garamond`
- Body font: `Inter`
- Principles: editorial spacing, luxury typography, minimal motion, responsive-first

## Book Data Model
Each book in `src/data/books.js` follows a complete launch schema:

```js
{
  id,
  slug,
  title,
  subtitle,
  shortDescription,
  longDescription,
  description,
  genres: [],
  themes: [],
  status,
  publicationDate,
  pages,
  language,
  isbn,
  publisher,
  formats: {
    paperback,
    ebook
  },
  purchaseLinks: {},
  sampleId,
  relatedBooks: [],
  seo: {},
  synopsis: [],
  discoveries: [],
  editions: {
    english: {},
    hindi: {}
  }
}
```

## Content Architecture
- One source of truth for books: `src/data/books.js`
- One source of truth for reviews: `src/data/reviews.js`
- One source of truth for timeline milestones: `src/data/timeline.js`
- One source of truth for social links: `src/data/socialLinks.js`
- One source of truth for blog posts: `src/data/blog.js`

## Reader
- Keyboard navigation (`ArrowLeft`, `ArrowRight`)
- Swipe navigation on touch devices
- Focus-trapped modal with Escape support
- Edition-specific sample previews

## Contact
- Supabase-backed message storage when configured
- FormSubmit endpoint fallback when Supabase is unavailable
- Success and error feedback states

## Admin
- Protected `/admin` route tree for dashboard, books, blog, reviews, messages, newsletter, media, and settings
- Supabase Auth session-based access
- `admin_users` role table controls admin/editor access

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Available Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
npm run generate:seo
npm run seed:content
npm run optimize:images
npm run deploy
npm run deploy:preview
```

## Seed Content
Generate SQL to seed the current JS books, blog content, site config, and social links into Supabase:

```bash
npm run seed:content
```

This writes [supabase/seed-content.sql](/workspaces/anurag-author-website/supabase/seed-content.sql).

## Supabase Bootstrap
Recommended order:

```bash
npm run seed:content
```

1. Run [supabase/schema.sql](/workspaces/anurag-author-website/supabase/schema.sql) in Supabase SQL Editor.
2. Run [supabase/seed-content.sql](/workspaces/anurag-author-website/supabase/seed-content.sql).
3. Create a `media` storage bucket.
4. Add your admin auth user to `public.admin_users`.

Example admin insert after the user exists in `auth.users`:

```sql
insert into public.admin_users (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'Vanuragverma2173@gmail.com'
on conflict (id) do update set
  email = excluded.email,
  role = excluded.role;
```

## Environment
Copy `.env.example` to `.env.local` and fill in the values needed for production.

Variables (must match `.env.example`):
- `VITE_SITE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_ALLOWED_EMAIL`
- `VITE_TURNSTILE_SITE_KEY`
- `VITE_NEWSLETTER_PROVIDER`
- `VITE_NEWSLETTER_PROXY_ENDPOINT`
- `VITE_CONVERTKIT_ENDPOINT`
- `VITE_CONVERTKIT_API_KEY`
- `VITE_CONVERTKIT_FORM_ID`
- `VITE_MAILERLITE_ENDPOINT`
- `VITE_MAILERLITE_API_KEY`
- `VITE_BREVO_ENDPOINT`
- `VITE_BREVO_API_KEY`
- `VITE_BREVO_LIST_ID`
- `VITE_CONTACT_FORM_ENDPOINT`
- `VITE_ADMIN_NOTIFICATION_ENDPOINT`
- `VITE_CONTACT_EMAIL_URL`
- `VITE_SOCIAL_INSTAGRAM_URL`
- `VITE_SOCIAL_YOUTUBE_URL`
- `VITE_SOCIAL_AMAZON_AUTHOR_URL`
- `VITE_SOCIAL_GOODREADS_URL`
- `VITE_GOOGLE_SITE_VERIFICATION`
- `VITE_BING_SITE_VERIFICATION`
- `VITE_GA_MEASUREMENT_ID`
- `VITE_CLARITY_PROJECT_ID`

## Deployment
The project is prepared for Vercel with:
- SPA rewrites in `vercel.json`
- build-time `robots.txt` and `sitemap.xml` generation
- environment-driven production domain and analytics configuration

Recommended deployment flow:

```bash
npm install
npm run build
npm run deploy
```

If you want a preview deploy instead of production, use:

```bash
npm run deploy:preview
```

These scripts use `npx vercel`, so they work even when the Vercel CLI is not installed globally.

Then add the same environment variables in the Vercel project settings before deploying.

## Project Status

Current Release: **v1.0.0**

Status:
- Public Website: Complete
- Admin CMS: Complete
- SEO: Complete
- Security Hardening: Complete
- Mobile Optimization: Complete

Remaining work:
- Configure production environment variables
- Configure Supabase production project
- Configure Google Analytics
- Configure Microsoft Clarity
- Verify Google Search Console
- Verify Bing Webmaster Tools
