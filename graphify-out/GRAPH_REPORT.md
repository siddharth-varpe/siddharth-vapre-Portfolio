# Graph Report - Portfolio  (2026-09-18)

## Corpus Check
- 209 files · ~551,200 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .example 1, .css 1)

## Summary
- 1739 nodes · 3753 edges · 140 communities (117 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8df8a384`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DEVELOPMENT_RULES.md
- SECURITY.md
- [slug]/page.tsx
- content.ts
- cn
- admin-shell.tsx
- resume/upload/route.ts
- contact/route.ts
- getSupabaseAdmin
- useToast
- empty-state.tsx
- PRD.md
- supabase-adapter.ts
- react
- getAdminProjects
- types/models.ts
- (public)/page.tsx
- store.ts
- admin.ts
- TechStack.md
- validations/models.ts
- seo.ts
- ref_next_server
- design-system/page.tsx
- achievements/[id]/route.ts
- requireAdminSession
- experience/[id]/route.ts
- metrics/[id]/route.ts
- skills/route.ts
- session.ts
- 17. Admin CMS Requirements
- compilerOptions
- db.ts
- package.json
- DEVELOPMENT_PHASES.md
- 23. Technical Stack
- 31. APPROVED TECHNOLOGY STACK
- messages/route.ts
- projects-manager.tsx
- 4. CROSS-PHASE SECURITY RULE
- 63. PRODUCTION SECURITY CHECKLIST
- media/route.ts
- resume/route.ts
- PHASE 8 — HOME & CORE PUBLIC PAGES
- Design System Specification — Dark Systems / Technical Editorial
- dependencies
- devDependencies
- 3.1 Recruiters / Hiring Managers
- about/route.ts
- hero/route.ts
- profile/route.ts
- seo/route.ts
- site-content/route.ts
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
- validations/common.ts
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
- rate-limit.ts
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
- vitest
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
- actions.ts
- resend.ts
- server.ts
- services/index.ts
- @playwright/test
- achievements-manager.tsx
- media-manager.tsx
- skills-manager.tsx
- getAdminContactSettings
- server-only.ts

## God Nodes (most connected - your core abstractions)
1. `requireAdminSession()` - 137 edges
2. `getSupabaseAdmin()` - 75 edges
3. `withDatabaseErrorHandling()` - 73 edges
4. `getStore()` - 73 edges
5. `react` - 66 edges
6. `cn()` - 54 edges
7. `lucide-react` - 46 edges
8. `logAdminActivity()` - 37 edges
9. `useToast()` - 35 edges
10. `recordRevision()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `AdminLayout()` --calls--> `getServerSession()`  [EXTRACTED]
  app/admin/layout.tsx → lib/server/auth/session.ts
- `NewProjectPage()` --calls--> `requireAdminSession()`  [EXTRACTED]
  app/admin/projects/new/page.tsx → lib/server/auth/session.ts
- `GET()` --calls--> `requireAdminSession()`  [EXTRACTED]
  app/api/admin/test-protected/route.ts → lib/server/auth/session.ts
- `GET()` --calls--> `getActiveResume()`  [EXTRACTED]
  app/api/resume/download/route.ts → lib/server/db/repositories/content.ts
- `AboutPage()` --calls--> `generateBreadcrumbJsonLd()`  [EXTRACTED]
  app/(public)/about/page.tsx → lib/seo.ts

## Import Cycles
- None detected.

## Communities (140 total, 23 thin omitted)

### Community 0 - "DEVELOPMENT_RULES.md"
Cohesion: 0.03
Nodes (76): 10. RESPONSIVE QUALITY, 11. ACCESSIBILITY IS NOT OPTIONAL, 12. PERFORMANCE IS A FEATURE, 13. 3D MUST HAVE A PURPOSE, 14. PROGRESSIVE 3D, 15. ANIMATION RULES, 16. NO FAKE CONTENT, 17. METRICS MUST BE REAL (+68 more)

### Community 1 - "SECURITY.md"
Cohesion: 0.03
Nodes (66): 10. BROKEN PASSWORD RESET, 11. WEAK SESSION MANAGEMENT, 12. JWT SECRETS, 13. PERMISSIVE CORS, 14. RATE LIMITS, 15. EXPOSED ENVIRONMENT VARIABLES, 16. DEFAULT CREDENTIALS, 17. UNSIGNED WEBHOOKS (+58 more)

### Community 2 - "[slug]/page.tsx"
Cohesion: 0.15
Nodes (44): metadata, AchievementsPage(), metadata, CertificationsPage(), metadata, ContactPage(), metadata, ExperiencePage() (+36 more)

### Community 3 - "content.ts"
Cohesion: 0.07
Nodes (52): HomePage(), dynamic, sitemap(), lib_server_db_getpublishedabout, lib_server_db_getpublishedachievements, lib_server_db_getpublishedcertifications, lib_server_db_getpublishedcontactsettings, lib_server_db_getpublishedexperience (+44 more)

### Community 4 - "cn"
Cohesion: 0.07
Nodes (43): AdminPanelProps, LoginFormProps, BadgeProps, Button, ButtonProps, ContainerProps, Checkbox, CheckboxProps (+35 more)

### Community 5 - "admin-shell.tsx"
Cohesion: 0.14
Nodes (13): AdminLayout(), AdminLayoutProps, dynamic, metadata, AdminShell(), AdminShellProps, NAV_GROUPS, NavGroup (+5 more)

### Community 6 - "resume/upload/route.ts"
Cohesion: 0.07
Nodes (35): dynamic, POST(), dynamic, dynamic, GET(), lib_server_db_createadminmediawithassociation, lib_server_db_createadminresume, lib_server_db_getactiveresume (+27 more)

### Community 7 - "contact/route.ts"
Cohesion: 0.18
Nodes (10): contactApiSchema, dynamic, POST(), lib_server_db_savecontactmessage, lib_server_db_updatecontactmessagedelivery, IVerificationService, sendContactNotification(), CloudflareTurnstileService (+2 more)

### Community 8 - "getSupabaseAdmin"
Cohesion: 0.21
Nodes (42): PATCH(), POST(), withDatabaseErrorHandling(), createAdminAchievement(), createAdminCertification(), createAdminExperience(), createAdminMetric(), createAdminProject() (+34 more)

### Community 9 - "useToast"
Cohesion: 0.15
Nodes (16): ProfileEditor(), ProfileEditorProps, SeoEditorProps, SiteContentEditorProps, Toast, ToastContext, ToastContextValue, ToastType (+8 more)

### Community 10 - "empty-state.tsx"
Cohesion: 0.13
Nodes (19): ConfirmDialog(), ConfirmDialogProps, EmptyState(), EmptyStateProps, ActivityManagerProps, SerializedActivityLog, CertificationsManagerProps, MessagesManagerProps (+11 more)

### Community 11 - "PRD.md"
Cohesion: 0.06
Nodes (34): 12. Project Case Study Requirements, 14. Achievements Page, 15. Certifications Page, 18. Authentication Requirements, 1. Product Overview, 20. Media Storage, 21. Email Requirements, 22. Anti-Spam & Abuse Prevention (+26 more)

### Community 12 - "supabase-adapter.ts"
Cohesion: 0.06
Nodes (38): AdminDashboardPage(), dynamic, metadata, AdminSecurityPage(), dynamic, metadata, changePasswordSchema, POST() (+30 more)

### Community 13 - "react"
Cohesion: 0.10
Nodes (20): dynamic, PublicLayoutProps, NavItem, PUBLIC_NAV_ITEMS, PublicFooter(), HeroSectionProps, GithubIcon(), InstagramIcon() (+12 more)

### Community 14 - "getAdminProjects"
Cohesion: 0.29
Nodes (6): mapProjectFromDb(), mapProjectToDb(), getAdminProfile(), getAdminProjectById(), getAdminProjects(), updateAdminProject()

### Community 15 - "types/models.ts"
Cohesion: 0.24
Nodes (8): ContactSettingsEditorProps, HeroEditorProps, AuditableEntity, BaseEntity, types_index_contactsettingsdocument, types_index_herodocument, ContactSettingsDocument, HeroDocument

### Community 16 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (24): metadata, AnimatedDivider(), AnimatedDividerProps, HoverCard(), HoverCardProps, Reveal(), RevealProps, SpotlightCard() (+16 more)

### Community 17 - "store.ts"
Cohesion: 0.24
Nodes (11): AboutEditorProps, data_portfolio_seed_data, DashboardStats, assignIds(), ensureDates(), initializeStore(), InMemoryStore, types_index_aboutdocument (+3 more)

### Community 18 - "admin.ts"
Cohesion: 0.08
Nodes (45): mapAboutToDb(), mapAchievementToDb(), mapActivityLogFromDb(), mapCertificationToDb(), mapContactMessageFromDb(), mapContactSettingsToDb(), mapExperienceToDb(), mapHeroToDb() (+37 more)

### Community 19 - "TechStack.md"
Cohesion: 0.08
Nodes (24): 10. React Three Fiber, 11. @react-three/drei, 14. Supabase Client & PostgreSQL Integration Layer, 16. Validation — Zod, 17. Forms — React Hook Form, 1. Stack Philosophy, 22. Images — Next/Image, 24. Version Control — Git + GitHub (+16 more)

### Community 20 - "validations/models.ts"
Cohesion: 0.10
Nodes (18): dynamic, GET(), PUT(), DELETE(), dynamic, RouteParams, dynamic, POST() (+10 more)

### Community 21 - "seo.ts"
Cohesion: 0.15
Nodes (15): app_globals, geistMono, geistSans, metadata, RootLayout(), AboutPage(), ProjectCaseStudyPage(), BuildMetadataOptions (+7 more)

### Community 22 - "ref_next_server"
Cohesion: 0.09
Nodes (18): DELETE(), dynamic, RouteParams, dynamic, POST(), RouteParams, DELETE(), dynamic (+10 more)

### Community 23 - "design-system/page.tsx"
Cohesion: 0.07
Nodes (27): metadata, ContactForm(), ContactFormProps, FieldErrors, FormState, FormValues, TurnstileWidget(), TurnstileWidgetProps (+19 more)

### Community 24 - "achievements/[id]/route.ts"
Cohesion: 0.11
Nodes (16): AdminAchievementsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+8 more)

