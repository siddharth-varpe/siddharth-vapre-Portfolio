# Product Requirements Document (PRD)

## Personal Portfolio — Siddharth Varpe

**Document:** PRD.md  
**Version:** 1.0  
**Status:** Approved for Development  
**Product Type:** Personal Portfolio + Private Content Management System  
**Primary Positioning:** Software Engineer | AI & Full-Stack  
**Primary Audiences:** Recruiters / Software Companies and Freelance / Client Prospects  
**Design Priority:** Premium, original, mobile-first, senior-engineer quality

---

> [!IMPORTANT]
> **INFRASTRUCTURE & DATABASE ARCHITECTURE SPECIFICATION**
> - **Active Infrastructure:** Firebase-centered production architecture.
> - **Hosting:** Firebase App Hosting (dynamic Next.js full-stack runtime).
> - **Database:** Cloud Firestore (sole persistent database).
> - **Authentication:** Firebase Authentication with secure server-side session cookies (`__session`) and custom claim admin authorization.
> - **Storage:** Cloud Storage for Firebase with strict security rules and controlled storage paths.
> - **Privileged Operations:** Firebase Admin SDK (server-only singleton).
> - **Abuse Protection:** Firebase App Check + Cloudflare Turnstile anti-spam verification.
> - **Email Integration:** Firebase-compatible transactional email delivery with reliable Firestore pre-persistence.
> - **Migration Status:** Complete — Supabase, Cloud Firestore, Firebase Authentication, and Cloud Storage for Firebase completely removed from runtime and architecture.
> - **Data Preservation:** 100% of authentic portfolio data has been preserved in `data/portfolio-seed-data.json`. No mock data.

# 1. Product Overview

This project is a high-end personal portfolio website for Siddharth Varpe, positioned as a professional proof-of-work platform rather than a conventional résumé website.

The portfolio must communicate three things quickly:

1. Who Siddharth is.
2. What he can build.
3. What measurable impact his work has created.

The public website will present professional identity, experience, projects, technical skills, achievements, certifications, and contact information.

A private admin CMS will allow Siddharth to manage all variable portfolio content without modifying source code. Contact-form submissions are permanently persisted in the portfolio database and exposed through a private admin inbox, while an email notification system ensures new inquiries reach Siddharth directly.

The experience should feel like it was designed and engineered by a senior software engineer: restrained, intentional, fast, accessible, technically credible, and visually distinctive.

---

# 2. Product Goals

## 2.1 Primary Goals

- Create a premium professional identity for Siddharth Varpe.
- Attract recruiters and software companies.
- Generate freelance/client opportunities.
- Demonstrate real engineering ability through project case studies.
- Present measurable business/engineering impact.
- Make the portfolio content easy to maintain through an admin CMS.
- Provide a reliable contact pipeline with permanent message storage.
- Establish a scalable foundation for future portfolio growth.
- Maintain excellent mobile experience.
- Use 3D only where it adds meaning and differentiation.
- Achieve strong performance, accessibility, SEO, and maintainability.

## 2.2 Secondary Goals

- Allow new skills, projects, achievements, certifications, metrics, and experience to be added without code changes.
- Allow project content and media to evolve over time.
- Provide draft/published/archived content states.
- Provide revision history and activity tracking.
- Provide a secure private admin area.
- Make deployment and maintenance straightforward on Firebase App Hosting.

## 2.3 Non-Goals

The first release will NOT attempt to become:

- A social network.
- A general-purpose CMS.
- A public blog platform.
- A job-board platform.
- A SaaS product.
- A public user-account platform.
- A generic website-template system.
- A platform where administrators can inject arbitrary HTML, JavaScript, or CSS.

---

# 3. Target Users

## 3.1 Recruiters / Hiring Managers

### Need
Quickly determine whether Siddharth has relevant engineering capability.

### They should find:
- Professional positioning.
- Technical skills.
- Experience.
- Strong projects.
- Measurable outcomes.
- Education/professional credentials where applicable.
- GitHub / LinkedIn / contact options.
- Downloadable résumé.

### Success condition
A recruiter can understand Siddharth's engineering profile within a short visit and identify strong evidence of practical software development.

---

## 3.2 Freelance / Client Prospects

### Need
Determine whether Siddharth can solve a real business or product problem.

### They should find:
- What Siddharth builds.
- Examples of production-oriented work.
- Business impact.
- Technologies used.
- Case studies.
- Contact mechanism.
- Clear calls to action.

