-- Bootstrap admin access for existing Supabase Auth users
-- Replace the email below if your admin email is different.

insert into public.admin_users (id, email, role)
select id, email, 'admin'
from auth.users
where lower(email) = lower('Vanuragverma2173@gmail.com')
on conflict (id) do update set
  email = excluded.email,
  role = excluded.role;

-- Verify mapping
select id, email, role, created_at
from public.admin_users
where lower(email) = lower('Vanuragverma2173@gmail.com');