### Community 25 - "requireAdminSession"
Cohesion: 0.08
Nodes (30): AdminCertificationsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+22 more)

### Community 26 - "experience/[id]/route.ts"
Cohesion: 0.14
Nodes (12): DELETE(), dynamic, PUT(), RouteParams, dynamic, GET(), POST(), lib_server_db_createadminexperience (+4 more)

### Community 27 - "metrics/[id]/route.ts"
Cohesion: 0.11
Nodes (16): AdminMetricsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+8 more)

### Community 28 - "skills/route.ts"
Cohesion: 0.10
Nodes (17): AdminSkillsPage(), dynamic, metadata, DELETE(), dynamic, PUT(), RouteParams, dynamic (+9 more)

### Community 29 - "session.ts"
Cohesion: 0.11
Nodes (18): AdminLoginPage(), dynamic, LoginPageProps, metadata, dynamic, EditProjectPage(), EditProjectPageProps, metadata (+10 more)

### Community 30 - "17. Admin CMS Requirements"
Cohesion: 0.11
Nodes (19): 17. Admin CMS Requirements, About, Account & Security, Achievements, Activity Log, Certifications, Contact & Socials, Dashboard (+11 more)

### Community 31 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 32 - "db.ts"
Cohesion: 0.11
Nodes (15): AdminContactSettingsPage(), dynamic, metadata, AdminRevisionsPage(), dynamic, metadata, dynamic, GET() (+7 more)

