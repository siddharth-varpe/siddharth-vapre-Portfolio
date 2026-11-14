# Graph Report - Portfolio  (2026-09-24)

## Corpus Check
- 238 files · ~2,629,791 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .example 1, .css 1)

## Summary
- 1852 nodes · 4095 edges · 144 communities (122 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `078b9338`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DEVELOPMENT_RULES.md
- SECURITY.md
- [slug]/page.tsx
- mappers.ts
- react
- ui/index.ts
- resume/upload/route.ts
- contact/route.ts
- supabase-adapter.ts
- useToast
- empty-state.tsx
- PRD.md
- bootstrap.ts
- (public)/page.tsx
- pil
- getSupabaseAdmin
- motion-wrapper.tsx
- store.ts
- page-heroes/route.ts
- TechStack.md
- validations/models.ts
- seo.ts
- resume/[id]/route.ts
- content.ts
- achievements/[id]/route.ts
- ref_next_server
- requireAdminSession
- admin.ts
- skills/route.ts
- download/route.ts
- 17. Admin CMS Requirements
- compilerOptions
- db.ts
- package.json
- DEVELOPMENT_PHASES.md
- 23. Technical Stack
- 31. APPROVED TECHNOLOGY STACK
- site-content/route.ts
- verify-reconstructed-home.ts
- 4. CROSS-PHASE SECURITY RULE
- 63. PRODUCTION SECURITY CHECKLIST
- media/route.ts
- contact-settings/route.ts
- PHASE 8 — HOME & CORE PUBLIC PAGES
- Design System Specification — Dark Systems / Technical Editorial
- dependencies
- devDependencies
- 3.1 Recruiters / Hiring Managers
- about/route.ts
- hero/route.ts
- profile/route.ts
- seo/route.ts
- session.ts
- zod
- activity/route.ts
- 61. TESTING SECURITY CONTROLS
- 37. Why This Stack
- error-boundary-view.tsx
- scripts
- 13. Skills Page
- eslint.config.mjs
- 4. Product Principles
- Required sections
- 38. Explicitly Rejected / Avoided Technologies
- not-found-view.tsx
- PHASE 11 — 3D, MOTION & PREMIUM INTERACTIONS
- PHASE 4 — AUTHENTICATION & ADMIN SECURITY
- PHASE 6 — MEDIA & RESUME MANAGEMENT
- PHASE 10 — CONTACT SYSTEM
- Verify
- 72. DECISION LOGIC
- metrics/[id]/route.ts
- icon.tsx
- 2. PHASE GATES
- PHASE 15 — PRODUCTION DEPLOYMENT
- PHASE 2 — DESIGN SYSTEM & VISUAL FOUNDATION
- PHASE 3 — DATABASE & CONTENT ARCHITECTURE
- PHASE 5 — ADMIN CMS
- PHASE 7 — PUBLIC SITE SHELL
- PHASE 9 — PROJECTS & CASE STUDIES
- PHASE 13 — TESTING & SECURITY HARDENING
- 3. SECURITY DOCUMENT ANALYSIS PROTOCOL
- 57. TEST BEFORE DECLARING COMPLETE
- Current projects
- run-qa-suite.ts
- PHASE 0 — PROJECT INITIALIZATION
- PHASE 14 — PERFORMANCE & ACCESSIBILITY OPTIMIZATION
- PHASE 1 — ARCHITECTURE & APPLICATION FOUNDATION
- PHASE 12 — SEO, ANALYTICS & DISCOVERABILITY
- PHASE 17 — DOCUMENTATION & HANDOVER
- SR Enterprises
- 16. Contact Page
- 19. Database Requirements
- 2. Product Goals
- 33. Admin Messages Page
- 39. Testing Strategy
- 42. Success Metrics
- 43. MVP Scope
- 28. End-to-End Testing — Playwright
- 32. Rendering Strategy
- 25. Security Requirements
- 6. 3D & Motion Strategy
- 5. XSS — CROSS-SITE SCRIPTING
- 74. FINAL SECURITY COMMANDMENT
- 13. Database — Supabase PostgreSQL (Approved Architecture)
- 18. Authentication — Better Auth
- 19. Email — Resend
- 20. Anti-Spam — Cloudflare Turnstile
- 3. Framework — Next.js
- 9. 3D — Three.js
- next.config.ts
- postcss.config.mjs
- README.md
- Siddharth Varpe Portfolio — Security Constitution
- 2. ABSOLUTE SECURITY RULE
- 72. SECURITY DECISION ESCALATION
- 7. INSECURE FILE UPLOADS
- 12. Animation — Motion
- 15. Database Collections
- 21. File Storage — Vercel Blob
- 23. Deployment — Vercel
- 29. Environment Configuration
- 4. Language — TypeScript
- 5. Frontend — React
- Technical Stack Specification
- {
  signIn,
  signOut,
  useSession,
  getSession,
  changePassword,
}
- experience-manager.tsx
- types/models.ts
- ProjectDocument
- server.ts
- getAdminContactSettings
- @playwright/test
- certifications-manager.tsx
- messages/[id]/route.ts
- lucide-react
- hero-editor.tsx
- server-only.ts
- media-manager.tsx
- resume-manager.tsx
- turnstile-widget.tsx
- skills-manager.tsx

## God Nodes (most connected - your core abstractions)
1. `requireAdminSession()` - 142 edges
2. `react` - 78 edges
3. `getSupabaseAdmin()` - 75 edges
4. `cn()` - 75 edges
5. `withDatabaseErrorHandling()` - 74 edges
6. `getStore()` - 73 edges
7. `lucide-react` - 50 edges
8. `useToast()` - 37 edges
9. `logAdminActivity()` - 37 edges
10. `recordRevision()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `requireAdminSession()`  [EXTRACTED]
  app/api/admin/test-protected/route.ts → lib/server/auth/session.ts
- `GET()` --calls--> `getActiveResume()`  [EXTRACTED]
  app/api/resume/download/route.ts → lib/server/db/repositories/content.ts
- `sitemap()` --calls--> `getPublishedProjects()`  [EXTRACTED]
  app/sitemap.ts → lib/server/db/repositories/content.ts
- `HeroQuoteOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/public/hero-section.tsx → lib/utils.ts
- `AboutPage()` --calls--> `generateBreadcrumbJsonLd()`  [EXTRACTED]
  app/(public)/about/page.tsx → lib/seo.ts

## Import Cycles
- None detected.

## Communities (144 total, 22 thin omitted)

### Community 0 - "DEVELOPMENT_RULES.md"
Cohesion: 0.03
Nodes (76): 10. RESPONSIVE QUALITY, 11. ACCESSIBILITY IS NOT OPTIONAL, 12. PERFORMANCE IS A FEATURE, 13. 3D MUST HAVE A PURPOSE, 14. PROGRESSIVE 3D, 15. ANIMATION RULES, 16. NO FAKE CONTENT, 17. METRICS MUST BE REAL (+68 more)

### Community 1 - "SECURITY.md"
Cohesion: 0.03
Nodes (66): 10. BROKEN PASSWORD RESET, 11. WEAK SESSION MANAGEMENT, 12. JWT SECRETS, 13. PERMISSIVE CORS, 14. RATE LIMITS, 15. EXPOSED ENVIRONMENT VARIABLES, 16. DEFAULT CREDENTIALS, 17. UNSIGNED WEBHOOKS (+58 more)

### Community 2 - "[slug]/page.tsx"
Cohesion: 0.11
Nodes (49): AchievementsPage(), metadata, CertificationsPage(), metadata, ContactPage(), metadata, ExperiencePage(), metadata (+41 more)

### Community 3 - "mappers.ts"
Cohesion: 0.12
Nodes (25): mapAboutToDb(), mapContactSettingsToDb(), mapExperienceToDb(), mapMediaToDb(), mapProfileToDb(), mapResumeToDb(), mapSeoToDb(), mapSiteContentToDb() (+17 more)

### Community 4 - "react"
Cohesion: 0.05
Nodes (59): metadata, AdminPanelProps, LoginFormProps, PageIntro(), PageIntroProps, Button, ButtonProps, Checkbox (+51 more)

### Community 5 - "ui/index.ts"
Cohesion: 0.13
Nodes (32): HERO_VARIANTS, PAGE_KEYS, PageHeroEditorProps, DynamicHeroProps, HeroCtaButton(), HeroCtaProps, ConversionHeroProps, ConversionHeroVariant() (+24 more)

### Community 6 - "resume/upload/route.ts"
Cohesion: 0.16
Nodes (19): dynamic, POST(), dynamic, POST(), lib_server_db_createadminmediawithassociation, createAdminMediaWithAssociation(), BlobUploadResult, deleteBlob() (+11 more)

### Community 7 - "contact/route.ts"
Cohesion: 0.07
Nodes (25): contactApiSchema, dynamic, POST(), lib_server_db_savecontactmessage, lib_server_db_updatecontactmessagedelivery, checkRateLimit(), cleanupStaleEntries(), hashClientIp() (+17 more)

### Community 8 - "supabase-adapter.ts"
Cohesion: 0.17
Nodes (12): applyWhere(), deleteMemoryRecords(), FilterableBuilder, getMemoryRecords(), GlobalAuthStore, globalStore, matchesWhere(), setMemoryRecord() (+4 more)

### Community 9 - "useToast"
Cohesion: 0.15
Nodes (15): AboutEditor(), AboutEditorProps, ContactSettingsEditor(), ProfileEditor(), SiteContentEditor(), Toast, ToastContext, ToastContextValue (+7 more)

### Community 10 - "empty-state.tsx"
Cohesion: 0.12
Nodes (20): ConfirmDialog(), ConfirmDialogProps, EmptyState(), EmptyStateProps, AchievementsManager(), AchievementsManagerProps, ActivityManagerProps, SerializedActivityLog (+12 more)

### Community 11 - "PRD.md"
Cohesion: 0.06
Nodes (34): 12. Project Case Study Requirements, 14. Achievements Page, 15. Certifications Page, 18. Authentication Requirements, 1. Product Overview, 20. Media Storage, 21. Email Requirements, 22. Anti-Spam & Abuse Prevention (+26 more)

### Community 12 - "bootstrap.ts"
Cohesion: 0.05
Nodes (44): AdminLayout(), AdminLayoutProps, dynamic, metadata, AdminLoginPage(), dynamic, LoginPageProps, metadata (+36 more)

### Community 13 - "(public)/page.tsx"
Cohesion: 0.09
Nodes (22): metadata, SpotlightCard(), FeaturedProjectsSlider(), DEFAULT_HERO_IMAGE_OVERLAY, HeroQuoteOverlay(), HeroSection(), HeroSectionProps, METRIC_ICONS (+14 more)

### Community 14 - "pil"
Cohesion: 0.13
Nodes (3): math, pil, sys

### Community 15 - "getSupabaseAdmin"
Cohesion: 0.19
Nodes (46): withDatabaseErrorHandling(), createAdminAchievement(), createAdminCertification(), createAdminExperience(), createAdminMedia(), createAdminMetric(), createAdminProject(), createAdminResume() (+38 more)

### Community 16 - "motion-wrapper.tsx"
Cohesion: 0.10
Nodes (23): dynamic, PublicLayoutProps, AnimatedDivider(), AnimatedDividerProps, HoverCard(), HoverCardProps, Reveal(), RevealProps (+15 more)

### Community 17 - "store.ts"
Cohesion: 0.21
Nodes (15): ContactSettingsEditorProps, ProfileEditorProps, SiteContentEditorProps, data_portfolio_seed_data, DashboardStats, assignIds(), ensureDates(), initializeStore() (+7 more)

### Community 18 - "page-heroes/route.ts"
Cohesion: 0.18
Nodes (12): AdminPageHeroesPage(), dynamic, metadata, dynamic, GET(), PUT(), updatePageHeroBodySchema, PageHeroEditor() (+4 more)

### Community 19 - "TechStack.md"
Cohesion: 0.08
Nodes (24): 10. React Three Fiber, 11. @react-three/drei, 14. Supabase Client & PostgreSQL Integration Layer, 16. Validation — Zod, 17. Forms — React Hook Form, 1. Stack Philosophy, 22. Images — Next/Image, 24. Version Control — Git + GitHub (+16 more)

### Community 20 - "validations/models.ts"
Cohesion: 0.08
Nodes (24): DELETE(), dynamic, PUT(), RouteParams, dynamic, GET(), POST(), dynamic (+16 more)

### Community 21 - "seo.ts"
Cohesion: 0.13
Nodes (19): app_globals, caveat, geistMono, geistSans, metadata, RootLayout(), viewport, AboutPage() (+11 more)

### Community 22 - "resume/[id]/route.ts"
Cohesion: 0.09
Nodes (18): AdminResumePage(), dynamic, metadata, dynamic, POST(), RouteParams, DELETE(), dynamic (+10 more)

### Community 23 - "content.ts"
Cohesion: 0.09
Nodes (44): HomePage(), lib_server_db_getpublishedabout, lib_server_db_getpublishedachievements, lib_server_db_getpublishedcertifications, lib_server_db_getpublishedcontactsettings, lib_server_db_getpublishedexperience, lib_server_db_getpublishedhero, lib_server_db_getpublishedmetrics (+36 more)

### Community 24 - "achievements/[id]/route.ts"
Cohesion: 0.11
Nodes (15): AdminAchievementsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+7 more)

