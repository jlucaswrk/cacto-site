-- ============================================
-- CACTO GARDEN - Admin Policies Migration
-- Adiciona políticas para permitir acesso admin aos comentários
-- ============================================

-- Drop existing restrictive policy for comments read
DROP POLICY IF EXISTS "Allow public read comments" ON public.cactus_comments;

-- Create new policy that allows reading ALL comments (for admin)
-- Note: In a real production app, you'd want proper authentication
-- This allows reading all comments which the admin panel needs
CREATE POLICY "Allow read all comments" ON public.cactus_comments
    FOR SELECT USING (true);

-- Add policy for updating comments (toggle visibility)
DROP POLICY IF EXISTS "Allow update comments" ON public.cactus_comments;
CREATE POLICY "Allow update comments" ON public.cactus_comments
    FOR UPDATE USING (true);

-- Add policy for deleting reviews (admin needs this)
DROP POLICY IF EXISTS "Allow delete reviews" ON public.cactus_reviews;
CREATE POLICY "Allow delete reviews" ON public.cactus_reviews
    FOR DELETE USING (true);

-- Update global_stats view to count all comments (not just visible)
DROP VIEW IF EXISTS public.global_stats;
CREATE OR REPLACE VIEW public.global_stats AS
SELECT
    COUNT(DISTINCT cr.id) as total_reviews,
    COUNT(DISTINCT cc.id) as total_comments,
    COALESCE(AVG(cr.rating) FILTER (WHERE cr.rating > 0), 0)::DECIMAL(2,1) as avg_rating,
    COUNT(DISTINCT cr.species_id) as unique_species_reviewed,
    MAX(cr.created_at) as last_review_at
FROM public.cactus_reviews cr
LEFT JOIN public.cactus_comments cc ON cc.cactus_id = cr.cactus_id;
