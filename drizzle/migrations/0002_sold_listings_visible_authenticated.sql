DROP POLICY IF EXISTS "Anyone authenticated can view active properties" ON public.properties;
CREATE POLICY "Anyone authenticated can view active properties" ON public.properties
FOR SELECT TO authenticated USING (status IN ('active','sold') OR landlord_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));