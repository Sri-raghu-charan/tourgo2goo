-- Create storage bucket for hotel images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hotel-images', 'hotel-images', true);

-- Create RLS policies for hotel-images bucket
-- Hotel owners can upload images to their folder
CREATE POLICY "Hotel owners can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'hotel-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Hotel owners can update their images
CREATE POLICY "Hotel owners can update images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'hotel-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Hotel owners can delete their images
CREATE POLICY "Hotel owners can delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'hotel-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view images (public bucket)
CREATE POLICY "Anyone can view hotel images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hotel-images');