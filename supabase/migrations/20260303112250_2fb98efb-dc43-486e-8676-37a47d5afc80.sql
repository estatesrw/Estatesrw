
-- Add vendor role to existing enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendor';

-- Vendors table (business profile linked to auth user)
CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name text NOT NULL,
  business_type text NOT NULL DEFAULT 'hotel', -- hotel, apartment, guesthouse, villa
  description text,
  logo_url text,
  phone text,
  email text,
  address text,
  city text NOT NULL DEFAULT 'Kigali',
  commission_rate numeric NOT NULL DEFAULT 10, -- percentage
  status text NOT NULL DEFAULT 'pending', -- pending, approved, suspended, rejected
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Room types for properties
CREATE TABLE public.room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  max_guests integer NOT NULL DEFAULT 2,
  total_rooms integer NOT NULL DEFAULT 1,
  price_per_night numeric NOT NULL DEFAULT 0,
  weekend_price numeric,
  monthly_price numeric,
  minimum_stay integer NOT NULL DEFAULT 1,
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Blocked dates for properties/room types
CREATE TABLE public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  room_type_id uuid REFERENCES public.room_types(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Accommodation bookings (separate from rental bookings)
CREATE TABLE public.accommodation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text NOT NULL UNIQUE DEFAULT 'BK-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  room_type_id uuid REFERENCES public.room_types(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  guest_id uuid NOT NULL,
  guest_name text NOT NULL,
  guest_email text,
  guest_phone text,
  check_in date NOT NULL,
  check_out date NOT NULL,
  nights integer NOT NULL DEFAULT 1,
  guests integer NOT NULL DEFAULT 1,
  total_price numeric NOT NULL DEFAULT 0,
  commission_amount numeric NOT NULL DEFAULT 0,
  vendor_payout numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled, completed, no_show
  payment_status text NOT NULL DEFAULT 'unpaid', -- unpaid, paid, refunded, partial
  payment_method text,
  cancellation_policy text DEFAULT 'flexible',
  notes text,
  approved_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Vendor commission log
CREATE TABLE public.vendor_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES public.accommodation_bookings(id) ON DELETE CASCADE NOT NULL,
  booking_amount numeric NOT NULL,
  commission_rate numeric NOT NULL,
  commission_amount numeric NOT NULL,
  vendor_payout numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, paid, cancelled
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Updated_at triggers
CREATE TRIGGER vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER room_types_updated_at BEFORE UPDATE ON public.room_types FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER accommodation_bookings_updated_at BEFORE UPDATE ON public.accommodation_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_commissions ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is vendor owner
CREATE OR REPLACE FUNCTION public.is_vendor_owner(_user_id uuid, _vendor_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.vendors WHERE id = _vendor_id AND user_id = _user_id) $$;

-- Helper function: get vendor id for user
CREATE OR REPLACE FUNCTION public.get_vendor_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT id FROM public.vendors WHERE user_id = _user_id LIMIT 1 $$;

-- VENDORS RLS
CREATE POLICY "Anyone can view approved vendors" ON public.vendors FOR SELECT USING (status = 'approved' OR user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can register as vendor" ON public.vendors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Vendors can update own profile" ON public.vendors FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all vendors" ON public.vendors FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ROOM TYPES RLS
CREATE POLICY "Anyone can view active room types" ON public.room_types FOR SELECT USING (status = 'active' OR vendor_id = get_vendor_id(auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Vendors can insert room types" ON public.room_types FOR INSERT WITH CHECK (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Vendors can update own room types" ON public.room_types FOR UPDATE USING (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Vendors can delete own room types" ON public.room_types FOR DELETE USING (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Admins can manage all room types" ON public.room_types FOR ALL USING (has_role(auth.uid(), 'admin'));

-- BLOCKED DATES RLS
CREATE POLICY "Vendors can manage own blocked dates" ON public.blocked_dates FOR ALL USING (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Anyone can view blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admins can manage all blocked dates" ON public.blocked_dates FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ACCOMMODATION BOOKINGS RLS
CREATE POLICY "Guests can view own bookings" ON public.accommodation_bookings FOR SELECT USING (guest_id = auth.uid());
CREATE POLICY "Guests can create bookings" ON public.accommodation_bookings FOR INSERT WITH CHECK (guest_id = auth.uid());
CREATE POLICY "Vendors can view own bookings" ON public.accommodation_bookings FOR SELECT USING (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Vendors can update own bookings" ON public.accommodation_bookings FOR UPDATE USING (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Admins can manage all bookings" ON public.accommodation_bookings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- VENDOR COMMISSIONS RLS
CREATE POLICY "Vendors can view own commissions" ON public.vendor_commissions FOR SELECT USING (vendor_id = get_vendor_id(auth.uid()));
CREATE POLICY "Admins can manage all commissions" ON public.vendor_commissions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.accommodation_bookings;
