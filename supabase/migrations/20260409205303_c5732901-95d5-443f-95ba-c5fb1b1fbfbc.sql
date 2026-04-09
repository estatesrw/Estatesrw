
-- Fix: scope admin referrals policy to authenticated role only
DROP POLICY IF EXISTS "Admins can manage all referrals" ON public.agent_referrals;
CREATE POLICY "Admins can manage all referrals"
ON public.agent_referrals
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
