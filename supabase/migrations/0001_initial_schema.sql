-- ==============================================================================
-- 0001_initial_schema.sql
-- Portfolio Core Relational PostgreSQL Schema for Supabase
-- ==============================================================================

-- 1. Profiles (Singleton developer profile)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    location TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    photo_url TEXT,
    avatar_url TEXT,
    availability TEXT NOT NULL DEFAULT 'available',
    tagline TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Heroes (Hero section content)
CREATE TABLE IF NOT EXISTS public.heroes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    eyebrow TEXT NOT NULL,
    name TEXT NOT NULL,
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    cta_label TEXT NOT NULL,
    cta_url TEXT NOT NULL,
    supporting_text TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Abouts (About section narrative & cards)
CREATE TABLE IF NOT EXISTS public.abouts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    primary_description TEXT NOT NULL,
    supporting_description TEXT,
    philosophy TEXT,
    interests JSONB DEFAULT '[]'::jsonb,
    cards JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Skills (Categorized technical competencies)
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'AI & ML', 'DevOps & Cloud', 'Tools & Systems')),
    description TEXT,
    icon TEXT,
    level TEXT CHECK (level IN ('Proficient', 'Advanced', 'Familiar')),
    years INTEGER DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Experiences (Professional career timeline)
CREATE TABLE IF NOT EXISTS public.experiences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Contract', 'Freelance', 'Internship')),
    location TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    current BOOLEAN NOT NULL DEFAULT false,
    description TEXT NOT NULL,
    responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    metrics JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Projects (In-depth engineering case studies)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    role TEXT NOT NULL,
    problem TEXT NOT NULL,
    objective TEXT NOT NULL,
    solution TEXT NOT NULL,
    architecture_summary TEXT NOT NULL,
    implementation JSONB NOT NULL DEFAULT '[]'::jsonb,
    decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
    challenges JSONB NOT NULL DEFAULT '[]'::jsonb,
    impact JSONB NOT NULL DEFAULT '[]'::jsonb,
    metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    github_url TEXT,
    live_demo_url TEXT,
    media JSONB DEFAULT '[]'::jsonb,
    cover_image TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Achievements (Professional milestones and awards)
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    rank TEXT,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    impact TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Certifications (Verified technical credentials)
CREATE TABLE IF NOT EXISTS public.certifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    credential_id TEXT,
    credential_url TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Metrics (Quantifiable impact statistics)
CREATE TABLE IF NOT EXISTS public.metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    supporting_text TEXT,
    context TEXT,
    icon TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    evidence_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Contact Settings (Direct inquiry & social links)
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL,
    linkedin_url TEXT NOT NULL,
    github_url TEXT NOT NULL,
    location TEXT NOT NULL,
    cta_destination TEXT NOT NULL,
    availability_notice TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Resumes (Versioned résumé metadata)
CREATE TABLE IF NOT EXISTS public.resumes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    filename TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    version TEXT NOT NULL,
    upload_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active BOOLEAN NOT NULL DEFAULT false,
    archived BOOLEAN NOT NULL DEFAULT false,
    download_enabled BOOLEAN NOT NULL DEFAULT true,
    file_size_bytes INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SEO (Global search & Open Graph metadata)
CREATE TABLE IF NOT EXISTS public.seo (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    author TEXT NOT NULL,
    og_title TEXT NOT NULL,
    og_description TEXT NOT NULL,
    og_image_url TEXT,
    canonical_url TEXT NOT NULL,
    no_index BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Site Content (Footer, global CTA, microcopy)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    footer_text TEXT NOT NULL,
    copyright TEXT NOT NULL,
    global_cta JSONB NOT NULL DEFAULT '{}'::jsonb,
    loading_message TEXT,
    empty_state_message TEXT,
    not_found_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Contact Messages (Inbound visitor inquiries)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    email_delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_delivery_status IN ('pending', 'sent', 'failed', 'skipped')),
    email_message_id TEXT,
    turnstile_verified BOOLEAN NOT NULL DEFAULT false,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

-- 15. Revisions (Audit log of CMS entity changes)
CREATE TABLE IF NOT EXISTS public.revisions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'archive')),
    previous_state JSONB,
    new_state JSONB,
    actor TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Activity Logs (Security and administrative events)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('auth', 'content', 'media', 'security', 'system')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'warning')),
    actor TEXT NOT NULL,
    ip_address_masked TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Media (Stored asset metadata and content associations)
CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    filename TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    storage_key TEXT,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    dimensions JSONB,
    category TEXT NOT NULL CHECK (category IN ('project', 'profile', 'certificate', 'achievement', 'resume', 'general')),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    associated_content_type TEXT CHECK (associated_content_type IN ('profile', 'project', 'achievement', 'certification')),
    associated_content_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- PERFORMANCE & LOOKUP INDEXES
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_status_order ON public.projects (status, display_order);
CREATE INDEX IF NOT EXISTS idx_skills_status_order ON public.skills (status, display_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills (category);
CREATE INDEX IF NOT EXISTS idx_experiences_status_order ON public.experiences (status, display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_status_order ON public.achievements (status, display_order);
CREATE INDEX IF NOT EXISTS idx_certifications_status_order ON public.certifications (status, display_order);
CREATE INDEX IF NOT EXISTS idx_metrics_status_order ON public.metrics (status, display_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revisions_content ON public.revisions (content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_revisions_timestamp ON public.revisions (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON public.activity_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_media_associated ON public.media (associated_content_type, associated_content_id);