### Community 25 - "ref_next_server"
Cohesion: 0.08
Nodes (21): AdminCertificationsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+13 more)

### Community 26 - "requireAdminSession"
Cohesion: 0.08
Nodes (28): dynamic, EditProjectPage(), EditProjectPageProps, metadata, dynamic, metadata, NewProjectPage(), AdminProjectsPage() (+20 more)

### Community 27 - "admin.ts"
Cohesion: 0.10
Nodes (26): DEFAULT_PAGE_HEROES, mapAchievementToDb(), mapActivityLogFromDb(), mapCertificationToDb(), mapContactMessageFromDb(), mapHeroToDb(), mapMediaFromDb(), mapMetricToDb() (+18 more)

### Community 28 - "skills/route.ts"
Cohesion: 0.11
Nodes (16): AdminSkillsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+8 more)

### Community 29 - "download/route.ts"
Cohesion: 0.14
Nodes (10): dynamic, GET(), lib_server_db_getactiveresume, ref_node_fs, ref_node_fs_promises, ref_node_path, @vitejs/plugin-react, ref_vitest_config (+2 more)

### Community 30 - "17. Admin CMS Requirements"
Cohesion: 0.11
Nodes (19): 17. Admin CMS Requirements, About, Account & Security, Achievements, Activity Log, Certifications, Contact & Socials, Dashboard (+11 more)

