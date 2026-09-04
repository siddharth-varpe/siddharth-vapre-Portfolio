# DEVELOPMENT_PHASES.md

# Siddharth Varpe Portfolio — Complete Development Plan

**Project:** Premium Personal Portfolio  
**Positioning:** Software Engineer | AI & Full-Stack  
**Deployment:** Vercel  
**Architecture:** Next.js + TypeScript + MongoDB Atlas + approved services  
**Development Model:** Phase-gated implementation

---

# 0. PURPOSE OF THIS DOCUMENT

This document converts the complete portfolio development plan into controlled implementation phases.

Antigravity MUST develop the project **phase by phase**.

The purpose is to prevent:

- random implementation
- feature creep
- premature styling
- architecture drift
- security regressions
- incomplete dependencies
- duplicated work
- large untestable changes
- building later features on unstable foundations

## Core Rule

> **Do not start the next phase until the current phase passes its acceptance criteria.**

If a later phase depends on information that has not yet been provided by the user, stop at that dependency and request the required information.

---

# 1. SOURCE-OF-TRUTH HIERARCHY

Before every phase, Antigravity MUST consider:

1. `PRD.md` — product requirements
2. `TechStack.md` — approved technology stack
3. `SECURITY.md` — mandatory security requirements
4. `DEVELOPMENT_RULES.md` — engineering rules
5. `DEVELOPMENT_PHASES.md` — execution order

These documents are complementary.

If there is a conflict:

**Security requirement > explicit user requirement > PRD > TechStack > Development Rules > implementation convenience**

Never weaken security to satisfy implementation convenience.

---

# 2. PHASE GATES

Every phase has five checkpoints:

### A. Build
The approved scope is implemented.

### B. Functional Test
The functionality works as intended.

### C. Security Review
Applicable `SECURITY.md` controls are verified.

### D. Quality Review
Responsive, accessibility, performance, and code quality are checked.

### E. Phase Approval
The phase is considered complete only when its acceptance criteria are satisfied.

---

# 3. GLOBAL DEVELOPMENT SEQUENCE

```text
PHASE 0  — Project Initialization
        ↓
PHASE 1  — Architecture & Foundation
        ↓
PHASE 2  — Design System & Visual Foundation
        ↓
PHASE 3  — Database & Content Architecture
        ↓
PHASE 4  — Authentication & Admin Security
        ↓
PHASE 5  — Admin CMS
        ↓
PHASE 6  — Media & Resume Management
        ↓
PHASE 7  — Public Site Shell
        ↓
PHASE 8  — Home & Core Public Pages
        ↓
PHASE 9  — Projects & Case Studies
        ↓
PHASE 10 — Contact System
        ↓
PHASE 11 — 3D, Motion & Premium Interactions
        ↓
PHASE 12 — SEO, Analytics & Discoverability
        ↓
PHASE 13 — Testing & Security Hardening
        ↓
PHASE 14 — Performance & Accessibility Optimization
        ↓
PHASE 15 — Production Deployment
        ↓
PHASE 16 — Production Verification
        ↓
PHASE 17 — Documentation & Handover
```

---

# PHASE 0 — PROJECT INITIALIZATION

## Objective

Create a clean project workspace and establish the repository rules before application development begins.

## Tasks

- initialize Git repository if required
- initialize Next.js application
- configure TypeScript
- configure Tailwind CSS
- establish source directory structure
- establish environment-variable strategy
- create `.env.example`
- configure ESLint/formatting according to project tooling
- add approved base dependencies only
- add project documentation files:
  - `PRD.md`
  - `TechStack.md`
  - `SECURITY.md`
  - `DEVELOPMENT_RULES.md`
  - `DEVELOPMENT_PHASES.md`

## Rules

Do not build pages yet.

Do not add unapproved dependencies.

Do not introduce a second backend.

## Acceptance Criteria

- application starts locally
- TypeScript compiles
- linting/build pipeline works
- Git structure is clean
- no secrets committed
- approved documentation exists

---

# PHASE 1 — ARCHITECTURE & APPLICATION FOUNDATION

## Objective

