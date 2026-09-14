-- ==============================================================================
-- 0003_rls_policies.sql
-- Row Level Security (RLS) Policies for Siddharth Varpe Portfolio
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."verification" ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1. PUBLIC READ POLICIES (Anonymous Visitors)
-- -----------------------------------------------------------------------------

-- Profiles: Public can view developer profile
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Heroes: Public can only view published hero content
CREATE POLICY "Published heroes are viewable by everyone"
ON public.heroes FOR SELECT
USING (status = 'published');

-- Abouts: Public can only view published about content
CREATE POLICY "Published abouts are viewable by everyone"
ON public.abouts FOR SELECT
USING (status = 'published');

-- Skills: Public can only view published skills
CREATE POLICY "Published skills are viewable by everyone"
ON public.skills FOR SELECT
USING (status = 'published');

-- Experiences: Public can only view published experience
CREATE POLICY "Published experiences are viewable by everyone"
ON public.experiences FOR SELECT
USING (status = 'published');

-- Projects: Public can only view published projects
CREATE POLICY "Published projects are viewable by everyone"
ON public.projects FOR SELECT
USING (status = 'published');

-- Achievements: Public can only view published achievements
CREATE POLICY "Published achievements are viewable by everyone"
ON public.achievements FOR SELECT
USING (status = 'published');

-- Certifications: Public can only view published certifications
CREATE POLICY "Published certifications are viewable by everyone"
ON public.certifications FOR SELECT
USING (status = 'published');

-- Metrics: Public can only view published metrics
CREATE POLICY "Published metrics are viewable by everyone"
ON public.metrics FOR SELECT
USING (status = 'published');

-- Contact Settings: Public can view contact settings and links
CREATE POLICY "Public contact settings are viewable by everyone"
ON public.contact_settings FOR SELECT
USING (true);

-- Resumes: Public can only view active, unarchived, download-enabled resumes
CREATE POLICY "Active resumes are viewable by everyone"
ON public.resumes FOR SELECT
USING (active = true AND archived = false AND download_enabled = true);

-- SEO: Public can view SEO metadata
CREATE POLICY "Public SEO metadata is viewable by everyone"
ON public.seo FOR SELECT
USING (true);

-- Site Content: Public can view global site content
CREATE POLICY "Public site content is viewable by everyone"
ON public.site_content FOR SELECT
USING (true);

-- Media: Public can only view public media assets
CREATE POLICY "Public media is viewable by everyone"
ON public.media FOR SELECT
USING (visibility = 'public');

-- Contact Messages: Anonymous visitors may submit messages, but CANNOT read or modify
CREATE POLICY "Anyone can submit contact message"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 2. PRIVATE TABLES: DENY ALL DIRECT ANONYMOUS ACCESS
-- Revisions, Activity Logs, and Better Auth tables have no public SELECT/UPDATE/DELETE policies.
-- Access is strictly reserved for the server runtime via SUPABASE_SERVICE_ROLE_KEY.
-- -----------------------------------------------------------------------------