### Community 31 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 32 - "db.ts"
Cohesion: 0.13
Nodes (13): AdminExperiencePage(), dynamic, metadata, AdminRevisionsPage(), dynamic, metadata, dynamic, GET() (+5 more)

### Community 33 - "package.json"
Cohesion: 0.10
Nodes (20): name, private, version, eslint, eslint-config-next, jsdom, motion, postcss (+12 more)

### Community 34 - "DEVELOPMENT_PHASES.md"
Cohesion: 0.12
Nodes (14): 0. PURPOSE OF THIS DOCUMENT, 10. PHASE COMPLETION REPORT, 11. FINAL DEFINITION OF COMPLETE, 12. FINAL ANTIGRAVITY EXECUTION PRINCIPLE, 1. SOURCE-OF-TRUTH HIERARCHY, 3. GLOBAL DEVELOPMENT SEQUENCE, 5. DEPENDENCY RULE, 6. USER-PROVIDED ASSET DEPENDENCIES (+6 more)

### Community 35 - "23. Technical Stack"
Cohesion: 0.12
Nodes (16): 23. Technical Stack, 3D, Analytics / Monitoring, Animation, Anti-Spam, Authentication, Core, Database (+8 more)

### Community 36 - "31. APPROVED TECHNOLOGY STACK"
Cohesion: 0.14
Nodes (14): 31. APPROVED TECHNOLOGY STACK, 3D, Analytics, Anti-spam, Authentication, Core, Data, Deployment (+6 more)

