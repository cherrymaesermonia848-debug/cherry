ALTER TABLE public.cafe
  ADD COLUMN IF NOT EXISTS products_and_services text;

ALTER TABLE public.barangay
  ADD COLUMN IF NOT EXISTS information text;

ALTER TABLE public.resort
  ADD COLUMN IF NOT EXISTS accommodations_and_services text;

ALTER TABLE public.beaches
  ADD COLUMN IF NOT EXISTS accommodations_and_services text;
