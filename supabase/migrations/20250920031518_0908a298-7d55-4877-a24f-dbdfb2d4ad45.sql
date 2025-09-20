-- Create storage bucket for report media files
INSERT INTO storage.buckets (id, name, public) VALUES ('report-media', 'report-media', true);

-- Create storage policies for report media
CREATE POLICY "Anyone can view report media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'report-media');

CREATE POLICY "Authenticated users can upload report media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'report-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'report-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'report-media' AND auth.uid() IS NOT NULL);