Build the technical skeleton on which all future features will depend.

## Tasks

Establish:

- Next.js App Router structure
- public route structure
- admin route structure
- server-side application boundaries
- reusable layout architecture
- error boundaries
- loading states
- not-found handling
- environment configuration
- server/client component boundaries
- database connection abstraction
- service-layer conventions
- validation conventions
- API/server-action conventions

## Initial route structure

```text
/
 /about
 /experience
 /projects
 /projects/[slug]
 /skills
 /achievements
 /certifications
 /contact

 /admin/login
 /admin
 /admin/profile
 /admin/hero
 /admin/about
 /admin/skills
 /admin/experience
 /admin/projects
 /admin/achievements
 /admin/certifications
 /admin/metrics
 /admin/contact
 /admin/resume
 /admin/media
 /admin/seo
 /admin/site-content
 /admin/revisions
 /admin/activity
 /admin/security
 /admin/messages
```

Routes may be implemented incrementally; do not create fake unfinished pages merely to populate the directory.

## Acceptance Criteria

- clean routing foundation
- clear server/client boundaries
- application builds
- no duplicated architecture
- no security-sensitive data exposed to client components

---

# PHASE 2 — DESIGN SYSTEM & VISUAL FOUNDATION

## Objective

Create the visual language before building individual pages.

## Visual Direction

**Dark Systems / Technical Editorial**

Core:

- near-black / graphite
- warm off-white
- controlled electric blue
- fine technical grid
- restrained borders
- atmospheric lighting
- editorial typography
- purposeful system-oriented 3D
- premium engineering aesthetic

## Tasks

Create reusable design primitives for:

- typography
- spacing
- layout containers
- buttons
- links
- cards
- badges
- metadata
- metrics
- section headers
- navigation
- form controls
- status indicators
- admin UI primitives

## Responsive Strategy

Mobile-first.

Test early at:

- small mobile
- standard mobile
- tablet
- laptop
- desktop
- large desktop

## Acceptance Criteria

- visual tokens are centralized
- public and admin visual systems are coherent
- mobile layout foundation works
- accessibility primitives are established
- no random visual effects

---

# PHASE 3 — DATABASE & CONTENT ARCHITECTURE

## Objective

Establish MongoDB Atlas as the source of truth for dynamic portfolio content.

## Technology

- MongoDB Atlas
- MongoDB Node.js Driver
- Zod

## Core content domains

Design schemas for the approved CMS content:

- profile
- hero
- about
- skills
- experience
- projects
- achievements
- certifications
- metrics
- contact/social settings
- resume metadata
- SEO
- site content
- revisions
- activity logs
- contact messages
- media metadata

## Rules

- server-side database access only
- validate all external input
- explicit writable fields
- appropriate indexes
- pagination for collections where required
- no arbitrary MongoDB query objects from clients

## Acceptance Criteria

- MongoDB connection works securely
- schemas/data contracts are defined
- indexes are planned/created where needed
- public content can distinguish published/private data
- no database credentials reach the browser

---

# PHASE 4 — AUTHENTICATION & ADMIN SECURITY

## Objective

Secure the administrative system before building sensitive CMS functionality.

## Technology

**Better Auth**

## Tasks

Implement:

- admin authentication
- secure password handling
- secure sessions
- HTTP-only cookies
- authorization checks
- protected admin routes
- protected admin mutations
- session expiration strategy
- failed-login handling
- account/security foundation
- logout
- password-change capability

## Bootstrap Credentials

Temporary development/bootstrap credentials:

```text
admin / admin
```

These must never be treated as permanent production credentials.

## Security Review

Explicitly test relevant `SECURITY.md` controls:

- weak session management
- password handling
- default credentials
- authorization
- IDOR/BOLA
- exposed secrets
- CSRF
- rate limits
- logs

## Acceptance Criteria

- unauthenticated users cannot access admin functionality
- authorization is enforced server-side
- passwords are never stored plaintext
- secrets are not client-visible
- failed authentication is handled safely
- admin session behavior is secure

**This phase is a hard gate. Do not build the complete CMS before this phase passes.**

---

