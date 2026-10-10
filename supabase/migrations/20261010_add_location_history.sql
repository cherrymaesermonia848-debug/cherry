alter table public.barangay add column if not exists history text not null default '';
alter table public.beaches add column if not exists history text not null default '';
alter table public.cafe add column if not exists history text not null default '';
alter table public.heritage add column if not exists history text not null default '';
alter table public.resort add column if not exists history text not null default '';
alter table public.touristspot add column if not exists history text not null default '';
