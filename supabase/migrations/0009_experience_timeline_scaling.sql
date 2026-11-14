-- ==============================================================================
-- 0009_experience_timeline_scaling.sql
-- Experience Timeline Scaling & Category Classification
-- Adds type column to public.experiences to support diverse chronological timeline
-- entries (work, education, etc.) without redesign.
-- ==============================================================================

-- 1. Add type column to public.experiences
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'work' CHECK (type IN ('work', 'education', 'achievement', 'project', 'other'));

-- 2. Performance Index for public timeline queries (status + start_date DESC + created_at DESC)
CREATE INDEX IF NOT EXISTS idx_experiences_timeline_order 
  ON public.experiences (status, start_date DESC, created_at DESC);
