-- =============================================================================
-- Migration: 0006_opportunities_section.sql
-- Description: Adds opportunities_section JSONB column to public.site_content
-- =============================================================================

ALTER TABLE public.site_content
    ADD COLUMN IF NOT EXISTS opportunities_section JSONB;
