-- Fix: Restrict media bucket uploads to admins only
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Fix: Restrict property-images uploads to landlords and vendors only
DROP POLICY IF EXISTS "Landlords can upload property images" ON storage.objects;
CREATE POLICY "Landlords and vendors can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND (
      public.has_role(auth.uid(), 'landlord')
      OR public.has_role(auth.uid(), 'vendor')
    )
  );