# PHASE 5 — ADMIN CMS

## Objective

Build the private content management system.

## Admin Areas

Implement the approved CMS areas:

1. Dashboard
2. Profile
3. Hero
4. About
5. Skills
6. Experience
7. Projects
8. Achievements
9. Certifications
10. Metrics
11. Contact & Socials
12. Resume
13. Media Library
14. SEO
15. Site Content
16. Revisions
17. Activity Log
18. Account & Security
19. Contact Messages

## CMS Requirements

CRUD must be implemented only where appropriate.

Support:

- create
- edit
- reorder
- publish
- archive
- restore where approved
- delete where approved
- visibility
- draft/published/archived states where defined

## Important

The CMS must manage content.

It must NOT execute arbitrary:

- JavaScript
- HTML
- SQL/MongoDB queries
- shell commands
- CSS
- server code

## Acceptance Criteria

- admin can manage approved dynamic content
- changes persist in MongoDB
- public content can consume published data
- draft content remains private
- destructive operations are deliberate
- revisions/activity records work where required
- all mutations are authenticated and authorized

---

# PHASE 6 — MEDIA & RESUME MANAGEMENT

## Objective

Implement secure portfolio asset management.

## Technology

**Vercel Blob**

## Media Types

Potential approved assets include:

- professional photo
- project screenshots
- project media
- certification images
- achievement images
- resume

## Security

Follow `SECURITY.md` for:

- MIME validation
- extension validation
- size limits
- safe filenames
- authorization
- path traversal prevention
- replacement/deletion
- metadata validation

## Professional Photo Dependency

The user's real professional photo must be supplied before portrait-dependent implementation is finalized.

Do not generate a replacement identity.

## Acceptance Criteria

- uploads work securely
- assets persist correctly
- unauthorized users cannot manage media
- invalid uploads are rejected
- media can be associated with approved content
- resume can be replaced/set active

---

# PHASE 7 — PUBLIC SITE SHELL

## Objective

Build the public-facing application structure.

## Public Navigation

```text
Home
About
Experience
Projects
Skills
Achievements
Certifications
Contact
```

## Tasks

Implement:

- global navigation
- mobile navigation
- footer
- responsive container system
- page transitions where appropriate
- shared section primitives
- global metadata foundation
- loading/error/not-found states

## Rules

Home is an overview, not a complete copy of every page.

Do not duplicate all project details on the homepage.

## Acceptance Criteria

- navigation works
- mobile navigation works
- every approved public section has a clear route
- layout is responsive
- public pages consume approved content architecture

---

# PHASE 8 — HOME & CORE PUBLIC PAGES

## Objective

Build the primary portfolio experience.

## Home

The homepage should communicate quickly:

- who Siddharth is
- what he builds
- software engineering + AI/full-stack positioning
- measurable impact
- selected projects
- credibility
- clear contact/work CTA

## Approved Hero Direction

Use the established visual concept:

- SOFTWARE ENGINEER
- Siddharth Varpe
- "Building Real Solutions with Code, AI and Impact."
- supporting description
- View My Work
- Download Resume
- professional photo
- purposeful 3D/system visual
- impact metrics

## Other Pages

Build:

### About
Professional background, philosophy, interests and engineering mindset.

### Experience
Internship/work experience with measurable impact.

### Skills
Dynamic skills grouped logically.

### Achievements
Verified achievements.

### Certifications
Certification details and evidence.

## Rules

Do not invent content.

## Acceptance Criteria

- content matches approved resume information
- CMS changes appear correctly
- mobile-first layouts work
- CTAs work
- no fake metrics/content

---

# PHASE 9 — PROJECTS & CASE STUDIES

## Objective

Create the strongest proof-of-work portion of the portfolio.

## Projects

Approved initial projects:

1. CRM — SR Enterprises
2. Inventory Management Platform
3. Campus Buddy
4. Portfolio Website

## Project Page Structure

Each project should support:

```text
Overview
↓
Problem
↓
Objective
↓
Role
↓
Solution
↓
Architecture / System
↓
Implementation
↓
Engineering Decisions
↓
Challenges
↓
Impact / Metrics
↓
Screenshots
↓
Technology Stack
↓
GitHub / Live Demo
```

