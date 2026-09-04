# SECURITY.md

# Siddharth Varpe Portfolio — Security Constitution

**Status:** MANDATORY  
**Priority:** CRITICAL  
**Applies to:** Public website, Admin CMS, APIs/server actions, authentication, contact system, database, file uploads, payments if ever added, webhooks, deployment, logging, source maps, environment configuration, and all future features.

---

## 1. SECURITY MISSION

This project must be built with **security as a first-class requirement**.

The development agent must not treat security as a final checklist added after implementation.

Security controls must be designed into:

- application architecture
- authentication
- authorization
- database access
- API routes
- forms
- file uploads
- webhooks
- contact submissions
- admin CMS
- sessions
- secrets
- deployment
- logging
- error handling
- third-party integrations

> **No feature is considered complete until its security behavior has been considered and tested.**

---

# 2. ABSOLUTE SECURITY RULE

## DO NOT ASSUME SOMETHING IS SAFE

Never implement a feature based only on the assumption that:

- the user interface prevents abuse
- a hidden field is trustworthy
- a URL parameter is trustworthy
- a frontend check is sufficient
- an API is private because it is not linked
- a webhook is legitimate because it came from a known endpoint
- a file extension proves a file type
- a JWT is safe because it is signed
- an environment variable is safe because it is not displayed
- a database ID belongs to the current user
- a user is authorized because the frontend says so

**All security-sensitive decisions must be enforced server-side.**

---

# 3. SOURCE OF SECURITY TRUTH

Security implementation must follow:

1. explicit user security requirements
2. this `SECURITY.md`
3. `PRD.md`
4. `TechStack.md`
5. `DEVELOPMENT_RULES.md`
6. established framework security mechanisms
7. least-privilege engineering practices

If another project document conflicts with this security document, choose the more secure behavior and flag the conflict for review.

Never weaken a security control merely to make implementation easier.

---

# 4. SECURITY THREAT MODEL

The application must be treated as exposed to:

- automated scanners
- bots
- credential stuffing
- brute-force attacks
- malicious form submissions
- malicious file uploads
- crafted API requests
- malicious URLs
- forged webhooks
- unauthorized admin access
- IDOR/BOLA attacks
- XSS payloads
- CSRF attempts
- SSRF attempts
- path traversal attempts
- leaked secrets
- exposed logs
- exposed source maps
- dependency vulnerabilities
- manipulated frontend state
- replayed requests
- malformed requests
- oversized requests

Assume that an attacker can inspect the browser, modify every frontend request, bypass every frontend restriction, and directly call public endpoints.

---

# 5. XSS — CROSS-SITE SCRIPTING

## Required protections

Never trust user-controlled text.

Validate and safely render:

- contact form names
- subjects
- messages
- admin-entered content
- project descriptions
- profile content
- URLs
- metadata
- uploaded filenames
- query parameters

React's escaping must not be bypassed unnecessarily.

Do NOT use:

- `dangerouslySetInnerHTML`
- arbitrary HTML injection
- raw DOM insertion
- untrusted HTML rendering

unless there is an explicitly approved, sanitized, tightly controlled requirement.

If HTML rendering is ever required:

- use a proven sanitizer
- define an allowlist
- sanitize server-side
- never trust client-side sanitization alone

Never allow admin CMS fields to become executable HTML/JavaScript.

## Stored XSS

Remember that content saved in MongoDB can later become an attack payload.

Therefore:

> **Database storage does not make content trusted.**

Validate/sanitize at the appropriate trust boundary and safely encode during rendering.

---

# 6. CSRF — CROSS-SITE REQUEST FORGERY

All state-changing operations must be protected against CSRF where the authentication mechanism makes CSRF relevant.

Protect operations such as:

- login-related state changes
- password changes
- admin mutations
- publish/unpublish
- delete/archive
- media operations
- contact-related state changes
- account/security actions

Use appropriate protections such as:

- SameSite cookies
- origin/referer validation where appropriate
- framework-supported CSRF mechanisms
- anti-CSRF tokens where required

Do not assume that a hidden frontend form field is sufficient.

GET requests must not perform destructive or state-changing actions.

---

# 7. INSECURE FILE UPLOADS

File uploads are high-risk functionality.

Every upload must validate:

