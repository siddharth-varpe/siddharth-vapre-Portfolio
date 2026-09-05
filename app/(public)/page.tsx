import {
  Container,
  DisplayHeadline,
  SectionHeader,
  CardTitle,
  BodyText,
  Subtext,
  TechnicalLabel,
  MonoText,
  Button,
  Link,
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Metric,
  MetadataList,
  MetadataItem,
  Label,
  Input,
  Textarea,
  Select,
  Checkbox,
  FormHelperText,
  StatusIndicator,
} from "@/components/ui";

/**
 * Phase 2 Design System Verification View.
 * Renders neutral structural demonstrations of all UI primitives to validate
 * visual hierarchy, responsive behavior, contrast, and accessibility.
 */
export default function HomePage() {
  return (
    <main className="py-12 sm:py-16 bg-grid-technical min-h-screen">
      <Container size="public" className="space-y-16">
        {/* Phase Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <TechnicalLabel>Phase 2 — Design System & Visual Foundation</TechnicalLabel>
          <DisplayHeadline>Technical Editorial System</DisplayHeadline>
          <BodyText className="max-w-2xl text-lg">
            A restrained, high-contrast visual architecture designed for engineering credibility.
            Near-black surfaces, warm off-white typography, and controlled electric-blue accents.
          </BodyText>
        </div>

        {/* 1. Typography Hierarchy */}
        <section aria-labelledby="typography-heading" className="space-y-6">
          <SectionHeader
            eyebrow="Foundations"
            title="Typography Hierarchy"
            description="Editorial and monospace type scales using Geist and Geist Mono."
          />
          <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
            <div>
              <TechnicalLabel>Display Headline</TechnicalLabel>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1">
                Engineering Scalable Systems
              </p>
            </div>
            <div>
              <TechnicalLabel>Card / Item Title</TechnicalLabel>
              <CardTitle className="mt-1">Architectural Verification & Proof-of-Work</CardTitle>
            </div>
            <div>
              <TechnicalLabel>Body Text</TechnicalLabel>
              <BodyText className="mt-1">
                This foundation provides intentional visual contrast without relying on trend-driven visual effects,
                unnecessary gradients, or decorative glassmorphism.
              </BodyText>
            </div>
            <div>
              <TechnicalLabel>Technical Monospace Metadata</TechnicalLabel>
              <p className="mt-1">
                <MonoText>SYS_STATUS: OPTIMAL | LATENCY: 12ms | REGION: us-east-1</MonoText>
              </p>
            </div>
          </div>
        </section>

        {/* 2. Interactive Primitives: Buttons & Links */}
        <section aria-labelledby="interactive-heading" className="space-y-6">
          <SectionHeader
            eyebrow="Interactive"
            title="Buttons & Navigation Links"
            description="Accessible touch targets, visible focus rings, and purposeful hover responses."
          />
          <div className="rounded-lg border border-border bg-surface p-6 space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="destructive">Destructive Action</Button>
              <Button variant="primary" isLoading>Loading State</Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50 text-sm">
              <Link href="/" variant="default">Default Link</Link>
              <Link href="/" variant="accent">Accent Link</Link>
              <Link href="https://example.com" isExternal showExternalIcon variant="subtle">
                External Resource
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Proof-of-Work Metrics */}
        <section aria-labelledby="metrics-heading" className="space-y-6">
          <SectionHeader
            eyebrow="Evidence"
            title="Quantitative Metrics"
            description="Reusable numeric presentation primitives designed for measurable outcomes."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Metric
              value="99.99%"
              label="Availability Target"
              description="System uptime across production services."
            />
            <Metric
              value="< 45ms"
              label="Median Latency"
              description="Cold-start and response time benchmark."
            />
            <Metric
              value="100%"
              label="Type Safety"
              description="Strict TypeScript across client and server boundaries."
            />
          </div>
        </section>

        {/* 4. Badges & Semantic Status Indicators */}
        <section aria-labelledby="badges-heading" className="space-y-6">
          <SectionHeader
            eyebrow="Taxonomy"
            title="Badges & Status Indicators"
            description="Monospace category tags and non-color-reliant semantic state indicators."
          />
          <div className="rounded-lg border border-border bg-surface p-6 space-y-6">
            <div className="space-y-2">
              <Subtext>Technical Badges:</Subtext>
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral">TypeScript</Badge>
                <Badge variant="accent">Next.js App Router</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="success">Verified</Badge>
                <Badge variant="warning">In Review</Badge>
                <Badge variant="error">Deprecated</Badge>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-border/50">
              <Subtext>Semantic Status Indicators (Dot + Label):</Subtext>
              <div className="flex flex-wrap gap-3">
                <StatusIndicator status="published" />
                <StatusIndicator status="draft" />
                <StatusIndicator status="archived" />
                <StatusIndicator status="error" label="Failed Build" />
                <StatusIndicator status="info" label="System Active" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Surface Cards & Technical Metadata */}
        <section aria-labelledby="cards-heading" className="space-y-6">
          <SectionHeader
            eyebrow="Containers"
            title="Card Architecture & Metadata"
            description="Restrained grouping with 1px borders and technical property lists."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <TechnicalLabel>Architecture Module</TechnicalLabel>
                  <StatusIndicator status="published" label="Approved" />
                </div>
                <CardTitle className="mt-2">Distributed Pipeline Core</CardTitle>
                <CardDescription>
                  Demonstration card showing content grouping with structured technical metadata.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetadataList direction="horizontal">
                  <MetadataItem label="Role" value="Lead Engineer" />
                  <MetadataItem label="Timeline" value="Phase 2" />
                  <MetadataItem label="Target" value="Production" />
                </MetadataList>
              </CardContent>
              <CardFooter>
                <MonoText>VER_HASH: 57dfad6</MonoText>
                <Button size="sm" variant="outline">Inspect Details</Button>
              </CardFooter>
            </Card>

            <Card hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <TechnicalLabel>Security Boundary</TechnicalLabel>
                  <StatusIndicator status="success" label="Enforced" />
                </div>
                <CardTitle className="mt-2">Server-Only Isolation</CardTitle>
                <CardDescription>
                  Verification that credentials, data abstractions, and mutations remain strictly server-side.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetadataList direction="horizontal">
                  <MetadataItem label="Boundary" value="lib/server/*" />
                  <MetadataItem label="Validation" value="Zod Schema" />
                  <MetadataItem label="Status" value="Compliant" />
                </MetadataList>
              </CardContent>
              <CardFooter>
                <MonoText>POLICY: SECURITY.md</MonoText>
                <Button size="sm" variant="outline">View Policy</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 6. Form Controls */}
        <section aria-labelledby="forms-heading" className="space-y-6">
          <SectionHeader
            eyebrow="Forms"
            title="Accessible Form Controls"
            description="High-contrast inputs with visible focus rings and accessible label associations."
          />
          <div className="rounded-lg border border-border bg-surface p-6">
            <form className="max-w-xl space-y-4">
              <div>
                <Label htmlFor="sample-name" required>Representative Input Field</Label>
                <Input id="sample-name" placeholder="Enter identifier or value..." />
                <FormHelperText>Visible focus state and dark surface contrast.</FormHelperText>
              </div>

              <div>
                <Label htmlFor="sample-select">Selection Control</Label>
                <Select id="sample-select" defaultValue="option-1">
                  <option value="option-1">Option One — Technical Editorial</option>
                  <option value="option-2">Option Two — Dark Systems</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="sample-textarea">Description Area</Label>
                <Textarea id="sample-textarea" placeholder="Multi-line technical description..." rows={3} />
              </div>

              <div>
                <Checkbox id="sample-checkbox" label="Confirm design token compliance" defaultChecked />
              </div>
            </form>
          </div>
        </section>
      </Container>
    </main>
  );
}
