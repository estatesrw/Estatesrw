ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS slug text;

CREATE OR REPLACE FUNCTION public.set_property_slug()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE base text; candidate text; n int := 1;
BEGIN
  IF NEW.slug IS NOT NULL AND NEW.slug <> '' AND (TG_OP = 'INSERT' OR NEW.slug = OLD.slug) THEN
    IF TG_OP = 'UPDATE' THEN RETURN NEW; END IF;
  END IF;
  base := trim(both '-' from regexp_replace(lower(coalesce(NEW.title,'property') || ' ' || coalesce(NEW.city,'')), '[^a-z0-9]+', '-', 'g'));
  IF base = '' THEN base := 'property'; END IF;
  base := left(base, 70);
  candidate := base;
  WHILE EXISTS (SELECT 1 FROM public.properties WHERE slug = candidate AND id <> NEW.id) LOOP
    n := n + 1; candidate := base || '-' || n;
  END LOOP;
  NEW.slug := candidate;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_properties_slug ON public.properties;
CREATE TRIGGER trg_properties_slug BEFORE INSERT ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.set_property_slug();

UPDATE public.properties SET slug = NULL WHERE slug IS NULL;
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT id FROM public.properties WHERE slug IS NULL ORDER BY created_at LOOP
    UPDATE public.properties p SET slug = s.v FROM (SELECT public_slug_tmp.v FROM (SELECT 1) x, LATERAL (SELECT NULL::text v) public_slug_tmp) s WHERE false;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.backfill_property_slugs_tmp() RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
DECLARE r record; base text; candidate text; n int;
BEGIN
  FOR r IN SELECT id, title, city FROM public.properties WHERE slug IS NULL ORDER BY created_at LOOP
    base := left(trim(both '-' from regexp_replace(lower(coalesce(r.title,'property')||' '||coalesce(r.city,'')), '[^a-z0-9]+', '-', 'g')), 70);
    IF base = '' THEN base := 'property'; END IF;
    candidate := base; n := 1;
    WHILE EXISTS (SELECT 1 FROM public.properties WHERE slug = candidate) LOOP n := n + 1; candidate := base || '-' || n; END LOOP;
    UPDATE public.properties SET slug = candidate WHERE id = r.id;
  END LOOP;
END $$;
SELECT public.backfill_property_slugs_tmp();
DROP FUNCTION public.backfill_property_slugs_tmp();

CREATE UNIQUE INDEX IF NOT EXISTS properties_slug_key ON public.properties(slug);

DROP POLICY IF EXISTS "Public can view active properties" ON public.properties;
CREATE POLICY "Public can view active properties" ON public.properties
FOR SELECT TO anon USING (status IN ('active','sold'));