### Community 33 - "package.json"
Cohesion: 0.10
Nodes (19): name, private, version, better-auth, eslint, eslint-config-next, jsdom, motion (+11 more)

### Community 34 - "DEVELOPMENT_PHASES.md"
Cohesion: 0.12
Nodes (14): 0. PURPOSE OF THIS DOCUMENT, 10. PHASE COMPLETION REPORT, 11. FINAL DEFINITION OF COMPLETE, 12. FINAL ANTIGRAVITY EXECUTION PRINCIPLE, 1. SOURCE-OF-TRUTH HIERARCHY, 3. GLOBAL DEVELOPMENT SEQUENCE, 5. DEPENDENCY RULE, 6. USER-PROVIDED ASSET DEPENDENCIES (+6 more)

### Community 35 - "23. Technical Stack"
Cohesion: 0.12
Nodes (16): 23. Technical Stack, 3D, Analytics / Monitoring, Animation, Anti-Spam, Authentication, Core, Database (+8 more)

### Community 36 - "31. APPROVED TECHNOLOGY STACK"
Cohesion: 0.14
Nodes (14): 31. APPROVED TECHNOLOGY STACK, 3D, Analytics, Anti-spam, Authentication, Core, Data, Deployment (+6 more)

### Community 37 - "messages/route.ts"
Cohesion: 0.20
Nodes (8): AdminMessagesPage(), dynamic, metadata, dynamic, GET(), MessagesManager(), lib_server_db_getadmincontactmessages, types_index_contactmessagedocument