Not every section needs to appear when information is unavailable.

## Important

Never invent architecture details.

Never invent project capabilities.

Never invent links.

Known Campus Buddy links are:

```text
GitHub:
https://github.com/siddharth-varpe/collegestudentbuddy-campusbuddy

Demo:
https://collegestudentbuddy-campusbuddy-dzg.vercel.app/
```

CRM and Inventory GitHub/demo links require explicit confirmation before publication.

## Acceptance Criteria

- projects are data-driven
- each project has its own route
- screenshots are authentic
- metrics are approved
- links are verified
- case studies are readable on mobile

---

# PHASE 10 — CONTACT SYSTEM

## Objective

Build a reliable contact pipeline that genuinely reaches the user.

## Approved Architecture

```text
Visitor
 ↓
Contact Form
 ↓
Zod Validation
 ↓
Cloudflare Turnstile
 ↓
Server-side Turnstile Verification
 ↓
MongoDB Atlas
 ↓
Resend
 ↓
User Email
```

## Reliability Rule

**MongoDB persistence happens before email notification.**

If Resend fails:

- message remains stored
- delivery status is recorded
- admin can still see the message
- message is not lost

## Admin Messages

Implement:

- inbox/list
- unread/read state
- archive state
- message details
- timestamp
- sender information
- delivery status
- appropriate reply workflow
- approved deletion behavior

## Security

Test:

- XSS
- CSRF
- rate limits
- spam
- Turnstile validation
- input validation
- request size
- abuse
- sensitive logging

## Acceptance Criteria

A real production-style test submission must:

1. reach MongoDB
2. appear in Admin Messages
3. trigger Resend notification
4. reach the configured recipient
5. preserve the message if email fails

---

# PHASE 11 — 3D, MOTION & PREMIUM INTERACTIONS

## Objective

Add the distinctive visual engineering layer only after the functional site is stable.

## Technology

- Three.js
- React Three Fiber
- drei
- Motion

## 3D Concept

Use an original **system/infrastructure sculpture** concept.

It should communicate:

- systems
- connections
- software
- data
- architecture
- engineering

## Rules

3D must be:

- purposeful
- lightweight
- progressively loaded
- mobile-aware
- accessible through fallback
- compatible with reduced motion
- isolated so failure cannot break the page

## Motion

Use animation for:

- hierarchy
- page transitions
- interactions
- system storytelling
- feedback

Avoid animation overload.

## Acceptance Criteria

- 3D does not block page usability
- mobile performance remains acceptable
- reduced motion is respected
- 3D failure has a fallback
- animation is purposeful

---

# PHASE 12 — SEO, ANALYTICS & DISCOVERABILITY

## Objective

Make the portfolio discoverable and measurable without adding unnecessary services.

## SEO

Implement:

- page titles
- meta descriptions
- canonical URLs where appropriate
- Open Graph metadata
- semantic structure
- sitemap
- robots configuration
- structured data where useful
- personal profile/Person metadata where appropriate

## Analytics

Use approved:

- Vercel Analytics
- Vercel Speed Insights

Do not add another analytics provider without approval.

## Acceptance Criteria

- all important public pages have intentional metadata
- social previews work
- indexing behavior is deliberate
- analytics work without exposing sensitive information

---

# PHASE 13 — TESTING & SECURITY HARDENING

## Objective

Perform systematic application-wide validation.

## Testing Stack

- Vitest
- Playwright

## Functional Testing

Test:

- navigation
- forms
- CMS CRUD
- publishing
- drafts
- project pages
- contact flow
- authentication
- media
- resume
- messages

## Security Testing

Review every applicable item from `SECURITY.md`, including:

```text
XSS
CSRF
Insecure file uploads
Path traversal
SSRF
Broken password reset
Weak session management
JWT secrets
Permissive CORS
Rate limits
Exposed environments
Default credentials
Unsigned webhooks
Frontend payment checks
IDOR / BOLA
APIs + user input
Exposed logs
Exposed source maps
```

Also verify:

