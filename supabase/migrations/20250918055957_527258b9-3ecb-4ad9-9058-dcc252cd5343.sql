-- Add admin role for the specified user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('b9ba81f8-f900-4a2e-aa00-d08ad9172b85', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;