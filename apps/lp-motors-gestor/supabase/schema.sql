-- LP Motors Gestor — schema PostgreSQL / Supabase (preparado)
-- Nenhuma dependência paga. Aplique quando quiser migrar do JSON sync para SQL.

create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  username text not null,
  password_hash text not null,
  nome text not null,
  role text not null check (role in ('admin','gerente','vendedor','operacional','financeiro')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, username)
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  codigo_interno text,
  marca text, modelo text, versao text,
  ano int, ano_modelo int, categoria text, cor text,
  placa text, renavam text, chassi text, motor text, portas int default 4,
  combustivel text, cambio text, quilometragem int default 0,
  cidade text, estado text,
  fornecedor text, origem text,
  valor_compra numeric(14,2) default 0,
  preco_anunciado numeric(14,2) default 0,
  preco_minimo numeric(14,2) default 0,
  preco_fipe numeric(14,2) default 0,
  data_compra date,
  status text not null,
  consignado boolean default false,
  archived boolean default false,
  draft boolean default false,
  fotos jsonb default '[]'::jsonb,
  foto_principal int default 0,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_org_idx on vehicles(organization_id);
create index if not exists vehicles_status_idx on vehicles(organization_id, status);
create index if not exists vehicles_placa_idx on vehicles(organization_id, placa);

create table if not exists vehicle_costs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  categoria text not null,
  descricao text not null,
  valor numeric(14,2) not null,
  data date not null,
  fornecedor_nome text,
  responsavel text,
  forma_pagamento text,
  status text default 'pago',
  documento_url text,
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicle_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  categoria text not null,
  nome text not null,
  data_url text,
  mime_type text,
  tamanho int default 0,
  data_vencimento date,
  valor numeric(14,2) default 0,
  status text default 'regular',
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicle_checklists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (vehicle_id)
);

create table if not exists vehicle_price_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  campo text not null,
  valor_anterior numeric(14,2),
  valor_novo numeric(14,2),
  usuario text,
  created_at timestamptz not null default now()
);

create table if not exists vehicle_status_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  de text,
  para text not null,
  usuario text,
  created_at timestamptz not null default now()
);

create table if not exists vehicle_sales (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  customer_id uuid,
  cliente_nome text,
  valor_vendido numeric(14,2) not null,
  comissao numeric(14,2) default 0,
  data_venda date not null,
  forma_pagamento text,
  lucro_bruto numeric(14,2),
  lucro_liquido numeric(14,2),
  margem numeric(8,2),
  dias_estoque int,
  created_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  nome text not null,
  tipo text,
  telefone text,
  email text,
  cidade text,
  active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists payables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  descricao text not null,
  categoria text,
  valor numeric(14,2) not null,
  vencimento date not null,
  status text not null,
  fornecedor_nome text,
  vehicle_id uuid references vehicles(id) on delete set null,
  observacao text,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid,
  username text,
  action text not null,
  entity_type text,
  entity_id text,
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists audit_org_idx on audit_logs(organization_id, created_at desc);

-- RLS skeleton (enable when using Supabase Auth)
-- alter table vehicles enable row level security;
-- create policy vehicles_tenant on vehicles
--   using (organization_id = (auth.jwt() ->> 'organization_id')::uuid);
