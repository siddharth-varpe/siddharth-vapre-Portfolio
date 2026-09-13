# Design System Specification — Dark Systems / Technical Editorial

## Overview
This document serves as the **VISUAL SOURCE OF TRUTH** for the Siddharth Varpe personal portfolio across all current and future phases. Future phases MUST build upon this visual language rather than inventing new styles.

---

## 1. Locked Visual Direction: Dark Systems / Technical Editorial
The visual identity represents a combination of:
- **Premium software engineering studio**
- **Technical editorial publication**
- **Personal engineering identity**
- **Systems-oriented visual environment**
- **Sophisticated digital portfolio**

### Atmospheric Attributes:
- **Tone**: Intentional, architectural, editorial, premium, calm, confident, technically intelligent, distinctive.
- **Prohibited Clichés**: No SaaS marketing templates, no startup kits, no dashboard clones, no resume templates, no cyberpunk gimmicks, no generic AI glowing brains/nodes/floating cubes, and no card-soup layouts.

---

## 2. Locked Core Principles

1. **Dark Systems / Technical Editorial**: Deep graphite canvas with warm off-white editorial typography and controlled electric-blue accents.
2. **Wide, Immersive Desktop Canvas**: Global container expanded to `max-w-screen-2xl` (1536px) with fluid responsive horizontal margins (`px-4 sm:px-6 lg:px-8 xl:px-12`). Desktop uses the viewport deliberately; content never floats in empty space.
3. **Controlled Typography Measure**: Primary headlines dominate, while body text measure is strictly constrained (`max-w-2xl` / `max-w-3xl`) for optimal reading measure.
4. **Asymmetric Editorial Composition**: One-piece cohesive compositions rather than disjointed, conventional 2-column blocks.
5. **Future Professional Image Slot**:
   - No raw, unedited user photos.
   - No AI-generated fake portraits.
   - No generic profile cards or gray avatar boxes.
   - Hero is architected around an integrated visual zone with ambient electric-blue depth, registration crosshairs (`+`), technical datum coordinates, and bottom/side dissolves ready to receive the user's final professional asset.
6. **Card Reduction (Eliminating "Card Soup")**:
   - Fewer, stronger structures.
   - Open editorial layouts, asymmetric structures, hairline dividers, and purposeful whitespace over repetitive border boxes.
7. **Controlled Electric Blue Accent**:
   - Electric blue (`#3b82f6` / `#2563eb`) serves as a precise engineering accent, not a neon or rainbow wash.
8. **Subtle Technical Grid**:
   - 32px hairline grid (`bg-grid-technical`) provides architectural structure, alignment, and rhythm without overpowering readability.
9. **No Fake Telemetry / Content Authenticity**:
   - Absolutely zero synthetic latency, fake uptime, fake transactions, or fabricated system stats.
   - All numbers represent verified resume and project evidence (e.g. 2,000–3,000+ CRM records, 10,000+ transactions, ~90% retrieval speedup, 65–75% manual ops reduced, 1st & 2nd Rank Prompt Engineering).
10. **Data-Driven CMS Integration**:
    - All variable content stays connected to the MongoDB database repositories.
11. **Mobile-First Composition**:
    - Dedicated mobile editorial flow: Identity → Name → Headline → Narrative → CTAs → Future Visual Aperture → Proof/Metrics.
12. **Future 3D Compatibility**:
    - Architectural negative space and depth layers leave room for Phase 11 purposeful 3D systems without requiring a layout overhaul.

---

## 3. Design Tokens

### Color System
| Token | Value | Semantic Purpose |
|---|---|---|
| `--color-background` | `#09090b` | Near-black / graphite background canvas |
| `--color-surface` | `#121215` | Elevated editorial surface |
| `--color-surface-muted` | `#18181b` | Secondary panel / input background |
| `--color-surface-subtle` | `#202024` | Subtle chips and datum tags |
| `--color-surface-hover` | `#27272a` | Interactive hover state |
| `--color-border` | `#27272a` | Hairline structural divider |
| `--color-border-hover` | `#3f3f46` | Active / hover border |
| `--color-border-emphasized` | `#52525b` | Emphasized focus border |
| `--color-foreground` | `#fafafa` | Primary text and editorial display headings |
| `--color-foreground-secondary` | `#d4d4d8` | Body text and editorial descriptions |
| `--color-foreground-muted` | `#a1a1aa` | Monospace subtext and secondary labels |
| `--color-foreground-subtle` | `#71717a` | Technical datum coordinates and timestamps |
| `--color-accent` | `#3b82f6` | Controlled electric blue accent |
| `--color-accent-hover` | `#2563eb` | Electric blue hover state |
| `--color-accent-subtle` | `rgba(59, 130, 246, 0.1)` | Subtle accent highlight |
| `--color-accent-glow` | `rgba(59, 130, 246, 0.25)` | Atmospheric ambient depth glow |

### Semantic State Colors
- **Success / Available**: `#10b981` (emerald dot & badges)
- **Warning**: `#f59e0b` (amber)
- **Error**: `#ef4444` (red)
- **Info**: `#3b82f6` (blue)

---

## 4. Typography Hierarchy
Powered by Next.js Google Fonts (`Geist` & `Geist Mono`):
- **Headline Display**: `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05]`
- **Section Eyebrow**: `font-mono text-xs font-semibold uppercase tracking-widest text-accent`
- **Section Title**: `text-2xl sm:text-3xl font-bold tracking-tight text-foreground`
- **Body Text**: `text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal`
- **Evidence / Metric Number**: `font-mono text-4xl sm:text-5xl font-bold tracking-tight text-foreground`
- **Technical Datum / Label**: `font-mono text-xs uppercase tracking-wider text-foreground-muted`

---

## 5. Layout Primitives
- **`Container size="public"`**: `max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12`
- **`Container size="reading"`**: `max-w-3xl mx-auto px-4 sm:px-6 lg:px-8`
- **`Container size="admin"`**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

---

## 6. Accessibility & Security Gates
- **WCAG AA Compliance**: High contrast against dark graphite canvas.
- **Keyboard & Focus**: Visible focus rings (`focus-visible:ring-2 focus-visible:ring-accent`).
- **Touch Targets**: Minimum 44x44px for touch interactions.
- **Reduced Motion**: Respects `prefers-reduced-motion`.
- **Security**: Strict input sanitation, no untrusted script/HTML execution, protected admin routes.

- **Mobile First**: Layouts adapt gracefully down to 375px viewports with zero horizontal overflow.
