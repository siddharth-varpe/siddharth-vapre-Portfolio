-- Migration: 0007_footer_section.sql
-- Adds dedicated footer_section JSONB column to public.site_content

ALTER TABLE public.site_content
ADD COLUMN IF NOT EXISTS footer_section JSONB DEFAULT '{}'::jsonb;