### Success condition
A potential client understands the type of work Siddharth can deliver and has a frictionless path to start a conversation.

---

## 3.3 Portfolio Administrator — Siddharth

### Need
Update portfolio information without repeatedly editing code.

### They should be able to:
- Update profile information.
- Update hero content.
- Add/edit/remove skills.
- Add/edit/remove projects.
- Update experience.
- Update metrics.
- Manage achievements.
- Manage certifications.
- Manage contact/social information.
- Manage résumé.
- Manage media.
- Manage SEO metadata.
- View contact submissions.
- Publish, archive, and restore content.
- Review revisions and activity logs.
- Change admin credentials.

---

# 4. Product Principles

## 4.1 Proof Over Claims

The website should demonstrate capability through real projects, measurable impact, implementation details, and evidence.

Avoid unsupported claims, fake metrics, fake testimonials, or invented project functionality.

## 4.2 Quality Over Quantity

A smaller number of strong projects is preferable to a large collection of shallow projects.

## 4.3 Original Design

The visual identity must be custom-designed for this portfolio.

Do not copy templates, Pinterest layouts, popular developer portfolio clones, or recognizable existing portfolio designs.

## 4.4 Progressive Enhancement

The core portfolio must remain useful without heavy animation or 3D.

3D and advanced animation should enhance the experience rather than become a dependency for understanding content.

## 4.5 Mobile First

The design and implementation must begin with mobile layouts and progressively enhance for tablet and desktop.

## 4.6 Performance Is a Feature

Visual effects must never justify poor loading speed, excessive JavaScript, or unusable interactions.

## 4.7 Content Is Data

Variable portfolio information must be stored as structured content rather than hardcoded throughout the frontend.

---

# 5. Visual Direction

## 5.1 Design Direction

**Dark Systems / Technical Editorial**

The visual language should combine:

- Premium software engineering studio aesthetic.
- Technical editorial design.
- Near-black / graphite surfaces.
- Warm off-white typography.
- Controlled electric-blue accent.
- Fine grid structures.
- Technical lines and system-like details.
- Soft atmospheric lighting.
- Purposeful 3D.
- Strong typography hierarchy.
- Calm, deliberate motion.

The result should feel sophisticated and engineered rather than flashy.

---

# 6. 3D & Motion Strategy

## 6.1 3D Concept

The portfolio will use an original 3D visual concept based around abstract software infrastructure / systems rather than common developer-portfolio imagery.

Avoid:

- Generic floating cubes.
- React logos.
- Laptop mockups as the primary 3D concept.
- Generic developer avatars.
- Random particle fields.
- Decorative 3D that has no relationship to the portfolio.

The 3D system should communicate concepts such as:

- Connected systems.
- Architecture.
- Data flow.
- Infrastructure.
- Engineering.
- Reliability.
- Intelligent automation.

## 6.2 Motion Rules

Motion must be:

- Purposeful.
- Subtle.
- Fast enough to feel responsive.
- Respectful of reduced-motion preferences.
- Disabled or simplified when performance conditions require it.

Do not use animation merely because it is technically possible.

---

# 7. Public Information Architecture

The public website will contain the following primary routes.

```text
/
├── /about
├── /experience
├── /projects
│   ├── /projects/crm-sr-enterprises
│   ├── /projects/inventory-management
│   ├── /projects/campus-buddy
│   └── /projects/portfolio-website
├── /skills
├── /achievements
├── /certifications
└── /contact
```

Additional system routes:

```text
/404
/loading
```

Private routes:

```text
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
/admin/messages
/admin/resume
/admin/media
/admin/seo
/admin/site-content
/admin/revisions
/admin/activity
/admin/security
```

Route structure may be refined during implementation, but the information architecture should remain equivalent.

---

# 8. Home Page Requirements

The home page is the primary sales/presentation surface.

It must NOT attempt to contain the entire portfolio.

## Required sections

### 8.1 Header

- SV / portfolio mark.
- Navigation.
- Mobile navigation trigger.
- Clear visual hierarchy.
- Contact CTA where appropriate.

### 8.2 Hero

The hero should communicate:

- Software Engineer positioning.
- Siddharth Varpe.
- Core value proposition.
- Short supporting description.
- Primary CTA: View My Work.
- Secondary CTA: Download Resume.
- Professional portrait.
- Purposeful 3D/system visual treatment.

Proposed positioning:

**Software Engineer | AI & Full-Stack**

Proposed core message:

**Building Real Solutions with Code, AI and Impact.**

Copy should remain editable through the CMS.