### Community 38 - "projects-manager.tsx"
Cohesion: 0.15
Nodes (15): dynamic, metadata, NewProjectPage(), AdminProjectsPage(), dynamic, metadata, ProjectForm(), ProjectFormProps (+7 more)

### Community 39 - "4. CROSS-PHASE SECURITY RULE"
Cohesion: 0.15
Nodes (13): 4. CROSS-PHASE SECURITY RULE, Phase 1, Phase 10, Phase 11, Phase 12, Phase 13, Phase 15–16, Phase 3 (+5 more)

### Community 40 - "63. PRODUCTION SECURITY CHECKLIST"
Cohesion: 0.15
Nodes (13): 63. PRODUCTION SECURITY CHECKLIST, API, Authentication, Authorization, CSRF, Deployment, Logs, Secrets (+5 more)

### Community 41 - "media/route.ts"
Cohesion: 0.17
Nodes (10): AdminMediaPage(), dynamic, metadata, dynamic, GET(), POST(), MediaManager(), lib_server_db_createadminmedia (+2 more)

### Community 42 - "resume/route.ts"
Cohesion: 0.18
Nodes (9): AdminResumePage(), dynamic, metadata, dynamic, GET(), POST(), ResumeManager(), lib_server_db_getadminresumes (+1 more)

### Community 43 - "PHASE 8 — HOME & CORE PUBLIC PAGES"
Cohesion: 0.17
Nodes (12): About, Acceptance Criteria, Achievements, Approved Hero Direction, Certifications, Experience, Home, Objective (+4 more)

### Community 44 - "Design System Specification — Dark Systems / Technical Editorial"
Cohesion: 0.17
Nodes (11): 1. Locked Visual Direction: Dark Systems / Technical Editorial, 2. Locked Core Principles, 3. Design Tokens, 4. Typography Hierarchy, 5. Layout Primitives, 6. Accessibility & Security Gates, Atmospheric Attributes:, Color System (+3 more)

### Community 45 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, better-auth, lucide-react, motion, next, react, react-dom, server-only (+4 more)

### Community 46 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, jsdom, @playwright/test, postcss, tailwindcss (+10 more)

### Community 47 - "3.1 Recruiters / Hiring Managers"
Cohesion: 0.17
Nodes (12): 3.1 Recruiters / Hiring Managers, 3.2 Freelance / Client Prospects, 3.3 Portfolio Administrator — Siddharth, 3. Target Users, Need, Need, Need, Success condition (+4 more)

### Community 48 - "about/route.ts"
Cohesion: 0.17
Nodes (10): AdminAboutPage(), dynamic, metadata, dynamic, GET(), PUT(), AboutEditor(), lib_server_db_getadminabout (+2 more)

### Community 49 - "hero/route.ts"
Cohesion: 0.17
Nodes (10): AdminHeroPage(), dynamic, metadata, dynamic, GET(), PUT(), HeroEditor(), lib_server_db_getadminhero (+2 more)

### Community 50 - "profile/route.ts"
Cohesion: 0.18
Nodes (9): AdminProfilePage(), dynamic, metadata, dynamic, GET(), PUT(), lib_server_db_getadminprofile, lib_server_db_updateadminprofile (+1 more)

### Community 51 - "seo/route.ts"
Cohesion: 0.17
Nodes (10): AdminSeoPage(), dynamic, metadata, dynamic, GET(), PUT(), SeoEditor(), lib_server_db_getadminseo (+2 more)

### Community 52 - "site-content/route.ts"
Cohesion: 0.17
Nodes (10): AdminSiteContentPage(), dynamic, metadata, dynamic, GET(), PUT(), SiteContentEditor(), lib_server_db_getadminsitecontent (+2 more)

