# Design System Specification — Dark Systems / Technical Editorial

## Overview
This document defines the centralized design tokens, typography scale, spacing rules, and reusable UI primitives established for the Siddharth Varpe personal portfolio.

---

## 1. Approved Direction: Dark Systems / Technical Editorial
The aesthetic channels a high-end software engineering studio and technical publication:
- **Surface**: Deep near-black / graphite surfaces.
- **Typography**: Warm off-white editorial hierarchy with monospace technical metadata.
- **Accent**: Controlled electric blue (`#3b82f6`), applied with restraint.
- **Line Language**: Fine hairline borders (`1px solid #27272a`) and subtle 32px technical grid pattern.
- **Elevation**: Flat to low-depth, avoiding excessive blur or glow.

---

## 2. Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `--color-background` | `#09090b` | Core background canvas |
| `--color-surface` | `#121215` | Elevated surface for cards and panels |
| `--color-surface-muted` | `#18181b` | Input backgrounds and nested containers |
| `--color-surface-subtle` | `#202024` | Subtle chips and secondary surfaces |
| `--color-surface-hover` | `#27272a` | Hover states |
| `--color-border` | `#27272a` | Default hairline border |
| `--color-border-hover` | `#3f3f46` | Active / hover border |
| `--color-border-emphasized` | `#52525b` | Focus and emphasized border |
| `--color-foreground` | `#fafafa` | Primary text and headings |
| `--color-foreground-secondary` | `#d4d4d8` | Body text and editorial descriptions |
| `--color-foreground-muted` | `#a1a1aa` | Subtext and secondary labels |
| `--color-foreground-subtle` | `#71717a` | Timestamps and micro-labels |
| `--color-accent` | `#3b82f6` | Controlled electric-blue primary accent |
| `--color-accent-hover` | `#2563eb` | Hover state for accent buttons and links |
| `--color-accent-subtle` | `rgba(59, 130, 246, 0.1)` | Accent badge background |

### Semantic Colors
- **Success**: `#10b981` (green)
- **Warning**: `#f59e0b` (amber)
- **Error**: `#ef4444` (red)
- **Info**: `#3b82f6` (blue)

---

## 3. Typography Scale
Powered by Next.js Google Fonts:
- **Primary / Sans**: `Geist` (`var(--font-geist-sans)`)
- **Technical / Monospace**: `Geist Mono` (`var(--font-geist-mono)`)

| Primitive | Tag | Styles |
|---|---|---|
| `DisplayHeadline` | `h1` | `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground` |
| `PageTitle` | `h1` | `text-3xl sm:text-4xl font-semibold tracking-tight text-foreground` |
| `SectionTitle` | `h2` | `text-2xl sm:text-3xl font-semibold tracking-tight text-foreground` |
| `CardTitle` | `h3` | `text-lg sm:text-xl font-medium tracking-tight text-foreground` |
| `BodyText` | `p` | `text-base text-foreground-secondary leading-relaxed` |
| `Subtext` | `p` | `text-sm text-foreground-muted leading-normal` |
| `TechnicalLabel` | `span` | `font-mono text-xs font-medium uppercase tracking-widest text-accent` |
| `MonoText` | `span` | `font-mono text-xs sm:text-sm text-foreground-muted` |

---

## 4. Reusable UI Primitives (`components/ui/`)

1. **`Container`**:
   - `size="public"` (`max-w-6xl`): standard portfolio layout width.
   - `size="reading"` (`max-w-3xl`): optimized for editorial case studies and text.
   - `size="admin"` (`max-w-7xl`): operational CMS dashboard width.
   - Responsive horizontal padding: `px-4 sm:px-6 lg:px-8`.
2. **`Button`**:
   - Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`.
   - Sizes: `sm`, `md`, `lg`.
   - States: `disabled`, `isLoading` (accessible spinner), electric blue focus rings.
3. **`Link`**:
   - Handles internal (`next/link`) and external links (`rel="noopener noreferrer"` with optional arrow icon).
4. **`Card`**:
   - Surface container with restrained 1px border. Subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
5. **`Badge`**:
   - Monospace technical tags. Variants: `neutral`, `accent`, `outline`, `success`, `warning`, `error`.
6. **`Metric`**:
   - Proof-of-work quantitative display with primary number, label, and supporting context.
7. **`SectionHeader`**:
   - Eyebrow category + title + description + optional right-aligned action.
8. **`MetadataList` & `MetadataItem`**:
   - Key-value technical specifications for projects, dates, roles, and tech stacks.
9. **`FormControls`**:
   - Accessible `Input`, `Textarea`, `Select`, `Checkbox`, `Label`, `FormHelperText`, `FormErrorText`.
10. **`StatusIndicator`**:
    - Accessible semantic state with color dot + explicit text label.
11. **`Navigation`**:
    - `NavContainer`, `NavLink` with active indicator, `MobileNavShell`.

---

## 5. Accessibility & Responsive Rules
- **Contrast**: Text elements meet WCAG AA contrast against near-black surfaces.
- **Focus States**: All interactive elements feature visible focus rings (`focus-visible:ring-2 focus-visible:ring-accent`).
- **Touch Targets**: Standard buttons and interactive elements maintain >= 44px min-height for touch screen usability.
- **Mobile First**: Layouts adapt gracefully down to 375px viewports with zero horizontal overflow.
