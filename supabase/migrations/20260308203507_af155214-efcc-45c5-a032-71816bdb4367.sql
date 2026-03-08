
-- Fix: Allow landlords, vendors, AND service providers to upload to property-images bucket
DROP POLICY IF EXISTS "Landlords and vendors can upload property images" ON storage.objects;
CREATE POLICY "Authorized users can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND (
      public.has_role(auth.uid(), 'landlord')
      OR public.has_role(auth.uid(), 'vendor')
      OR public.has_role(auth.uid(), 'service_provider')
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- Fix: Allow all listing roles to upload to media bucket (for service images, videos, etc.)
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
CREATE POLICY "Authorized users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND (
      public.has_role(auth.uid(), 'landlord')
      OR public.has_role(auth.uid(), 'vendor')
      OR public.has_role(auth.uid(), 'service_provider')
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- Allow users to delete their own uploads from property-images
DROP POLICY IF EXISTS "Users can delete own property images" ON storage.objects;
CREATE POLICY "Users can delete own property images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );

-- Allow users to delete their own uploads from media
DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;
CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );

-- Allow anyone to read from both public buckets
DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
CREATE POLICY "Public read property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
