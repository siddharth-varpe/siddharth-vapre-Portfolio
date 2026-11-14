-- Migration: 0008_about_section.sql
-- Adds dedicated about_section JSONB column to public.site_content

ALTER TABLE public.site_content
ADD COLUMN IF NOT EXISTS about_section JSONB DEFAULT '{}'::jsonb;