- authentication
- authorization
- secret handling
- database access
- privacy
- caching
- dependency security
- security headers
- CSP where appropriate

## Acceptance Criteria

- critical security issues resolved
- protected resources verified
- attack surfaces reviewed
- automated tests cover important flows
- no known high-severity security regression

---

# PHASE 14 — PERFORMANCE & ACCESSIBILITY OPTIMIZATION

## Objective

Optimize the finished product without changing its visual identity or weakening security.

## Performance

Review:

- Core Web Vitals
- LCP
- INP
- CLS
- JavaScript bundle size
- image size
- font loading
- 3D rendering cost
- database query efficiency
- caching
- unnecessary client components
- unnecessary network requests

## Accessibility

Review:

- keyboard navigation
- focus visibility
- headings
- labels
- contrast
- touch target sizes
- reduced motion
- alt text
- screen-reader behavior
- form errors
- semantic HTML

## Acceptance Criteria

- no obvious performance regressions
- mobile remains fast and usable
- accessibility issues are resolved where practical
- security controls remain intact

---

# PHASE 15 — PRODUCTION DEPLOYMENT

## Objective

Deploy the portfolio to Vercel.

## Pre-deployment Checklist

### Environment

Configure production values for:

```text
MONGODB_URI
BETTER_AUTH_SECRET
RESEND_API_KEY
CONTACT_EMAIL
TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
BLOB_READ_WRITE_TOKEN
NEXT_PUBLIC_SITE_URL
```

Only intentionally public values may use `NEXT_PUBLIC_`.

## Infrastructure

Verify:

- MongoDB Atlas connectivity
- Vercel environment variables
- Resend verified domain
- Turnstile production configuration
- Vercel Blob
- domain
- HTTPS
- production build

## Acceptance Criteria

- production deployment succeeds
- no secrets exposed
- database works
- authentication works
- contact flow works
- email works
- media works

---

# PHASE 16 — PRODUCTION VERIFICATION

## Objective

Treat production as a separate test environment.

Do not assume:

> "It worked locally, therefore production works."

## Verify

### Public

- homepage
- navigation
- mobile layout
- projects
- case studies
- skills
- experience
- achievements
- certifications
- contact
- resume download

### Admin

- login
- logout
- CMS
- publishing
- messages
- media
- resume
- revisions
- activity log
- account security

### Contact

Perform an actual controlled test:

```text
Visitor submission
→ Turnstile
→ validation
→ MongoDB
→ Resend
→ email inbox
→ Admin Messages
```

### Security

Verify:

- unauthorized admin access
- direct protected-route access
- invalid form data
- invalid uploads
- rate limiting
- secret exposure
- public/private content separation

---

# PHASE 17 — DOCUMENTATION & HANDOVER

## Objective

Finish the project as a maintainable professional software system.

## Documentation

Ensure the repository contains accurate:

- `PRD.md`
- `TechStack.md`
- `SECURITY.md`
- `DEVELOPMENT_RULES.md`
- `DEVELOPMENT_PHASES.md`
- `.env.example`
- deployment instructions
- setup instructions where necessary

## Documentation Consistency

Check that documentation matches the actual implementation.

If the architecture changed legitimately:

- update TechStack
- update security documentation
- update development rules
- update PRD if product behavior changed
- update phase status

## Final Handover

Provide a concise record of:

- architecture
- environment variables
- deployment
- database
- email
- storage
- authentication
- admin access
- testing
- known limitations
- future approved opportunities

Do not document secrets.

---

# 4. CROSS-PHASE SECURITY RULE

Security is NOT isolated to Phase 13.

`SECURITY.md` must be applied during every phase.

Examples:

### Phase 1
Protect architecture boundaries.

### Phase 3
Protect database access.

### Phase 4
Secure authentication.

### Phase 5
Secure CMS authorization.

### Phase 6
Secure file uploads.

### Phase 8
Protect public/private content separation.

### Phase 9
Protect project/admin data.

### Phase 10
Protect contact input and email flow.

### Phase 11
Prevent unsafe browser-side behavior.

### Phase 12
Prevent sensitive data exposure through metadata/analytics.

