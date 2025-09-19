-- Fix existing policies and create missing features

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Anyone can view likes" ON public.report_likes;
DROP POLICY IF EXISTS "Authenticated users can like reports" ON public.report_likes;
DROP POLICY IF EXISTS "Users can unlike their own likes" ON public.report_likes;
DROP POLICY IF EXISTS "Anyone can view public comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;

-- Recreate RLS policies for report_likes
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

-- Recreate RLS policies for comments
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