-- =============================================================================
-- Migration: 0005_verified_distinctions.sql
-- Description: Enriches public.certifications for the Verified Distinctions section:
--              Adds credential_type, description, expiration_date, verification_url,
--              certificate_url, image_path, tags (jsonb), and rank.
--              Adds composite index for Home latest-two query: (status, issue_date DESC, created_at DESC).
-- =============================================================================

ALTER TABLE public.certifications
    ADD COLUMN IF NOT EXISTS credential_type TEXT DEFAULT 'certification',
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS expiration_date TEXT,
    ADD COLUMN IF NOT EXISTS verification_url TEXT,
    ADD COLUMN IF NOT EXISTS certificate_url TEXT,
    ADD COLUMN IF NOT EXISTS image_path TEXT,
    ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS rank TEXT;

-- Composite index for Home page latest-two queries and Certifications page
CREATE INDEX IF NOT EXISTS idx_certifications_published_latest
    ON public.certifications (status, issue_date DESC, created_at DESC);

-- Distinctions section CMS config stored in site_content
ALTER TABLE public.site_content
    ADD COLUMN IF NOT EXISTS distinctions_section JSONB;