### 8.3 Impact Metrics

Metrics should be presented as system telemetry / engineering signals rather than generic marketing counters.

Current approved evidence includes:

- 2K–3K+ customer records managed.
- 11 business modules built.
- ~90% faster data retrieval.
- ~65% less manual data entry.

Metrics must be editable through the CMS.

### 8.4 Featured Projects

Display selected high-value projects.

The home page should provide enough context to create curiosity and direct users to full project case studies.

### 8.5 About Preview

A concise introduction with a route to the full About page.

### 8.6 Final CTA

Strong contact-oriented closing section.

---

# 9. About Page

The About page should communicate:

- Professional identity.
- Engineering philosophy.
- Development approach.
- Interests.
- Strengths.
- Human personality without becoming overly personal.
- Relevant technologies and areas of interest.

Potential editable strength cards:

- Problem Solver.
- Continuous Learner.
- Impact Driven.
- Team Player.

These are content concepts and must remain editable.

---

# 10. Experience Page

The Experience page will present professional experience in a structured timeline or editorial format.

Current primary experience:

## SR Enterprises

**Role:** Full-Stack Software Engineer Intern  
**Type:** Paid Internship  
**Duration:** 3 months  
**Location:** Pune

### CRM — SR Enterprises

Evidence currently available:

- End-to-end CRM.
- 11 core modules.
- 2,000–3,000+ customer records.
- Role-based access.
- Workflow automation.
- Responsive UI.
- Approximately 90% faster retrieval.
- Approximately 65% less manual data entry.
- Approximately 90% lower risk of record loss.

Technology evidence:

- React.
- Node.js.
- PostgreSQL.
- REST APIs.

### Inventory Management Platform

Evidence currently available:

- 1,000+ SKUs.
- 10,000+ transactions.
- 20+ automated workflows.
- Purchase and sales operations.
- Stock adjustments.
- Invoices.
- Low-stock alerts.
- Analytics.
- Approximately 80–90% faster stock retrieval.
- Approximately 70% fewer manual operations.
- Approximately 75% fewer stock-entry errors.

Technology evidence:

- React.
- Python.
- FastAPI.
- PostgreSQL.

All experience content must be editable through the CMS.

---

# 11. Projects Page

The projects section is one of the most important parts of the product.

Projects should be presented as engineering case studies, not simple cards.

## Current projects

### 11.1 CRM — SR Enterprises

Status:
- GitHub: Available.
- Live demo: Not currently available; planned.
- Screenshots: Available.

Case-study sections should include:

- Overview.
- Problem.
- Objective.
- Role.
- Users / operational context where confirmed.
- Key functionality.
- Architecture / system overview where confirmed.
- Engineering decisions.
- Implementation.
- Impact.
- Metrics.
- Screenshots.
- Technology stack.
- GitHub.
- Live demo when available.

Do not invent architecture details that have not been verified.

### 11.2 Inventory Management Platform

Status:
- GitHub: Available.
- Live demo: Not currently available; planned.
- Screenshots: Available.

Use the same case-study structure.

### 11.3 Campus Buddy

AI-powered campus platform.

Known capabilities:

- Timetable management.
- Event notifications.
- Admin workflows.
- 24/7 chatbot.

Technology:

- Next.js.
- TypeScript.
- Tailwind CSS.
- Gemini API.

Status:
- GitHub: Available.
- Live demo: Available.
- Screenshots: Available.

GitHub and live-demo links must be editable through the CMS.

### 11.4 Portfolio Website

Current portfolio project.

Technology evidence:

- React.
- HTML.
- CSS.
- JavaScript.
- Vercel.

The new implementation should supersede the previous portfolio while preserving the ability to describe the project accurately.

---

# 12. Project Case Study Requirements

Every project detail page should support the following structured content:

```text
Project identity
Project slug
Short summary
Long description
Problem
Objective
Role
Responsibilities
Features
Engineering decisions
Architecture
Implementation
Challenges
Solutions
Impact
Metrics
Technology stack
GitHub URL
Live URL
Screenshots
Videos
Additional media
Featured status
Publication status
Display order
```

Only fields with real evidence should be populated.

---

# 13. Skills Page

The skills page must be fully dynamic.

Skills will NOT be represented using hardcoded percentage bars.

Each skill should support:

- Name.
- Category.
- Description.
- Icon.
- Optional proficiency indicator.
- Optional years of experience.
- Featured status.
- Display order.
- Visibility.

Current skill categories include:

