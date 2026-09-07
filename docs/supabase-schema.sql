-- EVERA optional cloud-save transport.
-- Run in the Supabase SQL editor for the project used by the app.

create table if not exists public.evera_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  save_id text not null,
  revision bigint not null check (revision >= 1),
  world_version integer not null,
  checksum text not null,
  updated_at timestamptz not null default now(),
  device_id text not null,
  payload jsonb not null,
  primary key (user_id, save_id)
);

alter table public.evera_saves enable row level security;

create policy "Users can read their own EVERA saves"
on public.evera_saves for select
using (auth.uid() = user_id);

create policy "Users can insert their own EVERA saves"
on public.evera_saves for insert
with check (auth.uid() = user_id);

create policy "Users can update their own EVERA saves"
on public.evera_saves for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own EVERA saves"
on public.evera_saves for delete
using (auth.uid() = user_id);

create index if not exists evera_saves_updated_idx on public.evera_saves(user_id, updated_at desc);
