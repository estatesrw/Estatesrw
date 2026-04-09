
-- 1. Remove messages table from realtime
ALTER PUBLICATION supabase_realtime DROP TABLE public.messages;

-- 2. Restrict blocked_dates view to authenticated users only
DROP POLICY IF EXISTS "Anyone can view blocked dates" ON public.blocked_dates;
CREATE POLICY "Authenticated users can view blocked dates"
ON public.blocked_dates
FOR SELECT
TO authenticated
USING (true);

-- 3. Tighten consultation_requests INSERT with validation
DROP POLICY IF EXISTS "Anyone can submit consultation requests" ON public.consultation_requests;
CREATE POLICY "Anyone can submit consultation requests"
ON public.consultation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) > 0 AND length(name) <= 255
  AND length(email) > 0 AND length(email) <= 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (phone IS NULL OR length(phone) <= 30)
  AND (message IS NULL OR length(message) <= 5000)
  AND length(service_type) > 0
);