### Languages
- JavaScript.
- Python.
- HTML5.
- CSS3.
- SQL.

### Frontend
- React.
- Next.js.
- Tailwind CSS.

### Backend / APIs
- Node.js.
- Express.js.
- FastAPI.
- REST APIs.
- WebSockets.

### Databases
- PostgreSQL.
- MySQL.

### Tools
- Git.
- GitHub.
- Postman.
- VS Code.

### AI
- Gemini API.
- Prompt Engineering.

### Design
- Figma.
- Responsive Design.

### Deployment
- Vercel.
- Basic CI/CD.

The CMS must allow these to evolve over time.

---

# 14. Achievements Page

Current achievements:

- 1st Place — Prompt Engineering Challenge, National Tech Fest.
- 2nd Place — Prompt Engineering Competition, National Tech Fest.

Each achievement should support:

- Title.
- Organization.
- Rank / result.
- Date.
- Description.
- Certificate or evidence image.
- Verification URL where available.
- Featured status.
- Display order.
- Visibility.

---

# 15. Certifications Page

Current certifications:

- Python Fundamentals — Great Learning.
- Web Design with HTML & CSS — Udemy.
- UI/UX Design — Google Skillshop.
- Responsive Web Design — freeCodeCamp.

Each certification should support:

- Name.
- Issuing organization.
- Issue date.
- Expiration date if applicable.
- Credential ID.
- Verification URL.
- Certificate image/PDF.
- Description.
- Featured status.
- Display order.
- Visibility.

---

# 16. Contact Page

The contact page is a critical business feature.

## Required fields

- Name.
- Email.
- Subject.
- Message.
- Cloudflare Turnstile verification.

Optional fields may be added later if justified.

## Contact submission flow

```text
Visitor
   ↓
Contact Form
   ↓
Client Validation
   ↓
Cloudflare Turnstile
   ↓
Next.js Server/API
   ↓
Server Validation
   ↓
Cloud Firestore
   ↓
Email Notification via Resend
```

Cloud Firestore must be treated as the source of truth.

The system should store the message BEFORE attempting email delivery.

If email delivery fails:

- The message must remain stored.
- Delivery status must indicate failure.
- The admin must still be able to see the message.
- A retry mechanism may be implemented.

## Contact message data

Suggested fields:

```text
_id
name
email
subject
message
status
createdAt
readAt
archivedAt
emailDeliveryStatus
emailMessageId
ipHash
userAgent
turnstileVerified
```

Sensitive data should be minimized.

---

# 17. Admin CMS Requirements

The admin CMS is a private content management system.

It must manage all variable content while leaving core application architecture and visual design controlled by developers.

## Dashboard

Display:

- Publication status.
- Last updated time.
- Content counts.
- Featured project count.
- Unread messages.
- Content completeness indicators.
- Recent changes.
- Quick actions.

## Profile

Manage:

- Name.
- Professional title.
- Intro.
- Bio.
- Location.
- Email.
- Optional phone.
- Profile photo.
- Resume.
- Availability.
- Tagline.

## Hero

Manage:

- Eyebrow.
- Name.
- Headline.
- Description.
- CTA labels.
- CTA destinations.
- Supporting text.
- Visibility.

## About

Manage:

- About copy.
- Philosophy.
- Interests.
- Strength cards.
- Section visibility.
- Display order.

## Skills

Full CRUD:

- Create.
- Read.
- Update.
- Delete/archive.
- Reorder.
- Publish/unpublish.

## Experience

Full CRUD for experience entries.

## Projects

Full CRUD for project case studies.

Support:

- Draft.
- Published.
- Archived.
- Featured.
- Reordering.
- Media.
- External links.

## Achievements

Full CRUD.

## Certifications

Full CRUD.

## Metrics

Metrics must be independently manageable.

Each metric should include:

- Value.
- Label.
- Supporting text.
- Icon.
- Section.
- Display order.
- Featured status.
- Visibility.
- Evidence/source note.

Never invent metrics through the CMS.

## Contact & Socials

Manage:

- Contact email.
- LinkedIn.
- GitHub.
- Other social/professional links.
- Location.
- Contact CTA.
- Optional booking/contact destination.

## Resume

Support:

- Upload.
- Replace.
- Archive.
- Set active version.
- Filename.
- Version.
- Upload date.
- Download availability.

## Media Library

Support:

- Upload.
- Preview.
- Metadata.
- Replacement.
- Deletion.
- Usage tracking.

Validate:

- MIME type.
- File extension.
- File size.

## SEO

Manage per-page:

- Title.
- Meta description.
- Author.
- Open Graph title.
- Open Graph description.
- Open Graph image.
- Canonical URL.
- Indexing status.

## Site Content

Manage variable global content such as:

- Footer text.
- Copyright.
- Global CTAs.
- 404 copy.
- Loading copy.
- Empty states.

The admin must not allow arbitrary HTML/JS injection.

## Revisions

Record:

- Previous version.
- New version.
- Changed by.
- Timestamp.
- Action.

Allow restoration of previous content where practical.

## Activity Log

Record:

- Login.
- Logout.
- Failed login.
- Content creation.
- Content update.
- Content deletion/archive.
- Publish/unpublish.
- Media changes.
- Password changes.
- Revision restoration.

Never log plaintext passwords or secrets.

## Account & Security

Provide:

- Change password.
- Session management where supported.
- Logout.
- Security status.
- Last login.
- Failed login information.

---

# 18. Authentication Requirements

Admin access must be private.

Initial development credentials:

```text
Username: admin
Password: admin
```

These are temporary seed credentials only.

Requirements:

- Store password as a secure hash.
- Never store plaintext passwords.
- Force or strongly encourage password change after initial setup.
- Use server-side authentication/session handling.
- Use secure HTTP-only cookies.
- Use appropriate SameSite behavior.
- Apply session expiration.
- Protect every admin route server-side.
- Protect every admin mutation server-side.
- Track failed login attempts.
- Apply login rate limiting.
- Keep authentication secrets in environment variables.

---

# 19. Database Requirements

## Database

**Cloud Firestore**

Cloud Firestore will be the persistent cloud database.

## Suggested collections

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

The exact schema may be normalized or consolidated during implementation where appropriate.

## Persistence Requirement

Contact submissions must remain permanently stored unless explicitly deleted or archived by the administrator.

Portfolio content must persist independently from Vercel's ephemeral runtime filesystem.

---

# 20. Media Storage

Binary media should not depend on the Vercel server filesystem.

Use:

**Cloud Storage for Firebase**

for:

- Profile photo.
- Project screenshots.
- Project videos where appropriate.
- Certificate images.
- Resume files.
- Other portfolio media.

Use appropriate public/private access depending on asset sensitivity.

---

# 21. Email Requirements

Use:

**Resend**

for transactional contact notifications.

When a visitor submits the contact form:

1. Store submission in Cloud Firestore.
2. Attempt email notification.
3. Record delivery status.
4. Store provider message ID where available.
5. Preserve the original message regardless of email outcome.

The sending domain must be verified before production use.

---

# 22. Anti-Spam & Abuse Prevention

Use:

**Cloudflare Turnstile**

Requirements:

- Render Turnstile on the public contact form.
- Send the verification token to the server.
- Validate the token server-side.
- Reject invalid or missing verification.
- Do not treat client-side success as sufficient verification.

Additional protections:

- Server-side schema validation.
- Rate limiting.
- Honeypot field where appropriate.
- Request-size limits.
- Input sanitization.
- Abuse logging with minimized identifiers.

---

# 23. Technical Stack

## Core

- Next.js.
- TypeScript.
- React.
- Tailwind CSS.

## UI

- shadcn/ui for admin/productivity interfaces.
- Lucide React icons.
- Custom public-facing design system.

## 3D

- Three.js.
- React Three Fiber.
- @react-three/drei.

## Animation

- Motion / Framer Motion.

## Database

- Cloud Firestore.
- Firebase Admin SDK / Firestore.

## Validation / Forms

- Zod.
- React Hook Form.

## Authentication

- Firebase Authentication.

## Email

- Resend.

## Anti-Spam

- Cloudflare Turnstile.

## Storage

- Cloud Storage for Firebase.

## Images

- Next/Image.

## Deployment

- Vercel.

## Version Control

- Git.
- GitHub.

## Analytics / Monitoring

- Vercel Analytics.
- Vercel Speed Insights.

## Testing

- Vitest.
- Playwright.

Python/FastAPI should NOT be introduced into this portfolio solely because Siddharth uses Python elsewhere. The portfolio should remain TypeScript full-stack to reduce unnecessary architectural complexity.

---

# 24. Environment Variables

Expected server configuration:

```env
FIREBASE_PROJECT_ID=
BETTER_AUTH_SECRET=
RESEND_API_KEY=
CONTACT_EMAIL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

Rules:

- Server secrets must never use `NEXT_PUBLIC_`.
- Public configuration should be explicitly limited to values that are safe for browser exposure.
- Production secrets must be stored in Vercel environment variables.
- No secrets may be committed to Git.

---

# 25. Security Requirements

## Application Security

- Server-side authentication.
- Server-side authorization.
- Secure password hashing.
- Secure session cookies.
- CSRF protection where applicable.
- Rate limiting.
- Input validation.
- Output encoding/sanitization.
- Security headers.
- Content Security Policy where practical.
- No arbitrary HTML/JavaScript injection.
- No public database credentials.
- No public admin APIs without authorization.
- Validate all resource ownership and identifiers server-side.
- Limit upload MIME types/extensions/sizes.
- Protect admin routes at the server level.

## Database Security

- Database credentials only on the server.
- Least-privilege database user.
- Secure connection string.
- No direct browser-to-Cloud Firestore writes.
- Appropriate Atlas network/security configuration.

---

# 26. Performance Requirements

The application should target strong Core Web Vitals and real-device performance.

Primary goals:

- Fast first meaningful render.
- Minimal blocking JavaScript.
- Optimized images.
- Responsive image sizes.
- Lazy loading for non-critical media.
- Lazy loading or deferred loading for heavy 3D.
- Avoid unnecessary client components.
- Avoid excessive animation libraries where not needed.
- Avoid rendering expensive 3D on devices where it provides insufficient value.
- Avoid blindly rendering at maximum device pixel ratio for heavy 3D scenes.

Target quality should align with strong production web performance expectations, including approximately:

- LCP ≤ 2.5s.
- INP ≤ 200ms.
- CLS ≤ 0.1.

Targets should be evaluated on real deployments, not only local development machines.

---

# 27. Accessibility Requirements

The public and admin interfaces must be accessible.

Requirements include:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible form labels.
- Meaningful button/link names.
- Sufficient color contrast.
- Do not rely on color alone.
- Accessible navigation.
- Touch-friendly controls.
- Reduced-motion support.
- Responsive layouts.
- Descriptive alternative text for meaningful images.
- Decorative imagery marked appropriately.
- Logical heading hierarchy.

Interactive controls should have comfortable touch targets, especially on mobile.

---

# 28. Responsive Requirements

The website is **mobile-first**.

Minimum considerations:

- Small mobile.
- Large mobile.
- Tablet.
- Laptop.
- Desktop.
- Large desktop.

Mobile requirements:

- No horizontal overflow.
- Comfortable touch targets.
- Readable typography.
- Stable layout.
- Optimized images.
- Lightweight navigation.
- 3D degradation/fallback when appropriate.
- Contact form must be easy to complete on a phone.

---

# 29. SEO Requirements

The public website should be search-engine friendly.

Requirements:

- Semantic HTML.
- Unique page titles.
- Meta descriptions.
- Canonical URLs.
- Open Graph metadata.
- Social sharing metadata.
- Sitemap.
- Robots configuration.
- Structured data where appropriate.
- Personal Profile / Person structured data where appropriate.
- Important information must exist as crawlable text rather than being embedded only inside graphics.

Project pages should have unique metadata.

---

# 30. Content Management Model

All public content should follow a publication lifecycle:

```text
Draft → Published → Archived
```

Requirements:

- Draft content must not appear publicly.
- Published content appears on the public website.
- Archived content should no longer appear in normal public listings.
- Admin should be able to restore or republish content.
- Ordering must be configurable.

---

# 31. Data Integrity Requirements

The system must distinguish between:

- Real evidence.
- Editable content.
- Optional content.
- Missing information.

The application must never generate fake:

- Metrics.
- Client names.
- Testimonials.
- Project features.
- Performance claims.
- Certifications.
- Links.
- Architecture details.

If information is unavailable, the CMS should allow the field to remain empty.

---

# 32. Contact Reliability Requirements

The contact system is considered successful only when all of the following work:

1. Visitor submits a valid form.
2. Server validates the request.
3. Turnstile is verified server-side.
4. Message is stored in Cloud Firestore.
5. Admin can view the message.
6. Email notification is attempted.
7. Email delivery status is tracked.
8. A temporary email failure does not destroy the message.

Cloud Firestore is the permanent source of truth.

---

# 33. Admin Messages Page

A dedicated private Messages/Contact Inbox is required.

## Dashboard summary

Show:

- Total messages.
- Unread messages.
- Messages this week.
- Recent messages.

## Message list

Each row should show:

- Sender name.
- Sender email.
- Subject.
- Timestamp.
- Read/unread status.
- Email delivery status.

## Message detail

Show:

- Full sender information.
- Full subject.
- Full message.
- Submission timestamp.
- Delivery status.
- Relevant security/verification metadata where appropriate.

Actions:

- Mark as read.
- Mark as unread.
- Archive.
- Delete if administrator chooses.
- Reply via email.

---

# 34. Professional Photo Requirements

A real professional photo will be supplied later.

The implementation must:

- Use the original user-provided photo.
- Preserve facial identity.
- Preserve facial structure and personality.
- Not regenerate the face.
- Not replace the person with an AI-generated person.
- Only perform visual editing required to integrate the original photograph into the portfolio's visual system.
- Match the portfolio's color/light treatment where appropriate.

The portrait-dependent implementation should not be finalized until the original photo is provided.

---

# 35. Current External Project Links

## Campus Buddy

GitHub:

https://github.com/siddharth-varpe/collegestudentbuddy-campusbuddy

Live Demo:

https://collegestudentbuddy-campusbuddy-dzg.vercel.app/

These should be stored as editable project fields rather than hardcoded in multiple components.

CRM and Inventory GitHub/demo URLs must be supplied before they are entered into production content.

---

# 36. Navigation Requirements

Public navigation should remain simple.

Primary destinations:

- Home.
- About.
- Experience.
- Projects.
- Skills.
- Achievements.
- Certifications.
- Contact.

Mobile navigation should use a compact interaction and must not create excessive visual clutter.

A persistent mobile bottom navigation may be used if it remains useful and does not compete with the primary content.

---

# 37. Error / Empty / Loading States

Every dynamic area should have intentional states.

Required:

- Loading state.
- Empty state.
- Error state.
- Not-found state.
- Offline/network failure handling where appropriate.

These states should match the visual system and should not look like browser defaults.

---

# 38. Analytics

Use privacy-conscious analytics to understand:

- Page visits.
- Project page engagement.
- Contact CTA engagement.
- Resume interaction.
- General portfolio performance.

Analytics must not become invasive.

---

# 39. Testing Strategy

## Unit Testing

Use Vitest for:

- Utility functions.
- Validation.
- Data transformations.
- Critical business logic.

## End-to-End Testing

Use Playwright for:

- Public navigation.
- Contact form.
- Admin login.
- Admin content CRUD.
- Message inbox.
- Publishing workflow.

## Security Testing

Verify:

- Unauthenticated admin access is blocked.
- Admin mutations require authorization.
- Invalid form input is rejected.
- Turnstile failures are rejected.
- Rate limiting works.
- Secrets are not exposed to the client.
- Unauthorized content IDs cannot be modified.
- Upload validation works.

---

# 40. Deployment

Deployment target:

**Vercel**

External services:

```text
Vercel
 ├── Next.js application
 ├── Server-side functions
 ├── Environment variables
 ├── Analytics
 └── Speed Insights

