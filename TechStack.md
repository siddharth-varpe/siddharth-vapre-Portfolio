# Technical Stack Specification

## Personal Portfolio — Siddharth Varpe

**Document:** TechStack.md  
**Version:** 1.0  
**Status:** Approved  
**Architecture:** Full-Stack Next.js Application  
**Deployment:** Vercel  
**Database:** Supabase PostgreSQL (Approved Architecture — Migration Underway; Cloud Firestore
                    │
                    ▼
              contactMessages` — Inbound contact inquiries (persisted before email delivery).
- `siteSettings` — Global site copyright, branding, and status.
- `seo` — Meta titles, descriptions, and OpenGraph tags.
- `media` — Metadata index for Cloud Storage uploads.
- `revisions` — Audit snapshots of CMS modifications.
- `activityLogs` — Security and administrative event records.

## Application Connection

The application connects strictly through the centralized server-side Firebase Admin SDK module (`lib/firebase/admin.ts`) using service credentials or Google Application Default Credentials.

Privileged service credentials never reach the browser.

## Architectural Flow

```text
Visitor / Admin
      ↓
Next.js Server Runtime (App Hosting)
      ↓
Firebase Admin SDK
      ↓
Cloud Firestore (Multi-Region)
```

---

# 14. Firebase Admin SDK & Server Repositories

The server-side integration layer provides type-safe access to Cloud Firestore through modular repositories (`lib/server/db/repositories/content.ts` and `lib/server/db/repositories/admin.ts`) with domain mappers (`lib/server/db/mappers.ts`).

Responsibilities:

- Connection singleton lifecycle.
- Firestore queries with composite indexes.
- Batch mutations and atomic operations.
- Input validation and type casting without `any` types.
- Soft-delete and archive workflows.
- Automatic revision snapshots and activity logging.

---

# 15. Firestore Collections & Access Patterns

Firestore collections use deterministic paths and stable identifiers:

```text
profiles (doc: "profile_root")
hero (doc: "hero_root")
about (doc: "about_root")
skills (docs: UUID / deterministic IDs, sorted by order)
experience (docs: UUID, sorted by order)
projects (docs: UUID, unique field: slug)
achievements (docs: UUID, sorted by order)
certifications (docs: UUID, sorted by order)
metrics (docs: UUID, sorted by order)
contactSettings (doc: "contact_settings_root")
contactMessages (docs: "msg_*", indexed by createdAt)
siteSettings (doc: "site_content_root")
seo (doc: "seo_root")
media (docs: "media_*", indexed by createdAt)
revisions (docs: "rev_*", indexed by timestamp)
activityLogs (docs: "act_*", indexed by timestamp)
```

## Required properties

Dynamic content documents enforce:

- Stable document IDs.
- Slugs where applicable.
- Publication status (`status: "published" | "draft" | "archived"`).
- Visibility toggles.
- Display order integers.
- Created and updated Firestore Timestamps.

---

# 16. Validation — Zod

Zod will validate untrusted input.

Use Zod for:

- Contact forms.
- Admin forms.
- CMS mutations.
- Query parameters where needed.
- API inputs.
- File metadata.
- Environment configuration where practical.

Validation must occur server-side even if client-side validation also exists.

Client-side validation improves UX.

Server-side validation provides security and integrity.

---

# 17. Forms — React Hook Form

React Hook Form will manage complex interactive forms.

Primary use:

- Contact form.
- Admin CMS forms.
- Project editor.
- Skills editor.
- Experience editor.
- Certification editor.
- Achievement editor.
- SEO editor.
- Profile editor.

Pair React Hook Form with Zod schemas.

---

# 18. Authentication — Firebase Authentication

Firebase Authentication is the authoritative identity provider for administrative access. Better Auth has been completely removed.

Primary purpose:

- Admin login with email/password.
- Server-verified session management using `__session` cookies.
- Custom claims authorization (`admin: true`).
- Secure administrative password updates.
- Protected admin route guard and API middleware.

## Admin Authorization Architecture

```text
Admin Login (/admin/login)
      ↓
Firebase Authentication (ID Token)
      ↓
Token Exchange API (/api/auth/session)
      ↓
Verify ID Token & Ensure Admin Custom Claim
      ↓
Create Firebase Session Cookie (HttpOnly, Secure, SameSite=Lax, Name: "__session")
      ↓
Protected Admin Panel (/admin/*)
```

A user is NEVER granted admin privileges merely by being authenticated. The `admin: true` custom claim must be present and verified server-side.

## Security

- Session cookies named `__session` (compatible with Firebase App Hosting and CDN cookie policies).
- Server-side verification via `adminAuth.verifySessionCookie(cookie, true)` with revocation check.
- Custom claims verified on all administrative mutations.
- Passwords managed entirely by Firebase Authentication; never stored in Firestore.
- Password updates protected by session verification and minimum length validation.

---

# 19. Email — Resend

Resend will provide contact notification email delivery.

## Contact flow

```text
Contact Form
      ↓
Server Validation
      ↓
MongoDB Storage
      ↓
Resend Email
      ↓
Admin Notification
```

MongoDB storage happens before email delivery is attempted.

If Resend fails:

```text
MongoDB: SUCCESS
Email: FAILED
```

The message remains available in the admin Messages page.

## Environment

```env
RESEND_API_KEY=
CONTACT_EMAIL=
```

The API key must remain server-side.

The production sending domain must be verified.

---

# 20. Anti-Spam — Cloudflare Turnstile

Turnstile will protect the public contact form.

## Required flow

```text
Visitor
   ↓
Turnstile Widget
   ↓
Verification Token
   ↓
Next.js Server
   ↓
Cloudflare Siteverify
   ↓
Accept / Reject
```

The server must validate the Turnstile token.

Client-side verification alone is insufficient.

## Environment

```env
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Only the site key may be exposed to the browser.

The secret key must remain server-side.

---

# 21. File Storage — Cloud Storage for Firebase

Cloud Storage for Firebase is the media storage infrastructure for all persistent portfolio binary files. Vercel Blob has been completely removed.

Use for:

- Profile photos (`/portfolio/profile/`).
- Project screenshots & diagrams (`/portfolio/projects/`).
- Verified resume PDFs (`/portfolio/resume/`).
- Approved CMS media assets (`/portfolio/media/`).

## Security Rules & Validation

Storage security rules (`storage.rules`) enforce:
- Path restrictions: uploads permitted only into defined `/portfolio/{category}/*` directories.
- MIME validation: images restricted to `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`; resumes restricted to `application/pdf`.
- Size limits: images < 10MB; documents < 15MB.
- Admin authorization: write and delete operations strictly require `request.auth.token.admin == true`.
- Metadata tracking: file ID, path, size, MIME type, and category indexed in Firestore `media` collection.

---

# 22. Images — Next/Image

Use Next/Image for public raster image optimization.

Requirements:

- Responsive image sizing.
- Appropriate image dimensions.
- Lazy loading for non-critical images.
- Priority loading only for genuinely critical images.
- Modern image formats where supported.
- Proper alt text.
- Avoid unnecessarily large source images.

The professional photo should use the original user-provided photograph.

Do not regenerate or alter facial identity.

---

# 23. Deployment — Firebase App Hosting

Firebase App Hosting is the production hosting platform for the full-stack Next.js application.

Configured via `apphosting.yaml`:
- Full-stack dynamic Next.js runtime with Server-Side Rendering (SSR) and route handlers.
- Automated GitHub integration with branch-based rollouts.
- Server external packages optimization for `firebase-admin`.
- Environment secrets integrated with Google Cloud Secret Manager.
- High-availability containerized serving with autoscaling.

---

# 24. Version Control — Git + GitHub

Git will manage source history.

GitHub will host the repository.

Requirements:

- Meaningful commits.
- Feature branches where appropriate.
- No committed secrets.
- `.env*` files excluded appropriately.
- Pull-request workflow where useful.
- Production branch protection where appropriate.

---

# 25. Analytics — Vercel Analytics

Vercel Analytics will provide high-level site usage insights.

Potential measurements:

- Page views.
- Project page engagement.
- Resume interactions.
- Contact CTA interactions.
- General navigation behavior.

Analytics should remain privacy-conscious and should not compromise user trust.

---

# 26. Performance Monitoring — Vercel Speed Insights

Speed Insights will monitor real-user performance.

Monitor:

- LCP.
- INP.
- CLS.
- Other available performance indicators.

Performance should be evaluated on real production devices and networks, not only a high-end development machine.

---

# 27. Unit / Integration Testing — Vitest

Vitest will test:

- Utility functions.
- Validation schemas.
- Data transformations.
- Critical server-side logic.
- Content transformation.
- Security-sensitive helpers where practical.

Focus testing effort on behavior that can break the product rather than achieving arbitrary coverage percentages.

---

# 28. End-to-End Testing — Playwright

Playwright will test critical browser flows.

Minimum flows:

### Public

- Homepage loads.
- Navigation works.
- Project pages work.
- Resume link works.
- Contact form works.

### Admin

- Login.
- Unauthorized access rejection.
- Dashboard.
- Content CRUD.
- Publishing.
- Message inbox.
- Message status changes.
- Resume/media management.

### Security

- Invalid credentials rejected.
- Protected routes reject unauthenticated users.
- Invalid form data rejected.
- Turnstile failure rejected.
- Unauthorized mutations rejected.

---

# 29. Environment Configuration

Expected environment variables:

```env
# Database
MONGODB_URI=

# Authentication
BETTER_AUTH_SECRET=

# Email
RESEND_API_KEY=
CONTACT_EMAIL=

# Cloudflare Turnstile
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Storage
BLOB_READ_WRITE_TOKEN=

# Application
NEXT_PUBLIC_SITE_URL=
```

## Environment variable rules

- Never commit production secrets.
- Never expose secrets through `NEXT_PUBLIC_*`.
- Only values explicitly intended for browser use may use `NEXT_PUBLIC_*`.
- Validate required environment variables during startup/build where practical.
- Use separate development/preview/production values.

---

# 30. Application Architecture

High-level architecture:

```text
                           USER
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
             PUBLIC SITE           ADMIN CMS
                 │                     │
                 └──────────┬──────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   Next.js   │
                     │ TypeScript  │
                     └──────┬──────┘
                            │
                    Server-side layer
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    Cloud Firestore      Resend / Email      Cloud Storage
    Content + CMS        Email Delivery      Media & Assets
          │
          │
          ▼
    Persistent data
```

Contact-specific flow:

```text
Visitor
   │
   ▼
Contact Form
   │
   ▼
Turnstile
   │
   ▼
Next.js Server
   │
   ├──────────────► Cloud Firestore
   │                    │
   │                    ▼
   │              contactMessages
   │
   └──────────────► Resend
                        │
                        ▼
                  Siddharth's email
```

---

# 31. Data Access Architecture

Public content should be read through a server-side content/data layer.

Recommended conceptual structure:

```text
app/
components/
lib/
  db/
  auth/
  validation/
  email/
  storage/
  security/
  content/
```

The exact folder structure may evolve.

The important architectural rule is separation between:

- UI.
- Domain/content logic.
- Database access.
- Authentication.
- External services.
- Validation.

---

# 32. Rendering Strategy

Use the appropriate rendering mode for each page.

## Prefer static/cached rendering for:

- About.
- Skills.
- Certifications.
- Achievements.
- Project content that does not change frequently.

## Prefer dynamic/server rendering for:

- Admin pages.
- Contact inbox.
- Highly current dashboard information.
- Content requiring immediate database state.

## Revalidation

When admin content is published or updated, the public site should invalidate/revalidate affected pages rather than requiring a full application redeployment.

---

# 33. Security Architecture

Security boundaries:

```text
PUBLIC
  │
  ├── Read published content
  └── Submit validated contact form
          │
          ▼
     Server Validation
          │
          ▼
     MongoDB / Resend

PRIVATE
  │
  ▼
Authentication
  │
  ▼
Authorization
  │
  ▼
Admin Server Actions / Routes
  │
  ▼
MongoDB / Blob / Resend
```

Never trust:

- Client-side roles.
- Client-provided ownership.
- Client-provided authorization state.
- Unsanitized HTML.
- Unsanitized external URLs.
- Client-side Turnstile status.

---

# 34. Performance Architecture

Performance strategy:

```text
Fast initial HTML
      +
Server Components
      +
Optimized images
      +
Lazy heavy assets
      +
Progressive 3D
      +
Minimal client JavaScript
      +
Cached public content
      +
Real-world monitoring
```

3D should be progressively loaded rather than making the entire homepage wait for a heavy scene.

---

# 35. Accessibility Architecture

Accessibility must be considered at the component/system level.

Requirements:

- Semantic HTML.
- Keyboard access.
- Focus management.
- Accessible forms.
- Proper labels.
- ARIA only where necessary.
- Color contrast.
- Reduced motion.
- Screen-reader-friendly navigation.
- Touch-friendly controls.

The admin system should use accessible UI primitives where possible.

---

# 36. SEO Architecture

Next.js metadata capabilities will manage:

- Page titles.
- Meta descriptions.
- Canonical URLs.
- Open Graph.
- Twitter/social metadata where applicable.
- Robots metadata.

Structured data should be added for relevant entities such as:

- Person/Profile.
- Projects where appropriate.
- Website identity.

SEO content should remain editable where practical through the CMS.

---

# 37. Why This Stack

This stack is intentionally optimized for the project rather than maximizing the number of technologies.

### Next.js + TypeScript
Provides one language across frontend and backend while supporting SEO, server rendering, API/server functionality, and Vercel deployment.

### Cloud Firestore
Provides durable, multi-region NoSQL document persistence with expressive queries, composite indexes, and production-grade security rules.

### Firebase Authentication
Provides hardened identity management, password hashing, and custom claim authorization without self-hosting auth tables or passwords.

### Cloud Storage for Firebase
Provides scalable, secure object storage for media and documents governed by granular storage security rules.

### Firebase App Hosting
Provides serverless, containerized Next.js full-stack hosting with native support for SSR, API routes, and automated rollouts.

### Resend
Provides a focused transactional email layer for contact notifications.

### Three.js + React Three Fiber
Provides the custom 3D capability required by the visual direction without introducing a separate rendering stack.

### Zod + React Hook Form
Provides a clean combination for strongly validated interactive forms.

### Vitest + Playwright
Provides both code-level and browser-level confidence.

---

# 38. Explicitly Rejected / Avoided Technologies

The following should not be added without a concrete requirement:

## Python / FastAPI

Not required for this portfolio.

Reason:

- Adds another runtime/language.
- Adds deployment complexity.
- Duplicates backend capabilities already available through Next.js.
- Provides little benefit for the current requirements.

Python remains valuable in Siddharth's other software/AI projects, but this portfolio does not need it.

## MongoDB Atlas
Completely removed from the application runtime and architecture.

## Supabase PostgreSQL
Completely removed from the application runtime and architecture. Cloud Firestore is the sole database.

## Better Auth
Completely removed. Firebase Authentication is the identity and session provider.

## Vercel Blob
Completely removed. Cloud Storage for Firebase handles all media storage.

## Redis

Not required initially.

A Redis-based service may be introduced later if rate limiting, caching, queues, or other scale requirements justify it.

## Docker

Not required for the initial Vercel deployment.

## GraphQL

Not required.

REST/server actions are sufficient.

## Redux

Not required initially.

Prefer local component state, server state, URL state, and focused state-management patterns before introducing a global store.

---

# 39. Technology Addition Rule

Any new dependency must answer at least one of these questions:

1. Does it solve a requirement already defined in the PRD?
2. Does it materially improve security?
3. Does it materially improve performance?
4. Does it materially improve maintainability?
5. Does it materially improve the user experience?

If not, do not add it.

The goal is a **small, intentional production stack**, not a technology showcase.

---

# 40. Final Stack Summary

```text
Frontend
├── Next.js
├── React
├── TypeScript
├── Tailwind CSS
├── shadcn/ui
├── Lucide React
├── Motion
└── Next/Image

3D
├── Three.js
├── React Three Fiber
└── @react-three/drei

Backend / Server
├── Next.js Server
├── TypeScript
├── Better Auth
├── Zod
└── React Hook Form

Database
├── Cloud Firestore
├── firebase-admin/firestore
└── @google-cloud/firestore

Storage & Media
├── Cloud Storage for Firebase
└── @google-cloud/storage

Authentication
├── Firebase Authentication
└── firebase-admin/auth

External Services
├── Resend (Transactional Email)
├── Cloudflare Turnstile (Anti-Spam)
└── Firebase App Check (Abuse Protection)

Deployment & Hosting
├── Firebase App Hosting (Dynamic Next.js SSR)
└── apphosting.yaml

Development
├── Git
├── GitHub
├── Vitest
└── Playwright
```

---

# 41. Final Architectural Decision

**The portfolio is built as a TypeScript-first, Next.js full-stack application hosted on Firebase App Hosting, with Cloud Firestore as the sole persistent database, Firebase Authentication with session cookies and custom claims for admin authorization, Cloud Storage for Firebase for media, Resend for email delivery, and Cloudflare Turnstile + Firebase App Check for comprehensive abuse protection.**

No additional backend language or database will be introduced unless a future requirement demonstrates a real need.