### Community 37 - "site-content/route.ts"
Cohesion: 0.18
Nodes (9): AdminSiteContentPage(), dynamic, metadata, dynamic, GET(), PUT(), lib_server_db_getadminsitecontent, lib_server_db_updateadminsitecontent (+1 more)

### Community 38 - "verify-reconstructed-home.ts"
Cohesion: 0.20
Nodes (4): ref_path, ref_playwright, VIEWPORTS, VIEWPORTS

### Community 39 - "4. CROSS-PHASE SECURITY RULE"
Cohesion: 0.15
Nodes (13): 4. CROSS-PHASE SECURITY RULE, Phase 1, Phase 10, Phase 11, Phase 12, Phase 13, Phase 15–16, Phase 3 (+5 more)

### Community 40 - "63. PRODUCTION SECURITY CHECKLIST"
Cohesion: 0.15
Nodes (13): 63. PRODUCTION SECURITY CHECKLIST, API, Authentication, Authorization, CSRF, Deployment, Logs, Secrets (+5 more)

### Community 41 - "media/route.ts"
Cohesion: 0.18
Nodes (9): AdminMediaPage(), dynamic, metadata, dynamic, GET(), POST(), lib_server_db_createadminmedia, lib_server_db_getadminmedia (+1 more)

### Community 42 - "contact-settings/route.ts"
Cohesion: 0.18
Nodes (9): AdminContactSettingsPage(), dynamic, metadata, dynamic, GET(), PUT(), lib_server_db_getadmincontactsettings, lib_server_db_updateadmincontactsettings (+1 more)

### Community 43 - "PHASE 8 — HOME & CORE PUBLIC PAGES"
Cohesion: 0.17
Nodes (12): About, Acceptance Criteria, Achievements, Approved Hero Direction, Certifications, Experience, Home, Objective (+4 more)

### Community 44 - "Design System Specification — Dark Systems / Technical Editorial"
Cohesion: 0.17
Nodes (11): 1. Locked Visual Direction: Dark Systems / Technical Editorial, 2. Locked Core Principles, 3. Design Tokens, 4. Typography Hierarchy, 5. Layout Primitives, 6. Accessibility & Security Gates, Atmospheric Attributes:, Color System (+3 more)

