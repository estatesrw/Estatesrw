
-- Withdrawal requests table for vendors/landlords to request payouts
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'mobile_money',
  payment_details JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users can view own withdrawal requests
CREATE POLICY "Users can view own withdrawals" ON public.withdrawal_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can create withdrawal requests
CREATE POLICY "Users can create withdrawals" ON public.withdrawal_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all withdrawals
CREATE POLICY "Admins can manage all withdrawals" ON public.withdrawal_requests
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Update trigger
CREATE TRIGGER update_withdrawal_requests_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable realtime for withdrawal requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawal_requests;
