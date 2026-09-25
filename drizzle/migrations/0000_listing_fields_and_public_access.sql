ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS listing_type text NOT NULL DEFAULT 'rent',
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'RWF',
  ADD COLUMN IF NOT EXISTS available_from date,
  ADD COLUMN IF NOT EXISTS listed_at date DEFAULT CURRENT_DATE;
ALTER TABLE public.properties ADD CONSTRAINT properties_listing_type_chk CHECK (listing_type IN ('sale','rent')) NOT VALID;
ALTER TABLE public.properties ADD CONSTRAINT properties_currency_chk CHECK (currency IN ('RWF','USD','EUR')) NOT VALID;

GRANT SELECT ON public.properties TO anon;
CREATE POLICY "Public can view active properties" ON public.properties FOR SELECT TO anon USING (status = 'active');

CREATE POLICY "Admins can insert properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') AND landlord_id = auth.uid());
CREATE POLICY "Admins can update properties" ON public.properties FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete properties" ON public.properties FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));