### Community 45 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, better-auth, lucide-react, motion, next, react, react-dom, server-only (+5 more)

### Community 46 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, jsdom, @playwright/test, postcss, tailwindcss (+10 more)

### Community 47 - "3.1 Recruiters / Hiring Managers"
Cohesion: 0.17
Nodes (12): 3.1 Recruiters / Hiring Managers, 3.2 Freelance / Client Prospects, 3.3 Portfolio Administrator — Siddharth, 3. Target Users, Need, Need, Need, Success condition (+4 more)

### Community 48 - "about/route.ts"
Cohesion: 0.18
Nodes (9): AdminAboutPage(), dynamic, metadata, dynamic, GET(), PUT(), lib_server_db_getadminabout, lib_server_db_updateadminabout (+1 more)

### Community 49 - "hero/route.ts"
Cohesion: 0.18
Nodes (9): AdminHeroPage(), dynamic, metadata, dynamic, GET(), PUT(), lib_server_db_getadminhero, lib_server_db_updateadminhero (+1 more)

### Community 50 - "profile/route.ts"
Cohesion: 0.18
Nodes (9): AdminProfilePage(), dynamic, metadata, dynamic, GET(), PUT(), lib_server_db_getadminprofile, lib_server_db_updateadminprofile (+1 more)

### Community 51 - "seo/route.ts"
Cohesion: 0.18
Nodes (9): AdminSeoPage(), dynamic, metadata, dynamic, GET(), PUT(), lib_server_db_getadminseo, lib_server_db_updateadminseo (+1 more)

### Community 52 - "session.ts"
Cohesion: 0.11
Nodes (16): AdminMessagesPage(), dynamic, metadata, dynamic, GET(), GET(), POST(), assertResourceAccess() (+8 more)

### Community 53 - "zod"
Cohesion: 0.08
Nodes (17): publicEnv, publicEnvSchema, ServerEnv, serverEnvSchema, idSchema, objectIdSchema, paginationSchema, searchFilterSchema (+9 more)

### Community 54 - "activity/route.ts"
Cohesion: 0.20
Nodes (8): AdminActivityPage(), dynamic, metadata, dynamic, GET(), ActivityManager(), lib_server_db_getadminactivitylogs, types_index_activitylogdocument

### Community 55 - "61. TESTING SECURITY CONTROLS"
Cohesion: 0.20
Nodes (10): 61. TESTING SECURITY CONTROLS, API authorization, Authentication, Authorization, CSRF, File uploads, Input, Rate limits (+2 more)

### Community 56 - "37. Why This Stack"
Cohesion: 0.20
Nodes (10): 37. Why This Stack, Better Auth, Next.js + TypeScript, Resend, Supabase PostgreSQL, Three.js + React Three Fiber, Turnstile, Vercel Blob (+2 more)

### Community 58 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, db:seed, db:verify, dev, lint, start, test:qa (+1 more)

### Community 59 - "13. Skills Page"
Cohesion: 0.22
Nodes (9): 13. Skills Page, AI, Backend / APIs, Databases, Deployment, Design, Frontend, Languages (+1 more)

### Community 60 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (6): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc, ref_url

### Community 61 - "4. Product Principles"
Cohesion: 0.25
Nodes (8): 4.1 Proof Over Claims, 4.2 Quality Over Quantity, 4.3 Original Design, 4.4 Progressive Enhancement, 4.5 Mobile First, 4.6 Performance Is a Feature, 4.7 Content Is Data, 4. Product Principles

### Community 62 - "Required sections"
Cohesion: 0.25
Nodes (8): 8.1 Header, 8.2 Hero, 8.3 Impact Metrics, 8.4 Featured Projects, 8.5 About Preview, 8.6 Final CTA, 8. Home Page Requirements, Required sections

### Community 63 - "38. Explicitly Rejected / Avoided Technologies"
Cohesion: 0.25
Nodes (8): 38. Explicitly Rejected / Avoided Technologies, Docker, Firebase, GraphQL, MongoDB Atlas, Python / FastAPI, Redis, Redux

### Community 65 - "PHASE 11 — 3D, MOTION & PREMIUM INTERACTIONS"
Cohesion: 0.29
Nodes (7): 3D Concept, Acceptance Criteria, Motion, Objective, PHASE 11 — 3D, MOTION & PREMIUM INTERACTIONS, Rules, Technology

### Community 66 - "PHASE 4 — AUTHENTICATION & ADMIN SECURITY"
Cohesion: 0.29
Nodes (7): Acceptance Criteria, Bootstrap Credentials, Objective, PHASE 4 — AUTHENTICATION & ADMIN SECURITY, Security Review, Tasks, Technology