Cloud Firestore
 └── Persistent application database

Cloud Storage for Firebase
 └── Media storage

Resend
 └── Contact email delivery

Cloudflare Turnstile
 └── Contact-form anti-abuse verification
```

Production deployment must use secure environment variables and verified external-service configuration.

---

# 41. High-Level System Architecture

```text
                         INTERNET
                            │
                            ▼
                    ┌───────────────┐
                    │    VERCEL     │
                    │   Next.js     │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       PUBLIC PORTFOLIO              ADMIN CMS
              │                           │
              └─────────────┬─────────────┘
                            │
                     SERVER-SIDE LAYER
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   Cloud Firestore          Resend        Cloud Storage for Firebase
   Content + Messages     Email          Media
          │
          │
          ▼
   Persistent Source
       of Truth

Public Contact Form
        │
        ▼
Cloudflare Turnstile
        │
        ▼
Server Validation
        │
        ▼
Cloud Firestore → Email Notification
```

---

# 42. Success Metrics

The product will be considered successful when:

## Professional

- Visitors quickly understand Siddharth's positioning.
- Projects communicate real engineering capability.
- Impact metrics are clear and credible.
- Recruiters can easily find résumé, skills, experience, projects, and contact information.
- Clients can understand what Siddharth can build.

## Technical

- Fully responsive.
- Strong mobile experience.
- No major accessibility blockers.
- No critical security issues.
- Strong Core Web Vitals.
- Reliable contact submission.
- Persistent Cloud Firestore storage.
- Secure admin authentication.
- CMS changes appear correctly on the public site.

## Operational

- Siddharth can update content without modifying application code.
- New skills can be added.
- New projects can be added.
- Project links can be changed.
- Metrics can be updated.
- Resume can be replaced.
- Contact messages can be managed from the admin panel.
- Previous content can be reviewed/restored where supported.

---

# 43. MVP Scope

The first production-ready version must include:

### Public

- Home.
- About.
- Experience.
- Projects.
- Project detail pages.
- Skills.
- Achievements.
- Certifications.
- Contact.
- Responsive navigation.
- Resume download.
- Professional photo integration after photo is supplied.
- Purposeful 3D.
- Core animations.
- SEO foundations.
- Accessibility foundations.

### Admin

- Secure login.
- Dashboard.
- Profile.
- Hero.
- About.
- Skills CRUD.
- Experience CRUD.
- Projects CRUD.
- Achievements CRUD.
- Certifications CRUD.
- Metrics CRUD.
- Contact/social settings.
- Resume management.
- Media library.
- SEO settings.
- Site content.
- Messages/contact inbox.
- Revisions.
- Activity logs.
- Account/security.

### Infrastructure

- Cloud Firestore.
- Vercel.
- Cloud Storage for Firebase.
- Resend.
- Cloudflare Turnstile.
- Environment-variable based secrets.
- Testing foundation.

---

# 44. Future Enhancements

Potential future additions, not required for MVP:

- Blog / technical writing.
- Engineering Lab page.
- Interactive architecture demos.
- More advanced 3D system visualizations.
- Client inquiry categorization.
- Automated contact-email templates.
- Message search and filtering.
- Advanced analytics.
- Multi-admin roles.
- Scheduled content publishing.
- More granular permissions.
- Additional project media types.

Future additions must not compromise the core portfolio experience.

---

# 45. Development Rules

1. Do not redesign the visual direction without explicit approval.
2. Do not introduce unnecessary technologies.
3. Do not hardcode dynamic portfolio content.
4. Do not invent project information.
5. Do not expose server secrets to the browser.
6. Do not connect the browser directly to Cloud Firestore.
7. Do not treat email as the source of truth for contact submissions.
8. Do not store persistent portfolio data on the Vercel filesystem.
9. Do not use 3D purely as decoration.
10. Do not sacrifice mobile usability for desktop visuals.
11. Do not sacrifice performance for animation.
12. Do not alter the user's face or identity when processing the professional photo.
13. Do not introduce fake testimonials, metrics, clients, or achievements.
14. Keep the public experience custom and premium.
15. Keep admin interfaces practical and productivity-focused.
16. All admin mutations must be authenticated and authorized server-side.
17. Every new variable content type should be manageable through the CMS when practical.
18. Core visual/design logic remains developer-controlled rather than editable as arbitrary HTML/CSS/JS.

---

# 46. Definition of Done

The project is ready for production when:

- [ ] Public routes are implemented.
- [ ] Admin routes are protected.
- [ ] Cloud Firestore is connected.
- [ ] Content is loaded from the CMS/database where intended.
- [ ] Contact submissions persist in Cloud Firestore.
- [ ] Contact notifications are delivered through Resend.
- [ ] Email failures do not lose contact submissions.
- [ ] Turnstile server verification works.
- [ ] Admin can manage all MVP content.
- [ ] Resume upload/replacement works.
- [ ] Media storage works.
- [ ] Revisions and activity logging work for required actions.
- [ ] Mobile layouts are polished.
- [ ] Desktop layouts are polished.
- [ ] 3D has appropriate fallback/degradation.
- [ ] Reduced-motion behavior works.
- [ ] Accessibility checks pass for critical flows.
- [ ] SEO metadata is configured.
- [ ] No secrets are exposed.
- [ ] Production environment variables are configured.
- [ ] Critical flows have automated tests.
- [ ] Contact form has been tested end-to-end.
- [ ] Real professional photo has been integrated without altering identity.
- [ ] No fake or unsupported content is present.
- [ ] Production performance has been tested.

---

# 47. Final Product Definition

The finished product should feel like:

> **A senior-engineer-built digital identity system — not a résumé placed inside a website.**

It should combine:

**Professional credibility + real engineering evidence + measurable impact + premium visual design + purposeful 3D + strong performance + maintainable content management.**

The public portfolio earns attention.

The project case studies earn credibility.

The metrics demonstrate impact.

The admin CMS keeps the product maintainable.

Cloud Firestore preserves the content and contact history.

The overall system should remain simple enough to maintain while being sophisticated enough to represent a serious software engineer.
