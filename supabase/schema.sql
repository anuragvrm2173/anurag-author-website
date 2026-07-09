-- Reviews workflow: pending -> approved/rejected
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  book_id text not null,
  reviewer_name text not null,
  reviewer_email text not null,
  reviewer_role text,
  quote text not null,
  rating int not null check (rating between 1 and 5),
  source text,
  source_url text,
  featured boolean not null default false,
  status text not null default 'submitted' check (status in ('submitted', 'pending', 'approved', 'published', 'rejected')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz,
  moderated_by uuid,
  deleted_at timestamptz
);

alter table public.reviews add column if not exists deleted_at timestamptz;
alter table public.reviews add column if not exists source_url text;
alter table public.reviews drop constraint if exists reviews_status_check;
alter table public.reviews add constraint reviews_status_check check (status in ('submitted', 'pending', 'approved', 'published', 'rejected'));

create index if not exists reviews_status_created_idx on public.reviews(status, created_at desc);
create index if not exists reviews_book_status_idx on public.reviews(book_id, status);

alter table public.reviews enable row level security;

-- Public can submit reviews; all inserts are forced to pending
create policy if not exists "public_insert_pending_reviews"
on public.reviews
for insert
to anon, authenticated
with check (status = 'submitted');

-- Public can only read approved reviews
create policy if not exists "public_read_approved_reviews"
on public.reviews
for select
to anon, authenticated
using (status = 'published' and deleted_at is null);

-- Admin moderation policy placeholder (service role bypasses RLS by default)
-- Add additional policies for authenticated moderators if needed.

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy if not exists "admin_users_self_read"
on public.admin_users
for select
to authenticated
using (auth.uid() = id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

create table if not exists public.books (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text,
  short_description text,
  long_description text,
  description text,
  genres jsonb not null default '[]'::jsonb,
  themes jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('published', 'coming_soon', 'draft')),
  display_order integer not null default 0,
  publication_date date,
  published_at timestamptz,
  pages integer,
  language text,
  isbn text,
  publisher text,
  formats jsonb not null default '{}'::jsonb,
  purchase_links jsonb not null default '{}'::jsonb,
  sample_id text,
  related_books jsonb not null default '[]'::jsonb,
  related_blog_ids jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  synopsis jsonb not null default '[]'::jsonb,
  discoveries jsonb not null default '[]'::jsonb,
  who_this_book_is_for jsonb not null default '[]'::jsonb,
  reading_time text,
  favorite_quotes jsonb not null default '[]'::jsonb,
  editions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.books add column if not exists display_order integer not null default 0;
alter table public.books add column if not exists published_at timestamptz;
alter table public.books add column if not exists deleted_at timestamptz;
alter table public.books drop constraint if exists books_status_check;
alter table public.books add constraint books_status_check check (status in ('draft', 'published', 'coming_soon', 'archived'));

create table if not exists public.blog_posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  reading_time text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  display_order integer not null default 0,
  published_at text,
  category text,
  featured boolean not null default false,
  related_book_ids jsonb not null default '[]'::jsonb,
  visual jsonb not null default '{}'::jsonb,
  body_html text,
  content jsonb not null default '[]'::jsonb,
  content_sections jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  revision_history jsonb not null default '[]'::jsonb,
  last_edited timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.blog_posts add column if not exists status text not null default 'draft';
alter table public.blog_posts add column if not exists display_order integer not null default 0;
alter table public.blog_posts add column if not exists body_html text;
alter table public.blog_posts add column if not exists revision_history jsonb not null default '[]'::jsonb;
alter table public.blog_posts add column if not exists last_edited timestamptz;
alter table public.blog_posts add column if not exists deleted_at timestamptz;
alter table public.blog_posts drop constraint if exists blog_posts_status_check;
alter table public.blog_posts add constraint blog_posts_status_check check (status in ('draft', 'published', 'archived'));

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.messages add column if not exists deleted_at timestamptz;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  provider text,
  subscribed_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'deleted')),
  deleted_at timestamptz
);

alter table public.newsletter_subscribers add column if not exists deleted_at timestamptz;

create table if not exists public.site_settings (
  id text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.books enable row level security;
alter table public.blog_posts enable row level security;
alter table public.messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_settings enable row level security;

create policy if not exists "public_read_books"
on public.books
for select
to anon, authenticated
using (deleted_at is null and status in ('published', 'coming_soon'));

create policy if not exists "public_read_blog_posts"
on public.blog_posts
for select
to anon, authenticated
using (deleted_at is null and status = 'published');

create policy if not exists "public_insert_messages"
on public.messages
for insert
to anon, authenticated
with check (true);

create policy if not exists "public_insert_newsletter_subscribers"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (true);

create policy if not exists "admin_manage_books"
on public.books
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy if not exists "admin_manage_blog_posts"
on public.blog_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy if not exists "admin_manage_reviews"
on public.reviews
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy if not exists "admin_manage_messages"
on public.messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy if not exists "admin_manage_newsletter_subscribers"
on public.newsletter_subscribers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy if not exists "admin_manage_site_settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy if not exists "admin_manage_media_objects"
on storage.objects
for all
to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());
