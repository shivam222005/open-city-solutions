-- Add media support and community features

-- Add media URLs array to reports (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'media_urls') THEN
    ALTER TABLE reports ADD COLUMN media_urls TEXT[];
  END IF;
END $$;

-- Create report_likes table for community interaction
CREATE TABLE IF NOT EXISTS public.report_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, report_id)
);

-- Create comments table for report discussions
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.report_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for report_likes
CREATE POLICY "Anyone can view likes" 
ON public.report_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can like reports" 
ON public.report_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" 
ON public.report_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for comments
CREATE POLICY "Anyone can view public comments" 
ON public.comments 
FOR SELECT 
USING (NOT is_internal);

CREATE POLICY "Authenticated users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create view for report statistics with likes and comments
CREATE OR REPLACE VIEW public.report_stats AS
SELECT 
  r.id,
  r.title,
  r.category,
  r.priority,
  r.status,
  r.created_at,
  r.is_anonymous,
  CASE 
    WHEN r.is_anonymous THEN 'Anonymous User'
    ELSE COALESCE(p.display_name, 'Unknown User')
  END as user_name,
  COALESCE(like_counts.like_count, 0) as like_count,
  COALESCE(comment_counts.comment_count, 0) as comment_count
FROM public.reports r
LEFT JOIN public.profiles p ON r.user_id = p.user_id
LEFT JOIN (
  SELECT report_id, COUNT(*) as like_count
  FROM public.report_likes
  GROUP BY report_id
) like_counts ON r.id = like_counts.report_id
LEFT JOIN (
  SELECT report_id, COUNT(*) as comment_count
  FROM public.comments
  WHERE NOT is_internal
  GROUP BY report_id
) comment_counts ON r.id = comment_counts.report_id;