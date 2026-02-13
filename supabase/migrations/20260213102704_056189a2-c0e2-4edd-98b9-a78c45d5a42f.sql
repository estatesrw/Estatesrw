
-- Create services table for service providers
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  price NUMERIC NOT NULL DEFAULT 0,
  price_type TEXT NOT NULL DEFAULT 'fixed',
  image_url TEXT,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  city TEXT NOT NULL DEFAULT 'Kigali',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active services
CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
USING (status = 'active' OR provider_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Service providers can insert their own services
CREATE POLICY "Providers can insert services"
ON public.services FOR INSERT
WITH CHECK (has_role(auth.uid(), 'service_provider'::app_role) AND provider_id = auth.uid());

-- Service providers can update their own services
CREATE POLICY "Providers can update own services"
ON public.services FOR UPDATE
USING (provider_id = auth.uid());

-- Service providers can delete their own services
CREATE POLICY "Providers can delete own services"
ON public.services FOR DELETE
USING (provider_id = auth.uid());

-- Admins can manage all services
CREATE POLICY "Admins can manage all services"
ON public.services FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create service_bookings table
CREATE TABLE public.service_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id),
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT,
  notes TEXT,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own service bookings"
ON public.service_bookings FOR SELECT
USING (customer_id = auth.uid());

CREATE POLICY "Providers can view their service bookings"
ON public.service_bookings FOR SELECT
USING (provider_id = auth.uid());

CREATE POLICY "Admins can view all service bookings"
ON public.service_bookings FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can create service bookings"
ON public.service_bookings FOR INSERT
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Providers can update their service bookings"
ON public.service_bookings FOR UPDATE
USING (provider_id = auth.uid());

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_service_bookings_updated_at
BEFORE UPDATE ON public.service_bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
