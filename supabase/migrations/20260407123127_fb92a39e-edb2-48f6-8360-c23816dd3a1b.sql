
-- 1. Fix privilege escalation: restrict self-signup to non-admin roles only
DROP POLICY IF EXISTS "Users can insert own role on signup" ON public.user_roles;
CREATE POLICY "Users can insert own non-admin role on signup"
ON public.user_roles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('tenant'::app_role, 'landlord'::app_role, 'service_provider'::app_role, 'vendor'::app_role, 'agent'::app_role)
);

-- 2. Fix vendor data exposure to unauthenticated users
DROP POLICY IF EXISTS "Anyone can view approved vendors" ON public.vendors;
CREATE POLICY "Authenticated users can view approved vendors"
ON public.vendors
FOR SELECT
TO authenticated
USING (
  (status = 'approved'::text) OR (user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Remove sensitive tables from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.accommodation_bookings;
ALTER PUBLICATION supabase_realtime DROP TABLE public.withdrawal_requests;
ALTER PUBLICATION supabase_realtime DROP TABLE public.vendors;
