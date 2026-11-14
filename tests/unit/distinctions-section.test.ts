import { describe, it, expect, beforeEach } from "vitest";
import {
  getLatestPublishedCertifications,
  getPublishedCertifications,
  getDistinctionMetrics,
  getPublishedDistinctionsSection,
} from "@/lib/server/db/repositories/content";
import { getStore } from "@/lib/server/db/store";
import {
  certificationMutationSchema,
  distinctionsSectionConfigSchema,
} from "@/lib/validations/models";
import type { CertificationDocument, AchievementDocument } from "@/types/models";

describe("Verified Distinctions Section System", () => {
  beforeEach(() => {
    const store = getStore();
    // Reset certifications to known state: A, B, C, D
    store.certifications = [
      {
        id: "cert-a",
        _id: "cert-a",
        name: "Certification A",
        title: "Certification A",
        issuer: "Issuer A",
        date: "2025-04",
        issueDate: "2025-04",
        credentialId: "ID-A",
        credentialUrl: "https://example.com/a",
        verificationUrl: "https://example.com/a",
        tags: ["TagA"],
        featured: false,
        order: 1,
        status: "published",
        createdAt: new Date("2025-04-01T00:00:00Z"),
        updatedAt: new Date("2025-04-01T00:00:00Z"),
      },
      {
        id: "cert-b",
        _id: "cert-b",
        name: "Certification B",
        title: "Certification B",
        issuer: "Issuer B",
        date: "2025-03",
        issueDate: "2025-03",
        credentialId: "ID-B",
        credentialUrl: "https://example.com/b",
        verificationUrl: "https://example.com/b",
        tags: ["TagB"],
        featured: false,
        order: 2,
        status: "published",
        createdAt: new Date("2025-03-01T00:00:00Z"),
        updatedAt: new Date("2025-03-01T00:00:00Z"),
      },
      {
        id: "cert-c",
        _id: "cert-c",
        name: "Certification C",
        title: "Certification C",
        issuer: "Issuer C",
        date: "2025-02",
        issueDate: "2025-02",
        credentialId: "ID-C",
        credentialUrl: "https://example.com/c",
        verificationUrl: "https://example.com/c",
        tags: ["TagC"],
        featured: false,
        order: 3,
        status: "published",
        createdAt: new Date("2025-02-01T00:00:00Z"),
        updatedAt: new Date("2025-02-01T00:00:00Z"),
      },
      {
        id: "cert-d",
        _id: "cert-d",
        name: "Certification D",
        title: "Certification D",
        issuer: "Issuer D",
        date: "2025-01",
        issueDate: "2025-01",
        credentialId: "ID-D",
        credentialUrl: "https://example.com/d",
        verificationUrl: "https://example.com/d",
        tags: ["TagD"],
        featured: false,
        order: 4,
        status: "published",
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
      },
    ];

    // Reset achievements to two published rank records
    store.achievements = [
      {
        id: "ach-1",
        _id: "ach-1",
        title: "Prompt Engineering – 1st Rank",
        organization: "Ajeenkya DY Patil University",
        rank: "1st Rank",
        date: "2025",
        description: "Secured 1st rank",
        featured: true,
        order: 1,
        status: "published",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ach-2",
        _id: "ach-2",
        title: "Prompt Engineering – 2nd Rank",
        organization: "Technovanza 2025, ADYPSOE",
        rank: "2nd Rank",
        date: "2025",
        description: "Achieved 2nd rank",
        featured: true,
        order: 2,
        status: "published",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  });

  // TEST A: Published certifications: A, B, C, D -> Home: A, B; Certifications: A, B, C, D
  it("TEST A: Home displays exactly latest 2 published records [A, B] and Certifications page displays all [A, B, C, D]", async () => {
    const home = await getLatestPublishedCertifications(2);
    expect(home.length).toBe(2);
    expect(home[0].id).toBe("cert-a");
    expect(home[1].id).toBe("cert-b");

    const all = await getPublishedCertifications();
    expect(all.length).toBe(4);
    expect(all.map((c) => c.id)).toEqual(["cert-a", "cert-b", "cert-c", "cert-d"]);
  });

  // TEST B: Publish E -> Home becomes [E, A]; Certifications becomes [E, A, B, C, D]
  it("TEST B: Publishing E with newer date shifts Home to [E, A] and Certifications to [E, A, B, C, D]", async () => {
    const store = getStore();
    const certE: CertificationDocument = {
      id: "cert-e",
      _id: "cert-e",
      name: "Certification E",
      title: "Certification E",
      issuer: "Issuer E",
      date: "2025-05",
      issueDate: "2025-05",
      credentialId: "ID-E",
      credentialUrl: "https://example.com/e",
      verificationUrl: "https://example.com/e",
      tags: ["TagE"],
      featured: false,
      order: 0,
      status: "published",
      createdAt: new Date("2025-05-01T00:00:00Z"),
      updatedAt: new Date("2025-05-01T00:00:00Z"),
    };
    store.certifications.push(certE);

    const home = await getLatestPublishedCertifications(2);
    expect(home.length).toBe(2);
    expect(home[0].id).toBe("cert-e");
    expect(home[1].id).toBe("cert-a");

    const all = await getPublishedCertifications();
    expect(all.map((c) => c.id)).toEqual(["cert-e", "cert-a", "cert-b", "cert-c", "cert-d"]);
  });

  // TEST C: Publish F -> Home becomes [F, E]; Certifications becomes [F, E, A, B, C, D]
  it("TEST C: Publishing F shifts Home to [F, E] and Certifications to [F, E, A, B, C, D]", async () => {
    const store = getStore();
    const certE: CertificationDocument = {
      id: "cert-e",
      _id: "cert-e",
      name: "Certification E",
      title: "Certification E",
      issuer: "Issuer E",
      date: "2025-05",
      issueDate: "2025-05",
      credentialId: "ID-E",
      credentialUrl: "https://example.com/e",
      verificationUrl: "https://example.com/e",
      tags: ["TagE"],
      featured: false,
      order: 0,
      status: "published",
      createdAt: new Date("2025-05-01T00:00:00Z"),
      updatedAt: new Date("2025-05-01T00:00:00Z"),
    };
    const certF: CertificationDocument = {
      id: "cert-f",
      _id: "cert-f",
      name: "Certification F",
      title: "Certification F",
      issuer: "Issuer F",
      date: "2025-06",
      issueDate: "2025-06",
      credentialId: "ID-F",
      credentialUrl: "https://example.com/f",
      verificationUrl: "https://example.com/f",
      tags: ["TagF"],
      featured: false,
      order: 0,
      status: "published",
      createdAt: new Date("2025-06-01T00:00:00Z"),
      updatedAt: new Date("2025-06-01T00:00:00Z"),
    };
    store.certifications.push(certE, certF);

    const home = await getLatestPublishedCertifications(2);
    expect(home.length).toBe(2);
    expect(home[0].id).toBe("cert-f");
    expect(home[1].id).toBe("cert-e");

    const all = await getPublishedCertifications();
    expect(all.map((c) => c.id)).toEqual(["cert-f", "cert-e", "cert-a", "cert-b", "cert-c", "cert-d"]);
  });

  // TEST D: Archive F -> Home falls back to [E, A]
  it("TEST D: Archiving F immediately causes Home to fall back to [E, A]", async () => {
    const store = getStore();
    const certE: CertificationDocument = {
      id: "cert-e",
      _id: "cert-e",
      name: "Certification E",
      title: "Certification E",
      issuer: "Issuer E",
      date: "2025-05",
      issueDate: "2025-05",
      credentialId: "ID-E",
      credentialUrl: "https://example.com/e",
      verificationUrl: "https://example.com/e",
      tags: ["TagE"],
      featured: false,
      order: 0,
      status: "published",
      createdAt: new Date("2025-05-01T00:00:00Z"),
      updatedAt: new Date("2025-05-01T00:00:00Z"),
    };
    const certF: CertificationDocument = {
      id: "cert-f",
      _id: "cert-f",
      name: "Certification F",
      title: "Certification F",
      issuer: "Issuer F",
      date: "2025-06",
      issueDate: "2025-06",
      credentialId: "ID-F",
      credentialUrl: "https://example.com/f",
      verificationUrl: "https://example.com/f",
      tags: ["TagF"],
      featured: false,
      order: 0,
      status: "archived", // ARCHIVED
      createdAt: new Date("2025-06-01T00:00:00Z"),
      updatedAt: new Date("2025-06-01T00:00:00Z"),
    };
    store.certifications.push(certE, certF);

    const home = await getLatestPublishedCertifications(2);
    expect(home.length).toBe(2);
    expect(home[0].id).toBe("cert-e");
    expect(home[1].id).toBe("cert-a");

    const all = await getPublishedCertifications();
    expect(all.map((c) => c.id)).toEqual(["cert-e", "cert-a", "cert-b", "cert-c", "cert-d"]);
  });

  // TEST E & METRIC TESTING: Dynamic metrics calculation
  it("TEST E: Calculates dynamic metrics without any hardcoded values", async () => {
    const metrics = await getDistinctionMetrics();
    // 2 qualifying rank records in achievements
    expect(metrics.ranksCount).toBe(2);
    // 4 published certifications
    expect(metrics.certificationsCount).toBe(4);
    // All 4 have credential IDs / URLs -> 100%
    expect(metrics.verifiedPercentage).toBe(100);
  });

  it("Recalculates metrics when qualifying ranks are added or archived", async () => {
    const store = getStore();

    // Add a 3rd qualifying rank award
    const ach3: AchievementDocument = {
      id: "ach-3",
      _id: "ach-3",
      title: "National AI Hackathon – 3rd Rank",
      organization: "National Tech Summit",
      rank: "3rd Rank",
      date: "2025",
      description: "Secured 3rd rank",
      featured: true,
      order: 3,
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.achievements.push(ach3);

    let metrics = await getDistinctionMetrics();
    expect(metrics.ranksCount).toBe(3);

    // Archive the 3rd rank
    ach3.status = "archived";
    metrics = await getDistinctionMetrics();
    expect(metrics.ranksCount).toBe(2);
  });

  it("Recalculates verification percentage when an unverified certification is added", async () => {
    const store = getStore();

    // 4 existing are verified. Add a 5th unverified certification
    const unverifiedCert: CertificationDocument = {
      id: "cert-unverified",
      _id: "cert-unverified",
      name: "Unverified Workshop",
      title: "Unverified Workshop",
      issuer: "Local Workshop",
      date: "2025-06",
      issueDate: "2025-06",
      // No credentialId, credentialUrl, or verificationUrl
      featured: false,
      order: 5,
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.certifications.push(unverifiedCert);

    const metrics = await getDistinctionMetrics();
    expect(metrics.certificationsCount).toBe(5);
    // 4 verified out of 5 = 80%
    expect(metrics.verifiedPercentage).toBe(80);
  });

  it("Validates certification mutations strictly with Zod", () => {
    const valid = certificationMutationSchema.safeParse({
      name: "AWS Certified Developer",
      title: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      credentialType: "certification",
      date: "2025-03",
      issueDate: "2025-03",
      credentialId: "AWS-DEV-9921",
      credentialUrl: "https://aws.amazon.com/verify/123",
      verificationUrl: "https://aws.amazon.com/verify/123",
      tags: ["Cloud", "AWS"],
      order: 1,
      status: "published",
    });
    expect(valid.success).toBe(true);

    const invalid = certificationMutationSchema.safeParse({
      name: "", // Too short
      issuer: "",
      date: "",
    });
    expect(invalid.success).toBe(false);
  });

  it("Validates section settings mutations strictly with Zod", () => {
    const valid = distinctionsSectionConfigSchema.safeParse({
      enabled: true,
      eyebrow: "VERIFIED DISTINCTIONS",
      titlePrimary: "Verified",
      titleAccent: "Distinctions",
      description: "1st & 2nd Rank University Awards in Prompt Engineering.",
      sectionIcon: "award",
      decorativeVisual: {
        enabled: true,
        position: "top-right",
        mobileVisibility: "show",
        opacityPreset: "medium",
        accentVariant: "gold",
      },
      metrics: {
        ranksLabel: "University Ranks",
        ranksSubtext: "Prompt Engineering",
        certificationsLabel: "Certifications",
        certificationsSubtext: "NxtWave & More",
        verifiedLabel: "Verified",
        verifiedSubtext: "Authentic Credentials",
      },
      cta: {
        enabled: true,
        text: "View Honors & Certifications",
        destination: "/certifications",
      },
    });
    expect(valid.success).toBe(true);
  });

  it("Fetches published distinctions section configuration with fallback defaults", async () => {
    const config = await getPublishedDistinctionsSection();
    expect(config.enabled).toBe(true);
    expect(config.eyebrow).toBe("VERIFIED DISTINCTIONS");
    expect(config.titlePrimary).toBe("Verified");
    expect(config.titleAccent).toBe("Distinctions");
    expect(config.metrics.ranksLabel).toBe("University Ranks");
  });
});