### Community 53 - "zod"
Cohesion: 0.22
Nodes (6): publicEnv, publicEnvSchema, ServerEnv, serverEnvSchema, zod, contactApiSchema

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
Cohesion: 0.25
Nodes (7): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc, ref_path, ref_url

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

### Community 71 - "validations/common.ts"
Cohesion: 0.29
Nodes (5): idSchema, objectIdSchema, paginationSchema, searchFilterSchema, slugSchema

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

### Community 84 - "rate-limit.ts"
Cohesion: 0.29
Nodes (8): checkRateLimit(), cleanupStaleEntries(), hashClientIp(), lastCleanup, RateLimitRecord, RateLimitResult, rateLimitStore, resetRateLimitStore()

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

### Community 112 - "vitest"
Cohesion: 0.33
Nodes (4): isAllowedOrigin(), nextConfig, securityHeaders, vitest

### Community 128 - "experience-manager.tsx"
Cohesion: 0.28
Nodes (7): AdminExperiencePage(), dynamic, metadata, ExperienceManager(), ExperienceManagerProps, types_index_experiencedocument, ExperienceDocument

### Community 129 - "actions.ts"
Cohesion: 0.22
Nodes (6): ActionFailure, ActionResult, ActionSuccess, PaginatedResult, PaginationParams, types_index_actionresult

### Community 130 - "resend.ts"
Cohesion: 0.31
Nodes (4): IEmailService, emailService, escapeHtml(), ResendEmailService

### Community 131 - "server.ts"
Cohesion: 0.25
Nodes (3): createAdminClient(), ref_next_headers, @supabase/ssr

### Community 134 - "achievements-manager.tsx"
Cohesion: 0.67
Nodes (3): AchievementsManagerProps, types_index_achievementdocument, AchievementDocument

### Community 135 - "media-manager.tsx"
Cohesion: 0.67
Nodes (3): MediaManagerProps, types_index_mediametadatadocument, MediaMetadataDocument

### Community 136 - "skills-manager.tsx"
Cohesion: 0.67
Nodes (3): CATEGORIES, SkillsManagerProps, SkillDocument

### Community 137 - "getAdminContactSettings"
Cohesion: 0.67
Nodes (3): mapContactSettingsFromDb(), getAdminContactSettings(), getPublishedContactSettings()

## Knowledge Gaps
- **818 isolated node(s):** `metadata`, `metadata`, `metadata`, `metadata`, `metadata` (+813 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 943 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `experience-manager.tsx`, `package.json`, `[slug]/page.tsx`, `cn`, `admin-shell.tsx`, `projects-manager.tsx`, `achievements-manager.tsx`, `media-manager.tsx`, `useToast`, `empty-state.tsx`, `skills-manager.tsx`, `types/models.ts`, `(public)/page.tsx`, `store.ts`, `design-system/page.tsx`, `error-boundary-view.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `requireAdminSession()` connect `requireAdminSession` to `experience-manager.tsx`, `resume/upload/route.ts`, `getSupabaseAdmin`, `supabase-adapter.ts`, `validations/models.ts`, `ref_next_server`, `achievements/[id]/route.ts`, `experience/[id]/route.ts`, `metrics/[id]/route.ts`, `skills/route.ts`, `session.ts`, `db.ts`, `messages/route.ts`, `projects-manager.tsx`, `media/route.ts`, `resume/route.ts`, `about/route.ts`, `hero/route.ts`, `profile/route.ts`, `seo/route.ts`, `site-content/route.ts`, `activity/route.ts`, `vitest`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `server-only` connect `db.ts` to `actions.ts`, `resend.ts`, `content.ts`, `services/index.ts`, `server.ts`, `resume/upload/route.ts`, `contact/route.ts`, `package.json`, `supabase-adapter.ts`, `store.ts`, `admin.ts`, `rate-limit.ts`, `session.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _818 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DEVELOPMENT_RULES.md` be split into smaller, more focused modules?**
  _Cohesion score 0.02564102564102564 - nodes in this community are weakly interconnected._
- **Should `SECURITY.md` be split into smaller, more focused modules?**
  _Cohesion score 0.029411764705882353 - nodes in this community are weakly interconnected._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1494949494949495 - nodes in this community are weakly interconnected._