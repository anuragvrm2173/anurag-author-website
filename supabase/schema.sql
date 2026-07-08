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
  featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz,
  moderated_by uuid
);

create index if not exists reviews_status_created_idx on public.reviews(status, created_at desc);
create index if not exists reviews_book_status_idx on public.reviews(book_id, status);

alter table public.reviews enable row level security;

-- Public can submit reviews; all inserts are forced to pending
create policy if not exists "public_insert_pending_reviews"
on public.reviews
for insert
to anon, authenticated
with check (status = 'pending');

-- Public can only read approved reviews
create policy if not exists "public_read_approved_reviews"
on public.reviews
for select
to anon, authenticated
using (status = 'approved');

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
  publication_date date,
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
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  reading_time text,
  published_at text,
  category text,
  featured boolean not null default false,
  related_book_ids jsonb not null default '[]'::jsonb,
  visual jsonb not null default '{}'::jsonb,
  content jsonb not null default '[]'::jsonb,
  content_sections jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  provider text,
  subscribed_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'deleted'))
);

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
using (true);

create policy if not exists "public_read_blog_posts"
on public.blog_posts
for select
to anon, authenticated
using (true);

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
