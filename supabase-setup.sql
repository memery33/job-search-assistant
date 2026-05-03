-- ==========================================
-- Applyt - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- ==========================================

-- Jobs table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  company text not null,
  url text not null default '',
  type text not null default 'full-time',
  status text not null default 'saved',
  fit_level text default '',
  salary text default '',
  location text default '',
  description text default '',
  requirements text default '',
  fit_notes text default '',
  created_at timestamptz default now()
);

-- Resumes table
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  content text not null default '',
  highlighted_html text default '',
  original_id uuid default null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.jobs enable row level security;
alter table public.resumes enable row level security;

-- RLS Policies: users can only access their own data
create policy "Users can view own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);

create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);