### Phase 13
Perform comprehensive security review.

### Phase 15–16
Verify production security.

---

# 5. DEPENDENCY RULE

A phase must not start if a required previous dependency is incomplete.

Examples:

```text
Do not build CMS before database architecture.
Do not build sensitive CMS functionality before authentication.
Do not build public project pages before project data architecture.
Do not build contact email flow before server-side validation.
Do not add heavy 3D before the functional public site is stable.
Do not deploy before production security verification.
```

---

# 6. USER-PROVIDED ASSET DEPENDENCIES

Antigravity must stop and request missing real assets/information rather than fabricate them.

Examples:

- professional photograph
- CRM GitHub URL
- Inventory GitHub URL
- CRM live demo URL when available
- Inventory live demo URL when available
- missing project architecture details
- missing certification evidence
- missing achievement evidence
- any uncertain metric

---

# 7. CONTENT FREEZE RULE

Once a page has approved content, do not silently rewrite the user's professional claims.

Improvements to:

- grammar
- structure
- readability

may be proposed.

Do not change factual meaning without approval.

---

# 8. DESIGN FREEZE RULE

Once the core visual direction is approved, do not repeatedly redesign the interface during implementation.

If a component does not fit:

1. adapt the component
2. preserve the visual system
3. avoid redesigning the entire site

Major visual direction changes require approval.

---

# 9. NO PREMATURE POLISH

Do not spend significant development time polishing animations, shadows, 3D, or micro-interactions while core functionality is incomplete.

Priority:

```text
Correctness
→ Security
→ Data integrity
→ Functionality
→ Responsive layout
→ Accessibility
→ Performance
→ Visual polish
→ Micro-interactions
```

---

# 10. PHASE COMPLETION REPORT

At the end of each phase, Antigravity should be able to summarize:

```text
PHASE:
STATUS:

IMPLEMENTED:
- ...

SECURITY CHECKED:
- ...

TESTED:
- ...

KNOWN ISSUES:
- ...

USER INPUT REQUIRED:
- ...

NEXT PHASE:
- ...
```

Do not claim a phase is complete if critical work is unfinished.

---

# 11. FINAL DEFINITION OF COMPLETE

The project is complete only when:

```text
[ ] All approved public pages work
[ ] Admin CMS works
[ ] Authentication is secure
[ ] MongoDB persistence works
[ ] Contact messages persist
[ ] Contact emails reach the configured recipient
[ ] Turnstile is server-validated
[ ] Media uploads are secure
[ ] Resume management works
[ ] Project case studies work
[ ] Real project links are verified
[ ] Real professional photo is used
[ ] 3D works with fallback
[ ] Mobile experience is polished
[ ] Accessibility has been reviewed
[ ] Performance has been reviewed
[ ] SEO is configured
[ ] Analytics are configured
[ ] Security.md controls have been reviewed
[ ] Production deployment works
[ ] Production contact flow has been tested
[ ] Documentation matches implementation
[ ] No secrets are committed
[ ] No fake content or metrics exist
[ ] No unapproved features have been introduced
```

---

# 12. FINAL ANTIGRAVITY EXECUTION PRINCIPLE

Antigravity should treat this project as a **production software engineering project**, not as a one-shot website generation task.

The correct behavior is:

```text
UNDERSTAND
    ↓
PLAN
    ↓
IMPLEMENT ONE PHASE
    ↓
TEST
    ↓
SECURITY REVIEW
    ↓
QUALITY REVIEW
    ↓
PASS PHASE GATE
    ↓
MOVE TO NEXT PHASE
```

Never skip directly from:

```text
"Build portfolio"
```

to:

```text
"Generate entire application"
```

The application must be built incrementally so every layer is understood, tested, and secured before the next layer depends on it.

> **Build deliberately.**
>
> **Do not guess.**
>
> **Do not invent.**
>
> **Do not weaken security.**
>
> **Do not add unapproved features.**
>
> **Do not move forward with broken dependencies.**
>
> **Build exactly what the project requires, to production quality.**

---

# END OF DEVELOPMENT PHASES
