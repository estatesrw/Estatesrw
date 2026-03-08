
-- Add 'agent' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'agent';

-- Channel links for iCal sync (Airbnb, Booking.com)
CREATE TABLE public.channel_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_type_id uuid REFERENCES public.room_types(id) ON DELETE SET NULL,
  platform text NOT NULL DEFAULT 'airbnb',
  ical_url text NOT NULL,
  last_synced_at timestamptz,
  sync_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.channel_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage own channel links" ON public.channel_links FOR ALL USING (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Admins can manage all channel links" ON public.channel_links FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Agent referrals table
CREATE TABLE public.agent_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  guest_name text NOT NULL,
  guest_email text,
  guest_phone text,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES public.accommodation_bookings(id) ON DELETE SET NULL,
  commission_rate numeric NOT NULL DEFAULT 5,
  commission_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can manage own referrals" ON public.agent_referrals FOR ALL USING (agent_id = auth.uid());
CREATE POLICY "Admins can manage all referrals" ON public.agent_referrals FOR ALL USING (has_role(auth.uid(), 'admin'));
