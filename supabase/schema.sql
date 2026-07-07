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
to anon
with check (status = 'pending');

-- Public can only read approved reviews
create policy if not exists "public_read_approved_reviews"
on public.reviews
for select
to anon
using (status = 'approved');

-- Admin moderation policy placeholder (service role bypasses RLS by default)
-- Add additional policies for authenticated moderators if needed.
