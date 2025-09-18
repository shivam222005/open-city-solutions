/*
  # Create reports with profiles view

  1. New Views
    - `reports_with_profiles` - joins reports table with profiles table to include user display names
  
  2. Changes
    - Creates a view that properly joins reports and profiles tables on user_id
    - Includes all report fields plus user display name from profiles
    - Handles anonymous reports by showing NULL for user_display_name
*/

-- Create view that joins reports with profiles to get user display names
CREATE OR REPLACE VIEW public.reports_with_profiles AS
SELECT 
  r.*,
  p.display_name as user_display_name
FROM public.reports r
LEFT JOIN public.profiles p ON r.user_id = p.user_id;

-- Grant access to the view
GRANT SELECT ON public.reports_with_profiles TO authenticated;
GRANT SELECT ON public.reports_with_profiles TO anon;