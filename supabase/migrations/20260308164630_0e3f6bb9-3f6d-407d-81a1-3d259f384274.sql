
-- =============================================
-- ESTATESRW CORE DATABASE ARCHITECTURE
-- =============================================

-- 1. ENHANCE PROPERTIES TABLE with geo fields
ALTER TABLE public.properties 
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'Rwanda',
  ADD COLUMN IF NOT EXISTS latitude numeric NULL,
  ADD COLUMN IF NOT EXISTS longitude numeric NULL;

-- 2. CREATE AGENTS TABLE
CREATE TABLE IF NOT EXISTS public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  commission_rate numeric NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active',
  bio text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- 3. CREATE CALENDAR_AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS public.calendar_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'available',
  booking_id uuid NULL REFERENCES public.accommodation_bookings(id) ON DELETE SET NULL,
  price_override numeric NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(unit_id, date)
);
ALTER TABLE public.calendar_availability ENABLE ROW LEVEL SECURITY;

-- 4. CREATE PROPERTY_IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  caption text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- 5. CREATE UNIT_IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.unit_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  caption text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.unit_images ENABLE ROW LEVEL SECURITY;

-- 6. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_country ON public.properties(country);
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON public.properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);

CREATE INDEX IF NOT EXISTS idx_room_types_property ON public.room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_vendor ON public.room_types(vendor_id);
CREATE INDEX IF NOT EXISTS idx_room_types_status ON public.room_types(status);

CREATE INDEX IF NOT EXISTS idx_accommodation_bookings_vendor ON public.accommodation_bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_accommodation_bookings_guest ON public.accommodation_bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_accommodation_bookings_status ON public.accommodation_bookings(status);
CREATE INDEX IF NOT EXISTS idx_accommodation_bookings_checkin ON public.accommodation_bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_accommodation_bookings_property ON public.accommodation_bookings(property_id);

CREATE INDEX IF NOT EXISTS idx_calendar_availability_unit_date ON public.calendar_availability(unit_id, date);
CREATE INDEX IF NOT EXISTS idx_calendar_availability_status ON public.calendar_availability(status);
CREATE INDEX IF NOT EXISTS idx_calendar_availability_booking ON public.calendar_availability(booking_id);

CREATE INDEX IF NOT EXISTS idx_channel_links_vendor ON public.channel_links(vendor_id);
CREATE INDEX IF NOT EXISTS idx_channel_links_property ON public.channel_links(property_id);

CREATE INDEX IF NOT EXISTS idx_services_provider ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);

CREATE INDEX IF NOT EXISTS idx_service_bookings_customer ON public.service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_provider ON public.service_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);

CREATE INDEX IF NOT EXISTS idx_agents_user ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);

CREATE INDEX IF NOT EXISTS idx_agent_referrals_agent ON public.agent_referrals(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_referrals_status ON public.agent_referrals(status);

CREATE INDEX IF NOT EXISTS idx_property_images_property ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_unit_images_unit ON public.unit_images(unit_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

CREATE INDEX IF NOT EXISTS idx_vendor_commissions_vendor ON public.vendor_commissions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_status ON public.vendor_commissions(status);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);

-- 7. Updated_at triggers for new tables
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 8. RLS POLICIES

-- AGENTS
CREATE POLICY "Admins can manage all agents" ON public.agents FOR ALL
  TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can view own record" ON public.agents FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Agents can update own record" ON public.agents FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can register as agent" ON public.agents FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- CALENDAR_AVAILABILITY  
CREATE POLICY "Anyone can view availability" ON public.calendar_availability FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage all availability" ON public.calendar_availability FOR ALL
  TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendors can manage own unit availability" ON public.calendar_availability FOR ALL
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.room_types rt 
      WHERE rt.id = calendar_availability.unit_id 
      AND rt.vendor_id = get_vendor_id(auth.uid())
    )
  );

-- PROPERTY_IMAGES
CREATE POLICY "Anyone can view property images" ON public.property_images FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage all property images" ON public.property_images FOR ALL
  TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Landlords can manage own property images" ON public.property_images FOR ALL
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = property_images.property_id 
      AND p.landlord_id = auth.uid()
    )
  );

-- UNIT_IMAGES
CREATE POLICY "Anyone can view unit images" ON public.unit_images FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage all unit images" ON public.unit_images FOR ALL
  TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendors can manage own unit images" ON public.unit_images FOR ALL
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.room_types rt 
      WHERE rt.id = unit_images.unit_id 
      AND rt.vendor_id = get_vendor_id(auth.uid())
    )
  );

-- Enable realtime for calendar_availability
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_availability;
