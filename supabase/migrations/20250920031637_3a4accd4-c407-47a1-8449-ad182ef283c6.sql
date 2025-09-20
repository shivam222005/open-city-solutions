-- Fix security definer view issue by recreating report_stats view properly
DROP VIEW IF EXISTS public.report_stats;

-- Recreate report_stats view without SECURITY DEFINER (this was causing the security issue)
CREATE VIEW public.report_stats AS
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