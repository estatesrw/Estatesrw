
-- Saved properties table
CREATE TABLE public.saved_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own saved properties" ON public.saved_properties FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.accommodation_bookings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
