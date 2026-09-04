# Technical Stack Specification

## Personal Portfolio — Siddharth Varpe

**Document:** TechStack.md  
**Version:** 1.0  
**Status:** Approved  
**Architecture:** Full-Stack Next.js Application  
**Deployment:** Vercel  
**Database:** MongoDB Atlas  
**Primary Language:** TypeScript

---

# 1. Stack Philosophy

The portfolio should use a modern, production-oriented TypeScript stack with as few unnecessary technologies as possible.

The architecture must support:

- Premium custom frontend.
- Mobile-first responsive design.
- Purposeful 3D.
- Dynamic CMS-driven content.
- Secure private admin panel.
- Persistent contact messages.
- Reliable email notifications.
- Cloud media storage.
- Strong SEO.
- Accessibility.
- High performance.
- Automated testing.
- Straightforward Vercel deployment.

The portfolio will remain **TypeScript full-stack**.

Python/FastAPI will not be introduced into this project unless a future requirement genuinely justifies a separate service.

---

# 2. Core Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js | Full-stack web application |
| Language | TypeScript | Application language and type safety |
| UI Library | React | Component-based frontend |
| Styling | Tailwind CSS | Utility-based styling |
| Admin UI | shadcn/ui | Accessible productivity-oriented primitives |
| Icons | Lucide React | Consistent interface icons |
| 3D | Three.js | Web 3D rendering |
| 3D React Integration | React Three Fiber | React-based Three.js scenes |
| 3D Utilities | @react-three/drei | Reusable 3D helpers |
| Animation | Motion | UI and interaction animation |
| Database | MongoDB Atlas | Persistent cloud database |
| Database Driver | MongoDB Node.js Driver | Server-side database access |
| Validation | Zod | Runtime schema validation |
| Forms | React Hook Form | Form state and validation integration |
| Authentication | Better Auth | Admin authentication and sessions |
| Email | Resend | Contact notification emails |
| Anti-Spam | Cloudflare Turnstile | Contact-form abuse protection |
| File Storage | Vercel Blob | Persistent media/file storage |
| Image Optimization | Next/Image | Responsive image delivery |
| Deployment | Vercel | Production hosting |
| Version Control | Git + GitHub | Source control |
| Analytics | Vercel Analytics | Privacy-conscious site analytics |
| Performance Monitoring | Vercel Speed Insights | Real-user performance monitoring |
| Unit Testing | Vitest | Unit/integration tests |
| E2E Testing | Playwright | Browser-level application testing |

---

# 3. Framework — Next.js

## Role

Next.js is the primary application framework.

It will handle:

- Public pages.
- Project pages.
- Admin routes.
- Server-side rendering.
- Static generation where appropriate.
- Server components.
- Client components where interaction requires them.
- API endpoints / server-side request handling.
- Metadata and SEO.
- Image optimization.
- Application routing.
- Server-side authorization boundaries.

## Architecture Preference

Use the modern Next.js App Router architecture.

Prefer:

- Server Components by default.
- Client Components only where browser interaction is required.
- Server-side data access.
- Route handlers or server actions where appropriate.
- Incremental/static rendering for content that does not need real-time updates.
- Dynamic rendering for content that requires current database state.

Avoid turning the entire application into a client-rendered SPA unnecessarily.

---

# 4. Language — TypeScript

TypeScript is the single primary programming language.

## Requirements

- Strict TypeScript configuration.
- Explicit domain types.
- Typed database models/repositories.
- Typed API inputs and outputs.
- Shared validation schemas where practical.
- Avoid `any` unless there is a documented reason.

TypeScript should cover:

- Frontend components.
- Server logic.
- Database access.
- CMS logic.
- Validation.
- Authentication integration.
- API/route handlers.
- Utility functions.

---

# 5. Frontend — React

React will provide the component architecture.

## Component principles

Components should be:

- Reusable.
- Composable.
- Accessible.
- Focused.
- Typed.
- Easy to test.

Avoid excessive abstraction.

A component should not be extracted merely because a piece of markup appears once.

---

# 6. Styling — Tailwind CSS

Tailwind CSS will provide the primary styling system.

Use it for:

- Layout.
- Responsive behavior.
- Typography.
- Spacing.
- Borders.
- Surfaces.
- States.
- Utility styling.

The public website should use a custom design system built on top of Tailwind rather than looking like a default Tailwind/shadcn website.

---

# 7. UI Primitives — shadcn/ui

shadcn/ui will primarily be used for the private admin interface and utility/productivity components.

Suitable components include:

- Buttons.
- Inputs.
- Selects.
- Dialogs.
- Dropdowns.
- Tabs.
- Tables.
- Forms.
- Toasts.
- Sheets.
- Command interfaces.

The public portfolio should not automatically inherit a generic shadcn visual identity.

Public-facing components should be custom-designed to match the Dark Systems / Technical Editorial direction.

---

# 8. Icons — Lucide React

Lucide React will provide interface icons.

Use icons consistently for:

- Navigation.
- Admin actions.
- Social links.
- Form actions.
- Status indicators.
- Project metadata.
- CMS controls.

Avoid excessive decorative icon usage.

---

# 9. 3D — Three.js

Three.js will provide the underlying WebGL/WebGPU-capable 3D rendering layer.

## Purpose

3D is a differentiating visual system, not the primary content delivery mechanism.

The 3D language should communicate:

- Systems.
- Architecture.
- Data.
- Infrastructure.
- Connectivity.
- Engineering.
- Automation.

## Rules

- Keep 3D lightweight.
- Lazy-load heavy scenes.
- Avoid unnecessary geometry.
- Avoid excessive real-time effects.
- Avoid unnecessary high-resolution rendering.
- Provide a non-3D fallback.
- Respect reduced-motion preferences.
- Degrade gracefully on weaker devices.