- file size
- MIME type
- extension
- actual file characteristics where practical
- allowed file category
- storage destination
- filename handling

Never trust:

- `Content-Type`
- filename extension
- original filename

from the client.

## Required controls

- strict allowlist of accepted file types
- strict maximum file size
- generated storage names
- no executable upload types
- no arbitrary filesystem paths
- no user-controlled storage paths
- safe content-disposition behavior
- authorization before upload
- authorization before replacement/deletion

Approved storage:

**Vercel Blob**

Do not store user uploads on the application server filesystem as permanent storage.

---

# 8. PATH TRAVERSAL

Never allow user input to directly determine a filesystem path.

Reject or safely normalize malicious patterns such as:

- `../`
- `..\`
- encoded traversal sequences
- absolute paths
- unexpected path separators

Do not construct file paths by blindly concatenating user input.

This applies to:

- uploads
- downloads
- media replacement
- file deletion
- imports
- exports
- any future filesystem operation

Prefer generated IDs/names rather than user-provided filenames.

---

# 9. SSRF — SERVER-SIDE REQUEST FORGERY

Never allow arbitrary user-provided URLs to be fetched by the server without strict controls.

This applies to future features such as:

- URL previews
- image imports
- webhook testing
- remote media
- metadata fetching
- external API proxies

If server-side URL fetching is ever required:

- use an explicit URL allowlist where possible
- restrict protocols
- validate hostname
- prevent access to internal/private network ranges
- prevent localhost access
- prevent cloud metadata endpoints
- restrict redirects
- restrict response size
- restrict timeouts
- validate final destination

Do not build a generic server-side URL fetcher.

---

# 10. BROKEN PASSWORD RESET

Password reset must never be implemented using insecure tokens or predictable values.

Reset tokens must:

- be cryptographically random
- be sufficiently long
- expire
- be single-use
- be invalidated after successful reset
- not contain the password
- not be predictable
- not be logged

Do not expose whether an email/account exists if that would enable account enumeration.

Never send passwords through email.

After a successful password reset, invalidate relevant existing sessions where appropriate.

---

# 11. WEAK SESSION MANAGEMENT

Admin sessions are security-critical.

Required properties:

- server-side authentication/authorization
- secure session handling
- HTTP-only cookies where cookie sessions are used
- Secure cookies in production
- appropriate SameSite policy
- session expiration
- logout support
- protection against session fixation
- session invalidation after sensitive security events

Do not store admin authentication tokens in insecure browser storage merely for convenience.

Do not rely on:

- localStorage role flags
- sessionStorage role flags
- hidden UI controls
- client-side route protection alone

A hidden admin button is not authorization.

---

# 12. JWT SECRETS

If JWTs are ever used, signing secrets must be:

- cryptographically strong
- randomly generated
- stored only in secure server-side environment variables
- never committed to Git
- never exposed to the browser
- never logged

Never use:

- `secret`
- `password`
- `admin`
- project name
- predictable strings

as JWT secrets.

Prefer the project's approved authentication/session mechanism instead of introducing custom JWT authentication unnecessarily.

---

# 13. PERMISSIVE CORS

CORS must be restrictive.

Do NOT blindly configure:

```text
Access-Control-Allow-Origin: *
```

for authenticated or sensitive endpoints.

Only allow origins that genuinely need access.

Admin APIs should not be broadly accessible cross-origin.

Credentials must never be combined with unsafe wildcard-origin configurations.

CORS is not authentication.

Even with restrictive CORS:

> **Every API must still perform server-side authentication and authorization.**

---

# 14. RATE LIMITS

Rate limiting is mandatory for abuse-prone endpoints.

At minimum consider protection for:

- admin login
- password reset
- contact form
- authentication endpoints
- sensitive admin mutations
- public API endpoints
- webhook processing where appropriate
- expensive server operations
- upload endpoints

Rate limits should be:

- server-side
- appropriate to the operation
- resistant to trivial bypass
- monitored where practical

Do not depend solely on frontend throttling.

---

# 15. EXPOSED ENVIRONMENT VARIABLES

Secrets must never be exposed to the browser.

Sensitive values such as:

- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `BLOB_READ_WRITE_TOKEN`

must remain server-side.

Do NOT prefix secrets with `NEXT_PUBLIC_`.

Only deliberately public values may be exposed to the browser.

Never hardcode production secrets into source code.

Never commit `.env` files containing real secrets.

If a secret is accidentally exposed:

1. revoke/rotate it
2. remove it from active use
3. update the deployment environment
4. investigate exposure
5. do not assume deleting the Git line alone is sufficient

---

# 16. DEFAULT CREDENTIALS

The project's temporary bootstrap admin credentials are:

```text
Username: admin
Password: admin
```

These are **temporary development/bootstrap credentials only**.

Rules:

- password must be securely hashed
- password must never be stored plaintext in MongoDB
- credentials must never be displayed publicly
- credentials must never appear in client-side code
- credentials must never appear in production documentation
- production deployment must require changing the bootstrap password
- production must not silently retain the known default password

The application should strongly encourage or require a secure password change before normal production administration.

Never create additional default accounts.

---

# 17. UNSIGNED WEBHOOKS

Never trust a webhook solely because it reaches the expected endpoint.

Any webhook that can trigger an important action must be authenticated.

Where supported by the provider:

- verify the provider's signature
- use the official verification mechanism
- validate the signing secret
- reject invalid signatures
- reject malformed payloads
- protect against replay where the provider supports timestamps/nonces
- make processing idempotent

Do not accept a client-supplied field such as:

```text
verified: true
```

as proof of webhook authenticity.

---

# 18. FRONTEND PAYMENT CHECKS

If payments are ever added to the project:

> **The frontend must never be the source of truth for payment success.**

Never trust:

- frontend "payment successful" state
- client-side price
- client-side amount
- client-side order status
- client-side transaction status

Payment verification must occur server-side using the payment provider's trusted APIs/webhooks.

The server must independently verify:

- transaction/payment ID
- amount
- currency
- order association
- payment status
- signature/webhook authenticity

Never fulfill a paid action solely because the browser reports success.

This rule applies even if a payment provider's frontend SDK is used.

---

# 19. IDOR / BOLA

Every resource access must verify authorization.

Examples:

```text
/admin/messages/:id
/admin/projects/:id
/admin/skills/:id
/admin/media/:id
```

must not assume that possession of an ID grants access.

For every requested resource:

1. authenticate the actor
2. authorize the actor
3. verify ownership/scope where applicable
4. only then retrieve or mutate the resource

Never rely on MongoDB `_id` secrecy.

Never assume that a random UUID alone provides authorization.

---

# 20. APIs + USER INPUT

Every server endpoint must assume input is malicious.

Validate:

- request body
- query parameters
- path parameters
- headers where relevant
- uploaded files
- URLs
- IDs
- pagination
- sorting/filtering values

Use **Zod** for application input validation.

Reject:

- unexpected structures
- oversized input
- invalid types
- invalid IDs
- impossible values
- unsupported fields
- dangerous combinations

Never pass raw user input directly into:

- database queries
- shell commands
- filesystem operations
- HTML
- SQL
- external URLs
- template engines
- dynamic code execution

Do not expose stack traces to users.

---

# 21. EXPOSED LOGS

Logs must never contain sensitive information.

Never log:

- passwords
- authentication tokens
- session secrets
- API keys
- MongoDB credentials
- Resend API keys
- Turnstile secrets
- reset tokens
- private message contents unless explicitly necessary and approved
- unnecessary personal information

Be especially careful with error logging because server errors can accidentally include request data.

Use structured, minimal logging.

---

# 22. EXPOSED SOURCE MAPS

Production source maps can expose internal source code.

Do not automatically publish source maps publicly if they expose sensitive implementation details.

Production build configuration must intentionally decide whether source maps are:

- disabled publicly
- protected
- uploaded to a private error-monitoring service

Never expose:

- secrets
- credentials
- internal endpoints
- sensitive comments
- private business logic

through publicly accessible source-map files.

---

# 23. ADMIN AUTHORIZATION

Every admin page and mutation must be protected server-side.

Protection must apply to:

- `/admin`
- `/admin/*`
- admin API routes
- server actions
- media operations
- database mutations
- publishing
- revision restoration
- account/security actions

Do not rely only on middleware/UI redirects.

A direct request to an admin endpoint must still be rejected without valid authorization.

---

# 24. AUTHENTICATION ENUMERATION

Authentication-related responses should not unnecessarily reveal whether an account exists.

Avoid responses such as:

> "This email does not exist."

where doing so creates an account-enumeration vulnerability.

Use appropriately generic responses for:

- login failures
- password reset requests
- account lookup
- email verification flows

unless a more specific response is explicitly required and considered safe.

---

# 25. PASSWORD SECURITY

Passwords must be stored using a modern password hashing mechanism provided by the approved authentication system.

Never:

- store plaintext passwords
- encrypt passwords reversibly instead of hashing
- log passwords
- send passwords by email
- place passwords in URLs
- expose passwords through API responses

Require reasonable password strength for production admin credentials.

Do not build custom password hashing if the authentication library already provides a secure implementation.

---

# 26. MONGODB SECURITY

MongoDB Atlas is the source of truth for application data.

Rules:

- database credentials remain server-side
- use least-privilege database credentials
- never connect directly from the browser
- validate all database inputs
- avoid unsafe dynamic query construction
- use appropriate indexes
- do not expose raw database errors
- do not expose internal MongoDB documents unnecessarily
- return only fields required by the client

Do not let users choose arbitrary MongoDB operators or query structures.

---

# 27. CONTACT FORM SECURITY

The contact form is public and therefore must be treated as an attack surface.

Required controls:

1. client-side validation for UX
2. server-side Zod validation
3. Cloudflare Turnstile
4. server-side Turnstile verification
5. rate limiting
6. honeypot where appropriate
7. request-size limits
8. safe rendering of stored content
9. safe email construction
10. MongoDB persistence

Do not put user-controlled values into email HTML without safe encoding.

Never allow a visitor to control arbitrary email headers.

---

# 28. CONTACT FORM EMAIL INJECTION

Never construct email headers from untrusted input.

User-provided values must NOT be able to control:

- `From`
- `To`
- `CC`
- `BCC`
- arbitrary headers

Use a fixed, trusted sender configuration.

Treat visitor email as data, not as an instruction to the mail provider.

---

# 29. TURNSTILE VERIFICATION

Cloudflare Turnstile must be verified server-side.

The browser token alone is not proof of verification.

The server must:

1. receive the Turnstile token
2. send it to the official verification endpoint
3. validate the response
4. reject invalid/expired/failed verification
5. only then continue with the protected operation

Never implement:

```text
if (turnstileTokenExists) allow()
```

Presence of a token is not verification.

---

# 30. RESEND SECURITY

Resend API credentials must remain server-side.

Use a verified sending domain.

Do not allow users to arbitrarily choose the sender address.

Visitor email addresses may be used as reply-to data only where safely configured.

Never expose the Resend API key in:

- browser code
- client bundles
- public environment variables
- logs
- Git

---

# 31. FILE ACCESS AUTHORIZATION

Uploaded private/admin assets must not become publicly accessible simply because their URL is known.

For every media operation determine whether the asset is:

- public
- private
- admin-only

Enforce access accordingly.

Do not expose private files through predictable endpoints.

---

# 32. OPEN REDIRECTS

Do not blindly redirect users to a URL supplied through:

- query parameters
- form fields
- database values
- route parameters

If redirect destinations are configurable:

- use an allowlist
- validate protocol
- prefer internal relative paths
- reject dangerous schemes such as `javascript:`

---

# 33. HTTP SECURITY

Production must use HTTPS.

Apply appropriate security protections including, where compatible with the application:

- secure cookies
- HSTS
- content-type sniffing protection
- frame protection
- referrer policy
- permissions policy
- Content Security Policy where practical

Do not copy security headers blindly.

Test them against:

- authentication
- 3D rendering
- analytics
- Turnstile
- Resend-related flows
- media
- external resources

---

# 34. CONTENT SECURITY POLICY

Where a CSP is implemented, prefer a restrictive policy.

Avoid broad directives such as:

```text
script-src *
```

or unnecessary:

```text
default-src *
```

Only permit trusted origins required by the application.

Any CSP changes must be tested because this application includes:

- Next.js
- Three.js
- Turnstile
- analytics
- external media/services where applicable

---

# 35. INPUT SIZE LIMITS

All public and authenticated endpoints must have reasonable request-size limits.

Especially protect:

- contact form
- admin forms
- media metadata
- JSON payloads
- file uploads

Do not allow attackers to send unnecessarily large payloads to consume resources.

---

# 36. DENIAL-OF-SERVICE CONSIDERATIONS

Avoid operations that can consume disproportionate server resources.

Protect:

- expensive database queries
- large list endpoints
- image processing
- file operations
- 3D asset generation/processing
- external API calls
- email operations
- authentication attempts

Use:

- pagination
- bounded queries
- timeouts
- rate limits
- request-size limits
- appropriate caching
- efficient database indexes

Never expose an unbounded database query endpoint.

---

# 37. DATABASE QUERY SAFETY

Do not allow users to submit arbitrary database operators.

For example, do not blindly accept a client object and use it directly as a MongoDB query/filter.

Explicitly map approved fields:

```text
allowed filter → validated server-side query
```

not:

```text
user input → MongoDB query
```

---

# 38. MASS ASSIGNMENT / OVERPOSTING

Never accept arbitrary database fields from clients.

For admin mutations, define explicit writable fields.

Do not allow a client to submit:

```text
{
  "role": "admin",
  "isPublished": true,
  "createdBy": "someone-else"
}
```

and have the server blindly persist every property.

Server code must explicitly determine which fields may be modified.

---

# 39. SECURITY OF ADMIN CMS

The CMS must enforce:

- authentication
- authorization
- input validation
- safe file uploads
- safe publishing
- audit logging where required
- destructive-action confirmation
- session protection

The admin UI is not a security boundary.

The server is the security boundary.

---

# 40. DRAFT / PUBLISHED DATA SECURITY

Draft content must not leak through:

- public APIs
- page source
- metadata
- search endpoints
- static payloads
- client-side prefetching
- predictable URLs

Only authorized admin users may access draft content.

Public responses must intentionally query published content.

---

# 41. SECRETS IN GIT

Never commit:

- `.env`
- `.env.local`
- production credentials
- API keys
- private keys
- database connection strings
- authentication secrets
- webhook secrets

Use `.env.example` containing placeholders only.

Before deployment, verify repository history and current files do not contain real secrets.

---

# 42. THIRD-PARTY INTEGRATION SECURITY

Every external service must be treated as a separate trust boundary.

Current integrations include:

- MongoDB Atlas
- Resend
- Cloudflare Turnstile
- Vercel Blob
- Vercel

For each integration:

- keep credentials server-side
- validate responses
- handle failures safely
- set timeouts where appropriate
- avoid blindly trusting external data
- avoid leaking third-party errors to users

Do not add a new third-party service without approval when it affects security, privacy, architecture, or data flow.

---

# 43. DEPENDENCY SECURITY

Keep dependencies updated and intentional.

Before adding a dependency:

- verify it is necessary
- check maintenance status
- check known vulnerabilities
- understand permissions/capabilities
- avoid unnecessary packages

Do not install a package simply to solve a trivial problem.

Run appropriate dependency/security checks during development and before production releases.

---

# 44. ERROR HANDLING

Errors shown to users must be safe.

Do not expose:

- stack traces
- filesystem paths
- database connection details
- environment variables
- internal hostnames
- API keys
- query contents
- authentication internals

Provide users with a useful generic error.

Log safe diagnostic information server-side.

---

# 45. SECURITY OF URLs AND ROUTES

Treat route parameters as untrusted input.

Validate:

- slugs
- IDs
- query parameters
- pagination
- filters
- redirect targets

Do not assume that because a value came from a generated link it cannot be manipulated.

---

# 46. REPLAY PROTECTION

For sensitive operations and webhooks where applicable:

- use one-time tokens
- timestamps
- expiration
- idempotency keys
- provider-supported replay protections

An attacker must not be able to repeat a valid sensitive request indefinitely.

---

# 47. IDEMPOTENCY

Operations that can create duplicate side effects should be designed to tolerate retries.

Especially consider:

- contact notification emails
- payment processing if added
- webhook handling
- important admin mutations

Do not allow a network retry to unintentionally create multiple business side effects.

---

# 48. SECURITY OF EMAIL NOTIFICATIONS

Email notifications must not accidentally expose sensitive internal data.

The contact notification should contain only what is necessary.

Never include:

- database credentials
- authentication information
- internal stack traces
- Turnstile secrets
- server environment values

---

# 49. PRIVACY

Collect only data required for the product.

For contact submissions, avoid unnecessary collection of:

- sensitive personal data
- unnecessary device information
- unnecessary tracking identifiers

If abuse detection requires an IP-derived identifier, prefer minimizing/hashing it where appropriate.

Do not expose private visitor information publicly.

---

# 50. LOGGING & AUDIT

Security-relevant events should be auditable where appropriate.

Examples:

- successful admin login
- failed admin login
- logout
- password change
- password reset
- content publish
- content delete/archive
- revision restore
- media changes
- important security setting changes

Audit logs must never contain passwords, tokens, or secrets.

---

# 51. BRUTE-FORCE PROTECTION

Protect authentication against repeated guessing.

Use appropriate:

- rate limiting
- progressive delays where suitable
- temporary lockout or other abuse controls where appropriate
- monitoring of repeated failures

Do not implement permanent lockouts that create an easy denial-of-service vector against legitimate administrators.

---

# 52. SESSION INVALIDATION AFTER SECURITY EVENTS

Where appropriate, invalidate active sessions after:

- password change
- password reset
- security credential rotation
- suspicious authentication event
- account deactivation

The exact behavior should follow the authentication system's secure mechanisms.

---

# 53. CLICKJACKING PROTECTION

Sensitive/admin pages must not be embeddable by untrusted origins.

Use appropriate frame protections.

Do not rely on visual obscurity to protect admin functionality.

---

# 54. SECURE REDIRECTS AFTER AUTHENTICATION

Login and logout flows must not create open redirect vulnerabilities.

If a `returnTo`/redirect parameter is supported:

- validate it
- allow only safe internal destinations or an explicit allowlist
- reject arbitrary external destinations

---

# 55. CACHE SECURITY

Do not cache private/admin responses publicly.

Be careful with:

- authenticated pages
- draft content
- contact messages
- account data
- security pages

Public caching must never accidentally expose private data to another user.

---

# 56. ADMIN MESSAGE SECURITY

Contact messages may contain malicious content.

When displaying a message:

- render it as text
- safely encode it
- never execute HTML from the message
- never automatically follow arbitrary links
- avoid unsafe HTML rendering

Treat the message body as untrusted even though it is stored in MongoDB.

---

# 57. SECURITY OF SEARCH / FILTERING

If admin search/filtering is added:

- validate search strings
- bound result sizes
- paginate
- avoid expensive unindexed queries
- whitelist sortable fields
- whitelist filterable fields

Never allow arbitrary database query syntax from the browser.

---

# 58. SECURITY OF 3D / CLIENT ASSETS

Three.js and other client-side assets must not be given access to secrets.

3D scenes are client code.

Never embed:

- API keys
- private URLs
- database credentials
- secret configuration

inside:

- 3D scene files
- shaders
- JavaScript bundles
- public JSON
- asset metadata

---

# 59. SECURITY OF PUBLIC DATA

Only intentionally public portfolio data may be exposed to visitors.

Never expose:

- admin credentials
- contact message records
- draft content
- private media
- internal activity logs
- revision history
- database IDs unnecessarily
- security configuration
- internal infrastructure details

---

# 60. SECURITY OF SOURCE CODE

Do not expose internal implementation details through:

- debug endpoints
- test routes
- temporary API routes
- verbose errors
- source maps
- development-only pages

Before production deployment, remove or disable development-only functionality.

---

# 61. TESTING SECURITY CONTROLS

Security controls must be tested, not merely implemented.

At minimum test:

### Authentication
- unauthorized admin access rejected
- invalid credentials rejected
- default credential behavior
- logout works
- session expiration works

### Authorization
- non-admin cannot access admin routes
- authenticated non-authorized requests fail
- resource IDs cannot bypass authorization
- draft content cannot be accessed publicly

### Input
- malformed requests rejected
- oversized requests rejected
- unexpected fields rejected
- malicious strings safely rendered

### XSS
Test representative payloads in:

- contact name
- subject
- message
- project content
- profile content

### CSRF
Test state-changing operations from an unauthorized cross-site context where applicable.

### File uploads
Test:

- disallowed extensions
- spoofed MIME types
- oversized files
- malicious filenames
- traversal attempts
- unauthorized access

### Rate limits
Test repeated:

- login attempts
- contact submissions
- sensitive requests

### Webhooks
Test:

- invalid signature
- modified payload
- replay
- malformed payload

### API authorization
Attempt direct requests with manipulated IDs and fields.

---

# 62. SECURITY TEST PAYLOADS

During authorized development/testing, include representative security test cases such as:

```text
<script>alert(1)</script>
```

```text
"><img src=x onerror=alert(1)>
```

```text
../../../../etc/passwd
```

```text
..\..\..\windows\system.ini
```

```text
javascript:alert(1)
```

and malformed/oversized request bodies.

These are testing inputs only and must never appear in production content.

---

# 63. PRODUCTION SECURITY CHECKLIST

Before production deployment:

### Authentication
- [ ] Admin authentication works
- [ ] Default bootstrap password is not retained as an unsafe production credential
- [ ] Password is securely hashed
- [ ] Sessions are secure
- [ ] Logout works
- [ ] Brute-force protection exists

### Authorization
- [ ] Every admin route is protected
- [ ] Every admin mutation is server-authorized
- [ ] IDOR/BOLA tests pass
- [ ] Draft data is protected

### XSS
- [ ] User content is safely rendered
- [ ] No unnecessary raw HTML
- [ ] No unsafe `dangerouslySetInnerHTML`
- [ ] Stored content is treated as untrusted

### CSRF
- [ ] State-changing operations are protected
- [ ] GET does not perform destructive actions

### Uploads
- [ ] File type allowlist exists
- [ ] Size limits exist
- [ ] Filenames are controlled
- [ ] Traversal is prevented
- [ ] Unauthorized file access is blocked

### SSRF
- [ ] No arbitrary server-side URL fetch exists
- [ ] Any approved URL fetching is restricted

### API
- [ ] All inputs validated
- [ ] Unexpected fields rejected
- [ ] Rate limits applied
- [ ] Errors do not leak internals

### Secrets
- [ ] No real secrets in Git
- [ ] No secrets in client bundles
- [ ] No secrets use `NEXT_PUBLIC_`
- [ ] Production environment variables configured securely

### Webhooks
- [ ] Signatures verified
- [ ] Replay protection considered
- [ ] Processing is idempotent

### Logs
- [ ] No passwords
- [ ] No API keys
- [ ] No tokens
- [ ] No database credentials
- [ ] No unnecessary private data

### Source maps
- [ ] Production source-map exposure is intentionally configured
- [ ] No secrets are present in built assets

### Deployment
- [ ] HTTPS enabled
- [ ] Security headers reviewed
- [ ] CORS reviewed
- [ ] Production error handling enabled
- [ ] Development/debug routes disabled

---

# 64. SECURITY INCIDENT RESPONSE

If a security issue is discovered:

1. Stop the affected behavior if necessary.
2. Determine whether sensitive data or credentials were exposed.
3. Rotate compromised secrets immediately.
4. Invalidate affected sessions/tokens where appropriate.
5. Patch the vulnerability.
6. Test the fix.
7. Review logs where available.
8. Determine whether other systems are affected.
9. Document the incident and remediation.

Never leave a known critical vulnerability unfixed simply because the application "works."

---

# 65. SECURITY CHANGE RULE

Any change involving:

- authentication
- authorization
- sessions
- passwords
- database access
- file uploads
- webhooks
- payments
- public APIs
- environment variables
- third-party integrations
- security headers
- CORS
- contact form
- user-generated content

must include a security review before being considered complete.

---

# 66. NO SECURITY BY UI

This is one of the most important rules.

The following are NOT security controls:

- hiding a button
- hiding a page link
- disabling a form field
- checking a role in React
- checking a value in localStorage
- checking a hidden input
- relying on a secret URL
- relying on an unguessable ID
- relying on frontend validation

They may improve UX.

They do not replace server-side security.

---

# 67. NO "TEMPORARY" SECURITY BYPASS

Never introduce:

```text
TODO: add auth later
TODO: validate later
TODO: rate limit later
TODO: secure this later
TODO: verify webhook later
```

for a security-critical production path.

Temporary development shortcuts must be clearly isolated and must not accidentally reach production.

---

# 68. LEAST PRIVILEGE

Every component should receive only the access it needs.

Examples:

- public pages → public published data only
- contact form → create contact message only
- admin → authenticated management operations
- database credentials → only required database permissions
- third-party APIs → only required scopes

Do not grant broad access because it is easier.

---

# 69. FAIL CLOSED

When security verification fails, deny the operation.

Examples:

- authentication failure → deny
- authorization failure → deny
- Turnstile failure → deny
- invalid webhook signature → deny
- invalid file type → deny
- invalid input → deny
- expired token → deny
- unknown resource → deny safely

Never default to:

> "Allow if verification is unavailable."

---

# 70. SECURITY VS CONVENIENCE

When security conflicts with convenience:

> **Security wins.**

When performance conflicts with security:

> **Find a secure performance optimization; never remove the security control simply for speed.**

When visual design conflicts with security:

> **Security wins.**

When AI implementation preference conflicts with security:

> **Security wins.**

---

# 71. ANTIGRAVITY MANDATORY INSTRUCTION

Antigravity must treat this file as a **non-negotiable engineering constraint**.

Before implementing any feature:

1. identify the security boundaries
2. identify trusted vs untrusted data
3. identify authentication requirements
4. identify authorization requirements
5. identify possible abuse cases
6. validate all external input
7. protect secrets
8. handle failures securely
9. test the relevant security controls

Antigravity must NOT:

- skip security because the feature is small
- rely on frontend security
- expose secrets
- trust client-provided authorization
- create unsigned webhooks
- create permissive CORS
- create unrestricted file uploads
- create arbitrary URL fetchers
- store plaintext passwords
- create predictable reset tokens
- expose logs
- expose sensitive source maps
- trust frontend payment confirmation
- trust database IDs as authorization
- blindly persist client fields
- disable security controls to fix a development error without explicit approval

---

# 72. SECURITY DECISION ESCALATION

If Antigravity encounters a security decision that is not explicitly defined:

### Do not guess.

It must:

1. identify the security question
2. explain the risk
3. propose secure options
4. recommend the safest reasonable option
5. request approval when the decision materially changes architecture, privacy, authentication, authorization, or data handling

Never choose a weaker security option merely because it is easier to implement.

---

# 73. SECURITY DEFINITION OF DONE

A feature is security-complete only when:

- [ ] trusted/untrusted boundaries are understood
- [ ] authentication is enforced where required
- [ ] authorization is enforced server-side
- [ ] input is validated
- [ ] output is safely rendered
- [ ] secrets are protected
- [ ] abuse controls are considered
- [ ] errors are safe
- [ ] data access is appropriately scoped
- [ ] relevant attack cases have been tested
- [ ] no known critical security flaw remains
- [ ] documentation is updated when the security architecture changes

---

# 74. FINAL SECURITY COMMANDMENT

> **ASSUME THE CLIENT IS HOSTILE.**
>
> **ASSUME INPUT IS MALICIOUS.**
>
> **ASSUME IDs WILL BE MANIPULATED.**
>
> **ASSUME ENDPOINTS WILL BE CALLED DIRECTLY.**
>
> **ASSUME FILES ARE MALICIOUS.**
>
> **ASSUME WEBHOOKS CAN BE FORGED.**
>
> **ASSUME SECRETS CAN LEAK.**
>
> **ASSUME ATTACKERS WILL READ THE FRONTEND CODE.**
>
> **VERIFY EVERYTHING SECURITY-CRITICAL ON THE SERVER.**
>
> **FAIL CLOSED.**
>
> **NEVER TRADE SECURITY FOR CONVENIENCE.**

---

## FINAL INSTRUCTION

**Build this application as if the public internet is actively trying to break it.**

Security must be implemented deliberately at every trust boundary.

No random security shortcuts.

No frontend-only protections.

No plaintext credentials.

No exposed secrets.

No unrestricted uploads.

No unsigned sensitive webhooks.

No insecure sessions.

No permissive access controls.

No trusting client-side payment state.

No IDOR/BOLA.

No unsafe user-input handling.

No exposed logs.

No careless source maps.

No security control may be silently removed or weakened.

> **If a secure implementation is uncertain, STOP and ASK rather than guessing.**

## End of Security Constitution
