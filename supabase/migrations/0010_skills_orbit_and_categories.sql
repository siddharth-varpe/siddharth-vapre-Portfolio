-- ==============================================================================
-- 0010_skills_orbit_and_categories.sql
-- Dynamic Orbit System & Category Management Schema for Skills Page
-- ==============================================================================

-- 1. Add orbit_enabled column to skills table
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS orbit_enabled BOOLEAN NOT NULL DEFAULT false;

-- 2. Drop the restrictive static category check constraint if present
DO $$
BEGIN
  ALTER TABLE public.skills DROP CONSTRAINT IF EXISTS skills_category_check;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- 3. Dynamic Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    accent TEXT DEFAULT 'blue',
    display_order INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable RLS on skill_categories
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Public read for enabled skill categories
CREATE POLICY "Enabled skill categories viewable by everyone"
ON public.skill_categories FOR SELECT
USING (enabled = true);

-- 6. Add dedicated skills_page_settings column to site_content
ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS skills_page_settings JSONB DEFAULT '{}'::jsonb;

-- 7. High performance indexes
CREATE INDEX IF NOT EXISTS idx_skills_orbit_enabled ON public.skills (orbit_enabled, status, display_order);
CREATE INDEX IF NOT EXISTS idx_skill_categories_display_order ON public.skill_categories (display_order) WHERE enabled = true;
