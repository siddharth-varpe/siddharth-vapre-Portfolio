-- ==============================================================================
-- 0004_professional_tracks.sql
-- Professional Track / Experience Schema Enhancements
-- Adds company logo, work mode, website, highlights, ctaLabel, ctaUrl,
-- and relational experience_highlights table with RLS policies.
-- ==============================================================================

-- 1. Add Professional Track columns to experiences table
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS company_logo_path TEXT,
  ADD COLUMN IF NOT EXISTS company_website TEXT,
  ADD COLUMN IF NOT EXISTS work_mode TEXT DEFAULT 'Hybrid' CHECK (work_mode IN ('On-site', 'Hybrid', 'Remote')),
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cta_label TEXT DEFAULT 'Full Timeline',
  ADD COLUMN IF NOT EXISTS cta_url TEXT DEFAULT '/experience';

-- 2. Index for high-performance Home / Experience queries (status + start_date DESC + created_at DESC)
CREATE INDEX IF NOT EXISTS idx_experiences_status_start_date ON public.experiences (status, start_date DESC, created_at DESC);

-- 3. Normalized Relational Work / Project Highlights Table
CREATE TABLE IF NOT EXISTS public.experience_highlights (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    experience_id TEXT NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    work_type TEXT NOT NULL DEFAULT 'other' CHECK (work_type IN (
      'crm', 'inventory', 'api', 'ai', 'automation', 'database',
      'frontend', 'backend', 'fullstack', 'infrastructure', 'other'
    )),
    metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT true,
    destination_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable RLS on experience_highlights
ALTER TABLE public.experience_highlights ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Public read for highlights of published experiences
CREATE POLICY "Published experience highlights viewable by everyone"
ON public.experience_highlights FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.experiences
    WHERE public.experiences.id = public.experience_highlights.experience_id
    AND public.experiences.status = 'published'
  )
);
