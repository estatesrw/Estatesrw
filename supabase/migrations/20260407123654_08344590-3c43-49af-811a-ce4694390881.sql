
-- Remove calendar_availability from realtime
ALTER PUBLICATION supabase_realtime DROP TABLE public.calendar_availability;

-- Add UPDATE policy for media bucket
CREATE POLICY "Users can update their own media files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND (auth.uid())::text = (storage.foldername(name))[1]);
