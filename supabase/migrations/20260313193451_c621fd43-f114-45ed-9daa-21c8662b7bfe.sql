
CREATE TABLE public.consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service_type text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit consultation requests"
ON public.consultation_requests
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view consultation requests"
ON public.consultation_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update consultation requests"
ON public.consultation_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete consultation requests"
ON public.consultation_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));