Do not use generic developer-portfolio 3D motifs.

---

# 10. React Three Fiber

React Three Fiber will integrate Three.js with the React component model.

Use it for:

- Hero system visualization.
- Controlled interactive scenes.
- 3D project/system visualizations where justified.

Keep the 3D implementation isolated from normal content components.

A heavy 3D component should not force the entire page to become a client component.

---

# 11. @react-three/drei

Drei will provide reusable helpers for React Three Fiber.

Use it where it meaningfully reduces implementation complexity.

Avoid adding helpers solely for visual novelty.

---

# 12. Animation — Motion

Motion will handle:

- Page transitions where appropriate.
- Reveal animations.
- Hover interactions.
- Micro-interactions.
- Section transitions.
- Controlled scroll-based effects.

## Rules

Animations must:

- Have a purpose.
- Be performant.
- Be subtle.
- Support reduced-motion preferences.
- Never block access to content.
- Never make navigation confusing.

Avoid:

- Constant movement.
- Excessive parallax.
- Giant cursor effects.
- Random particle animation.
- Animation on every element.

---

# 13. Database — MongoDB Atlas

MongoDB Atlas is the persistent cloud database.

It stores:

- Portfolio content.
- Skills.
- Projects.
- Experience.
- Achievements.
- Certifications.
- Metrics.
- Site configuration.
- Contact messages.
- Revision history.
- Activity logs.
- Admin/account data where appropriate.

## Application Connection

The application will connect from the server using a secure MongoDB connection URI.

Example environment variable:

```env
MONGODB_URI=
```

The browser must never receive the MongoDB connection string.

## Important Architecture Rule

Do not use:

```text
Browser → MongoDB
```

Use:

```text
Browser
   ↓
Next.js Server
   ↓
MongoDB Atlas
```

MongoDB Atlas is the source of truth for dynamic portfolio data and contact submissions.

---

# 14. MongoDB Node.js Driver

The official MongoDB Node.js driver will provide server-side database access.

Responsibilities:

- Connection management.
- Queries.
- Inserts.
- Updates.
- Deletes/archives.
- Index interaction.
- Transactions where genuinely required.

Create a reusable database connection layer so the application does not unnecessarily create new connections for every request.

---

# 15. Database Collections

Initial logical collections:

```text
users
profile
hero
about
skills
experience
projects
achievements
certifications
metrics
contactSettings
contactMessages
siteSettings
seo
media
revisions
activityLogs
```

The final physical schema may consolidate or split collections where implementation evidence suggests a better model.

## Required properties

Dynamic content should support:

- Stable IDs.
- Slugs where applicable.
- Publication status.
- Visibility.
- Display order.
- Created timestamp.
- Updated timestamp.

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

# 18. Authentication — Better Auth

Better Auth will handle private admin authentication/session functionality.

Primary purpose:

- Admin login.
- Session management.
- Logout.
- Password management.
- Protected admin access.

## Initial Development Credentials

Temporary seed credentials:

```text
Username: admin
Password: admin
```

These credentials are development/bootstrap credentials only.

Production security must require a secure password and must never expose plaintext credentials.

## Security

- Secure password hashing.
- HTTP-only cookies.
- Secure cookies in production.
- Appropriate SameSite settings.
- Session expiration.
- Server-side route protection.
- Server-side authorization.
- Login rate limiting.
- Failed-login tracking.

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

# 21. File Storage — Vercel Blob

Vercel Blob will store persistent portfolio files.

Use for:

- Profile photo.
- Project screenshots.
- Project media.
- Certificate images.
- Resume files.
- Other approved portfolio assets.

Do not depend on the Vercel runtime filesystem for persistent application data.

## Upload considerations

Validate:

- File type.
- MIME type.
- Extension.
- File size.
- File naming.
- Authorization.

For larger files, prefer direct/client-to-Blob upload patterns where appropriate instead of routing large binary payloads through application functions.

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

# 23. Deployment — Vercel

Vercel is the production hosting platform.

Responsibilities:

- Next.js deployment.
- Server-side functions.
- Environment variables.
- Preview deployments.
- Production deployment.
- Analytics.
- Speed Insights.

## Environments

At minimum:

```text
Development
Preview
Production
```

Sensitive environment variables should be configured separately per environment.

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
    MongoDB Atlas         Resend         Vercel Blob
    Content + CMS        Email           Media
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
   ├──────────────► MongoDB Atlas
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

### MongoDB Atlas
Provides persistent cloud database storage for dynamic portfolio content and contact messages.

### Vercel Blob
Provides persistent media storage without depending on ephemeral application filesystems.

### Resend
Provides a focused transactional email layer for contact notifications.

### Turnstile
Provides contact-form abuse protection without requiring a full CAPTCHA workflow.

### Better Auth
Provides a dedicated authentication/session layer for the private CMS.

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

## Supabase

Not required because MongoDB Atlas has already been selected as the persistent database.

## Firebase

Not required.

## PostgreSQL

Not required for this specific project.

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
├── MongoDB Atlas
└── MongoDB Node.js Driver

External Services
├── Resend
├── Cloudflare Turnstile
└── Vercel Blob

Deployment / Observability
├── Vercel
├── Vercel Analytics
└── Vercel Speed Insights

Development
├── Git
├── GitHub
├── Vitest
└── Playwright
```

---

# 41. Final Architectural Decision

**The portfolio will be built as a TypeScript-first, Next.js full-stack application deployed on Vercel, with MongoDB Atlas as the persistent database, Vercel Blob for media, Resend for contact email delivery, Cloudflare Turnstile for contact-form protection, Better Auth for the private CMS, and Three.js/React Three Fiber for purposeful 3D.**

No additional backend language or database will be introduced unless a future requirement demonstrates a real need.