### Community 67 - "PHASE 6 — MEDIA & RESUME MANAGEMENT"
Cohesion: 0.29
Nodes (7): Acceptance Criteria, Media Types, Objective, PHASE 6 — MEDIA & RESUME MANAGEMENT, Professional Photo Dependency, Security, Technology

### Community 68 - "PHASE 10 — CONTACT SYSTEM"
Cohesion: 0.29
Nodes (7): Acceptance Criteria, Admin Messages, Approved Architecture, Objective, PHASE 10 — CONTACT SYSTEM, Reliability Rule, Security

### Community 69 - "Verify"
Cohesion: 0.29
Nodes (7): Admin, Contact, Objective, PHASE 16 — PRODUCTION VERIFICATION, Public, Security, Verify

### Community 70 - "72. DECISION LOGIC"
Cohesion: 0.29
Nodes (7): 72. DECISION LOGIC, If ambiguous:, If explicitly prohibited:, If explicitly required:, If necessary to make an approved feature function:, If security-sensitive and ambiguous:, If useful but not required:

### Community 71 - "metrics/[id]/route.ts"
Cohesion: 0.11
Nodes (15): AdminMetricsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+7 more)

### Community 72 - "icon.tsx"
Cohesion: 0.33
Nodes (4): contentType, runtime, size, ref_next_og

### Community 73 - "2. PHASE GATES"
Cohesion: 0.33
Nodes (6): 2. PHASE GATES, A. Build, B. Functional Test, C. Security Review, D. Quality Review, E. Phase Approval

### Community 74 - "PHASE 15 — PRODUCTION DEPLOYMENT"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Environment, Infrastructure, Objective, PHASE 15 — PRODUCTION DEPLOYMENT, Pre-deployment Checklist

### Community 75 - "PHASE 2 — DESIGN SYSTEM & VISUAL FOUNDATION"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Objective, PHASE 2 — DESIGN SYSTEM & VISUAL FOUNDATION, Responsive Strategy, Tasks, Visual Direction

### Community 76 - "PHASE 3 — DATABASE & CONTENT ARCHITECTURE"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Core content domains, Objective, PHASE 3 — DATABASE & CONTENT ARCHITECTURE, Rules, Technology

### Community 77 - "PHASE 5 — ADMIN CMS"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Admin Areas, CMS Requirements, Important, Objective, PHASE 5 — ADMIN CMS

### Community 78 - "PHASE 7 — PUBLIC SITE SHELL"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Objective, PHASE 7 — PUBLIC SITE SHELL, Public Navigation, Rules, Tasks

### Community 79 - "PHASE 9 — PROJECTS & CASE STUDIES"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Important, Objective, PHASE 9 — PROJECTS & CASE STUDIES, Project Page Structure, Projects

### Community 80 - "PHASE 13 — TESTING & SECURITY HARDENING"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Functional Testing, Objective, PHASE 13 — TESTING & SECURITY HARDENING, Security Testing, Testing Stack

### Community 81 - "3. SECURITY DOCUMENT ANALYSIS PROTOCOL"
Cohesion: 0.33
Nodes (6): 3. SECURITY DOCUMENT ANALYSIS PROTOCOL, Step 1 — Identify the feature, Step 2 — Identify trust boundaries, Step 3 — Match against SECURITY.md, Step 4 — Design the secure implementation, Step 5 — Test the security boundary

### Community 82 - "57. TEST BEFORE DECLARING COMPLETE"
Cohesion: 0.33
Nodes (6): 57. TEST BEFORE DECLARING COMPLETE, Accessibility, Functional, Performance, Responsive, Security

### Community 83 - "Current projects"
Cohesion: 0.33
Nodes (6): 11.1 CRM — SR Enterprises, 11.2 Inventory Management Platform, 11.3 Campus Buddy, 11.4 Portfolio Website, 11. Projects Page, Current projects

### Community 84 - "run-qa-suite.ts"
Cohesion: 0.48
Nodes (6): checkRoute(), fetchRoute(), main(), results, runTest(), TestResult

### Community 85 - "PHASE 0 — PROJECT INITIALIZATION"
Cohesion: 0.40
Nodes (5): Acceptance Criteria, Objective, PHASE 0 — PROJECT INITIALIZATION, Rules, Tasks

### Community 86 - "PHASE 14 — PERFORMANCE & ACCESSIBILITY OPTIMIZATION"
Cohesion: 0.40
Nodes (5): Acceptance Criteria, Accessibility, Objective, Performance, PHASE 14 — PERFORMANCE & ACCESSIBILITY OPTIMIZATION

