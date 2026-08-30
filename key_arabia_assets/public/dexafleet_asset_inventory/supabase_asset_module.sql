create extension if not exists pgcrypto;

create table if not exists public.asset_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  asset_code text not null,
  asset_head text not null,
  asset_category text not null,
  asset_name text not null,
  ownership_type text not null,
  custody_status text not null default 'In Company Stock',
  holder_type text,
  holder_id uuid,
  location_id uuid,
  condition text not null default 'New',
  approval_status text not null default 'Pending Approval',
  available boolean not null default false,
  details jsonb not null default '{}'::jsonb,
  created_by uuid not null default auth.uid(),
  updated_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1,
  unique (company_id, asset_code)
);

create table if not exists public.asset_movements (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  asset_id uuid not null references public.asset_records(id),
  movement_type text not null,
  from_holder jsonb not null default '{}'::jsonb,
  to_holder jsonb not null default '{}'::jsonb,
  condition text,
  proof jsonb not null default '{}'::jsonb,
  status text not null default 'Pending Approval',
  occurred_at timestamptz not null,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  reversed_movement_id uuid references public.asset_movements(id),
  reversal_reason text
);

create table if not exists public.asset_approval_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  request_type text not null,
  entity_table text not null,
  entity_id uuid not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'Pending',
  requested_by uuid not null default auth.uid(),
  assigned_role text not null,
  decided_by uuid,
  decision_reason text,
  requested_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists public.asset_audit_log (
  id bigint generated always as identity primary key,
  company_id uuid not null,
  actor_id uuid not null default auth.uid(),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.asset_import_batches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  import_type text not null,
  source_file text not null,
  status text not null default 'Validating',
  row_count integer not null default 0,
  success_count integer not null default 0,
  warning_count integer not null default 0,
  failed_count integer not null default 0,
  results jsonb not null default '[]'::jsonb,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.asset_records enable row level security;
alter table public.asset_movements enable row level security;
alter table public.asset_approval_requests enable row level security;
alter table public.asset_audit_log enable row level security;
alter table public.asset_import_batches enable row level security;

create or replace function public.current_company_id() returns uuid
language sql stable security definer set search_path = public
as $$ select company_id from public.company_users where user_id = auth.uid() and status = 'active' limit 1 $$;

create policy asset_records_company_select on public.asset_records for select using (company_id = public.current_company_id());
create policy asset_records_company_insert on public.asset_records for insert with check (company_id = public.current_company_id() and created_by = auth.uid());
create policy asset_records_company_update on public.asset_records for update using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());
create policy asset_movements_company_select on public.asset_movements for select using (company_id = public.current_company_id());
create policy asset_movements_company_insert on public.asset_movements for insert with check (company_id = public.current_company_id() and created_by = auth.uid());
create policy asset_approvals_company_select on public.asset_approval_requests for select using (company_id = public.current_company_id());
create policy asset_approvals_company_insert on public.asset_approval_requests for insert with check (company_id = public.current_company_id() and requested_by = auth.uid());
create policy asset_audit_company_select on public.asset_audit_log for select using (company_id = public.current_company_id());
create policy asset_import_company_select on public.asset_import_batches for select using (company_id = public.current_company_id());
create policy asset_import_company_insert on public.asset_import_batches for insert with check (company_id = public.current_company_id() and created_by = auth.uid());

create unique index if not exists asset_plate_unique on public.asset_records(company_id, (details->>'plate')) where nullif(details->>'plate','') is not null;
create unique index if not exists asset_iccid_unique on public.asset_records(company_id, (details->>'iccid')) where nullif(details->>'iccid','') is not null;
create unique index if not exists asset_serial_unique on public.asset_records(company_id, (details->>'serial')) where nullif(details->>'serial','') is not null;

