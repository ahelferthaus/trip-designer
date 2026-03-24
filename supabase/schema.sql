create extension if not exists "uuid-ossp";

create table trips (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  passcode text not null default '1234',
  form_data jsonb not null,
  itinerary_data jsonb not null,
  created_by text not null,
  created_at timestamptz default now()
);

create table trip_members (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid references trips(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz default now(),
  unique(trip_id, display_name)
);

create table slot_selections (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid references trips(id) on delete cascade,
  member_name text not null,
  slot_id text not null,
  option_id text not null,
  updated_at timestamptz default now(),
  unique(trip_id, member_name, slot_id)
);

alter table trips enable row level security;
alter table trip_members enable row level security;
alter table slot_selections enable row level security;

create policy "Public read trips" on trips for select using (true);
create policy "Public insert trips" on trips for insert with check (true);
create policy "Public update trips" on trips for update using (true);
create policy "Public read members" on trip_members for select using (true);
create policy "Public insert members" on trip_members for insert with check (true);
create policy "Public read selections" on slot_selections for select using (true);
create policy "Public upsert selections" on slot_selections for all using (true);