### Community 87 - "PHASE 1 — ARCHITECTURE & APPLICATION FOUNDATION"
Cohesion: 0.40
Nodes (5): Acceptance Criteria, Initial route structure, Objective, PHASE 1 — ARCHITECTURE & APPLICATION FOUNDATION, Tasks

### Community 88 - "PHASE 12 — SEO, ANALYTICS & DISCOVERABILITY"
Cohesion: 0.40
Nodes (5): Acceptance Criteria, Analytics, Objective, PHASE 12 — SEO, ANALYTICS & DISCOVERABILITY, SEO

### Community 89 - "PHASE 17 — DOCUMENTATION & HANDOVER"
Cohesion: 0.40
Nodes (5): Documentation, Documentation Consistency, Final Handover, Objective, PHASE 17 — DOCUMENTATION & HANDOVER

### Community 90 - "SR Enterprises"
Cohesion: 0.50
Nodes (4): 10. Experience Page, CRM — SR Enterprises, Inventory Management Platform, SR Enterprises

### Community 91 - "16. Contact Page"
Cohesion: 0.50
Nodes (4): 16. Contact Page, Contact message data, Contact submission flow, Required fields

### Community 92 - "19. Database Requirements"
Cohesion: 0.50
Nodes (4): 19. Database Requirements, Database, Persistence Requirement, Suggested collections

### Community 93 - "2. Product Goals"
Cohesion: 0.50
Nodes (4): 2.1 Primary Goals, 2.2 Secondary Goals, 2.3 Non-Goals, 2. Product Goals

### Community 94 - "33. Admin Messages Page"
Cohesion: 0.50
Nodes (4): 33. Admin Messages Page, Dashboard summary, Message detail, Message list

### Community 95 - "39. Testing Strategy"
Cohesion: 0.50
Nodes (4): 39. Testing Strategy, End-to-End Testing, Security Testing, Unit Testing

### Community 96 - "42. Success Metrics"
Cohesion: 0.50
Nodes (4): 42. Success Metrics, Operational, Professional, Technical

### Community 97 - "43. MVP Scope"
Cohesion: 0.50
Nodes (4): 43. MVP Scope, Admin, Infrastructure, Public

### Community 98 - "28. End-to-End Testing — Playwright"
Cohesion: 0.50
Nodes (4): 28. End-to-End Testing — Playwright, Admin, Public, Security

### Community 99 - "32. Rendering Strategy"
Cohesion: 0.50
Nodes (4): 32. Rendering Strategy, Prefer dynamic/server rendering for:, Prefer static/cached rendering for:, Revalidation

### Community 100 - "25. Security Requirements"
Cohesion: 0.67
Nodes (3): 25. Security Requirements, Application Security, Database Security

### Community 101 - "6. 3D & Motion Strategy"
Cohesion: 0.67
Nodes (3): 6.1 3D Concept, 6.2 Motion Rules, 6. 3D & Motion Strategy

### Community 102 - "5. XSS — CROSS-SITE SCRIPTING"
Cohesion: 0.67
Nodes (3): 5. XSS — CROSS-SITE SCRIPTING, Required protections, Stored XSS

### Community 103 - "74. FINAL SECURITY COMMANDMENT"
Cohesion: 0.67
Nodes (3): 74. FINAL SECURITY COMMANDMENT, End of Security Constitution, FINAL INSTRUCTION

### Community 104 - "13. Database — Supabase PostgreSQL (Approved Architecture)"
Cohesion: 0.67
Nodes (3): 13. Database — Supabase PostgreSQL (Approved Architecture), Application Connection, Important Architecture Rule

### Community 105 - "18. Authentication — Better Auth"
Cohesion: 0.67
Nodes (3): 18. Authentication — Better Auth, Initial Development Credentials, Security

### Community 106 - "19. Email — Resend"
Cohesion: 0.67
Nodes (3): 19. Email — Resend, Contact flow, Environment

### Community 107 - "20. Anti-Spam — Cloudflare Turnstile"
Cohesion: 0.67
Nodes (3): 20. Anti-Spam — Cloudflare Turnstile, Environment, Required flow

### Community 108 - "3. Framework — Next.js"
Cohesion: 0.67
Nodes (3): 3. Framework — Next.js, Architecture Preference, Role

### Community 109 - "9. 3D — Three.js"
Cohesion: 0.67
Nodes (3): 9. 3D — Three.js, Purpose, Rules

### Community 128 - "experience-manager.tsx"
Cohesion: 0.50
Nodes (4): ExperienceManager(), ExperienceManagerProps, types_index_experiencedocument, ExperienceDocument

### Community 129 - "types/models.ts"
Cohesion: 0.24
Nodes (8): SeoEditor(), SeoEditorProps, AuditableEntity, BaseEntity, types_index_seometadatadocument, HeroStatConfig, HeroVariant, SeoMetadataDocument

### Community 130 - "ProjectDocument"
Cohesion: 0.23
Nodes (11): ProjectForm(), ProjectFormProps, ProjectsManager(), ProjectsManagerProps, FeaturedProjectsSliderProps, ProjectsExplorerProps, ref_next_navigation, ContentStatus (+3 more)

### Community 131 - "server.ts"
Cohesion: 0.22
Nodes (4): createAdminClient(), ref_next_headers, @supabase/ssr, @supabase/supabase-js

### Community 132 - "getAdminContactSettings"
Cohesion: 0.67
Nodes (3): mapContactSettingsFromDb(), getAdminContactSettings(), getPublishedContactSettings()

### Community 133 - "@playwright/test"
Cohesion: 0.17
Nodes (6): @playwright/test, main(), measurePage(), MetricsReport, MOBILE_VIEWPORTS, PUBLIC_PAGES

### Community 134 - "certifications-manager.tsx"
Cohesion: 0.50
Nodes (4): CertificationsManager(), CertificationsManagerProps, types_index_certificationdocument, CertificationDocument

### Community 135 - "messages/[id]/route.ts"
Cohesion: 0.32
Nodes (7): DELETE(), dynamic, PATCH(), RouteParams, lib_server_db_deletecontactmessage, deleteContactMessage(), lib_server_db_updatecontactmessagestatus

### Community 136 - "lucide-react"
Cohesion: 0.43
Nodes (4): NavItem, PUBLIC_NAV_ITEMS, ThemeToggle(), lucide-react

### Community 137 - "hero-editor.tsx"
Cohesion: 0.40
Nodes (5): HeroEditor(), HeroEditorProps, types_index_herodocument, types_index_heroimageoverlay, HeroDocument

### Community 140 - "media-manager.tsx"
Cohesion: 0.50
Nodes (4): MediaManager(), MediaManagerProps, types_index_mediametadatadocument, MediaMetadataDocument

### Community 141 - "resume-manager.tsx"
Cohesion: 0.50
Nodes (4): ResumeManager(), ResumeManagerProps, types_index_resumemetadatadocument, ResumeMetadataDocument

### Community 142 - "turnstile-widget.tsx"
Cohesion: 0.40
Nodes (3): TurnstileWidget(), TurnstileWidgetProps, Window

### Community 148 - "skills-manager.tsx"
Cohesion: 0.50
Nodes (4): CATEGORIES, SkillsManager(), SkillsManagerProps, SkillDocument

## Knowledge Gaps
- **841 isolated node(s):** `metadata`, `metadata`, `metadata`, `metadata`, `metadata` (+836 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 984 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `experience-manager.tsx`, `types/models.ts`, `[slug]/page.tsx`, `ProjectDocument`, `ui/index.ts`, `certifications-manager.tsx`, `lucide-react`, `useToast`, `empty-state.tsx`, `hero-editor.tsx`, `bootstrap.ts`, `(public)/page.tsx`, `media-manager.tsx`, `resume-manager.tsx`, `motion-wrapper.tsx`, `turnstile-widget.tsx`, `skills-manager.tsx`, `seo.ts`, `package.json`, `error-boundary-view.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `requireAdminSession()` connect `requireAdminSession` to `ProjectDocument`, `resume/upload/route.ts`, `messages/[id]/route.ts`, `bootstrap.ts`, `page-heroes/route.ts`, `validations/models.ts`, `resume/[id]/route.ts`, `achievements/[id]/route.ts`, `ref_next_server`, `skills/route.ts`, `db.ts`, `site-content/route.ts`, `media/route.ts`, `contact-settings/route.ts`, `about/route.ts`, `hero/route.ts`, `profile/route.ts`, `seo/route.ts`, `session.ts`, `activity/route.ts`, `metrics/[id]/route.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `experience-manager.tsx`, `types/models.ts`, `[slug]/page.tsx`, `ProjectDocument`, `react`, `ui/index.ts`, `certifications-manager.tsx`, `package.json`, `useToast`, `empty-state.tsx`, `hero-editor.tsx`, `bootstrap.ts`, `(public)/page.tsx`, `media-manager.tsx`, `resume-manager.tsx`, `turnstile-widget.tsx`, `skills-manager.tsx`, `seo.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _841 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DEVELOPMENT_RULES.md` be split into smaller, more focused modules?**
  _Cohesion score 0.02564102564102564 - nodes in this community are weakly interconnected._
- **Should `SECURITY.md` be split into smaller, more focused modules?**
  _Cohesion score 0.029411764705882353 - nodes in this community are weakly interconnected._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10790960451977401 - nodes in this community are weakly interconnected._