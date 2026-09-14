/**
 * Automated Supabase PostgreSQL Seed & Migration Script
 * =============================================================================
 * Connects to Supabase PostgreSQL using server-side privileged credentials
 * and populates all 13 core portfolio collections with authentic seed data.
 *
 * Usage:
 *   pnpm tsx scripts/migrate-and-seed-supabase.ts
 * =============================================================================
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// Load .env.local if present
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ ERROR: Missing Supabase credentials in environment.");
  console.error("Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function main() {
  console.log("🚀 Starting Supabase Database Migration & Seeding...");
  console.log(`📡 Connecting to Supabase at: ${supabaseUrl}`);

  // Test connection
  const { error: pingError } = await supabase.from("profiles").select("id").limit(1);
  if (pingError) {
    console.warn(`⚠️ Note on initial ping: ${pingError.message}`);
    console.log("ℹ️ If tables are not yet created, execute migrations in supabase/migrations/ in your Supabase SQL editor.");
  } else {
    console.log("✅ Supabase connection verified successfully.");
  }

  // Read authentic seed data
  const seedPath = path.resolve(process.cwd(), "data/portfolio-seed-data.json");
  if (!fs.existsSync(seedPath)) {
    console.error(`❌ Seed file not found at ${seedPath}`);
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
  console.log("📦 Authentic seed data loaded from data/portfolio-seed-data.json");

  // 1. Profile
  if (seedData.profile) {
    const p = seedData.profile;
    const { error } = await supabase.from("profiles").upsert({
      id: p.id || p._id || "profile_default",
      name: p.name,
      title: p.title,
      summary: p.summary,
      location: p.location,
      email: p.email,
      phone: p.phone || null,
      photo_url: p.photoUrl || null,
      avatar_url: p.avatarUrl || null,
      availability: p.availability || "available",
      tagline: p.tagline || "",
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("❌ Failed to seed profile:", error.message);
    else console.log("✅ Seeded profile successfully.");
  }

  // 2. Hero
  if (seedData.hero) {
    const h = seedData.hero;
    const { error } = await supabase.from("heroes").upsert({
      id: h.id || h._id || "hero_default",
      eyebrow: h.eyebrow,
      name: h.name,
      headline: h.headline,
      description: h.description,
      cta_label: h.ctaLabel,
      cta_url: h.ctaUrl,
      supporting_text: h.supportingText || null,
      status: h.status || "published",
      created_at: h.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("❌ Failed to seed hero:", error.message);
    else console.log("✅ Seeded hero section successfully.");
  }

  // 3. About
  if (seedData.about) {
    const a = seedData.about;
    const { error } = await supabase.from("abouts").upsert({
      id: a.id || a._id || "about_default",
      title: a.title,
      paragraphs: a.paragraphs || [],
      highlights: a.highlights || [],
      status: a.status || "published",
      created_at: a.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("❌ Failed to seed about:", error.message);
    else console.log("✅ Seeded about section successfully.");
  }

  // 4. Skills
  if (seedData.skills && Array.isArray(seedData.skills)) {
    let successCount = 0;
    for (const s of seedData.skills) {
      const { error } = await supabase.from("skills").upsert({
        id: s.id || s._id,
        name: s.name,
        category: s.category,
        proficiency: s.proficiency || 0,
        years_of_experience: s.yearsOfExperience || 0,
        featured: Boolean(s.featured),
        order: s.order ?? 0,
        status: s.status || "published",
        created_at: s.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (!error) successCount++;
      else console.error(`❌ Failed skill ${s.name}:`, error.message);
    }
    console.log(`✅ Seeded ${successCount}/${seedData.skills.length} skills successfully.`);
  }

  // 5. Experience
  if (seedData.experience && Array.isArray(seedData.experience)) {
    let successCount = 0;
    for (const e of seedData.experience) {
      const { error } = await supabase.from("experiences").upsert({
        id: e.id || e._id,
        role: e.role,
        company: e.company,
        company_url: e.companyUrl || null,
        location: e.location || null,
        employment_type: e.employmentType || "Full-time",
        start_date: e.startDate,
        end_date: e.endDate || null,
        current: Boolean(e.current),
        description: e.description || "",
        highlights: e.highlights || [],
        technologies: e.technologies || [],
        order: e.order ?? 0,
        status: e.status || "published",
        created_at: e.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (!error) successCount++;
      else console.error(`❌ Failed experience ${e.role}:`, error.message);
    }
    console.log(`✅ Seeded ${successCount}/${seedData.experience.length} experiences successfully.`);
  }

  // 6. Projects
  if (seedData.projects && Array.isArray(seedData.projects)) {
    let successCount = 0;
    for (const p of seedData.projects) {
      const { error } = await supabase.from("projects").upsert({
        id: p.id || p._id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description || "",
        architecture_overview: p.architectureOverview || null,
        tech_stack: p.techStack || [],
        roles: p.roles || [],
        outcomes: p.outcomes || [],
        metrics: p.metrics || [],
        github_url: p.githubUrl || null,
        live_url: p.liveUrl || null,
        demo_url: p.demoUrl || null,
        cover_image_url: p.coverImageUrl || null,
        screenshots: p.screenshots || [],
        diagram_urls: p.diagramUrls || [],
        featured: Boolean(p.featured),
        order: p.order ?? 0,
        status: p.status || "published",
        created_at: p.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (!error) successCount++;
      else console.error(`❌ Failed project ${p.title}:`, error.message);
    }
    console.log(`✅ Seeded ${successCount}/${seedData.projects.length} projects successfully.`);
  }

  // 7. Achievements
  if (seedData.achievements && Array.isArray(seedData.achievements)) {
    let successCount = 0;
    for (const a of seedData.achievements) {
      const { error } = await supabase.from("achievements").upsert({
        id: a.id || a._id,
        title: a.title,
        description: a.description,
        issuer: a.issuer || null,
        date: a.date || null,
        award_url: a.awardUrl || null,
        featured: Boolean(a.featured),
        order: a.order ?? 0,
        status: a.status || "published",
        created_at: a.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (!error) successCount++;
      else console.error(`❌ Failed achievement ${a.title}:`, error.message);
    }
    console.log(`✅ Seeded ${successCount}/${seedData.achievements.length} achievements successfully.`);
  }

  // 8. Certifications
  if (seedData.certifications && Array.isArray(seedData.certifications)) {
    let successCount = 0;
    for (const c of seedData.certifications) {
      const { error } = await supabase.from("certifications").upsert({
        id: c.id || c._id,
        name: c.name,
        issuer: c.issuer,
        issue_date: c.issueDate,
        expiry_date: c.expiryDate || null,
        credential_id: c.credentialId || null,
        credential_url: c.credentialUrl || null,
        featured: Boolean(c.featured),
        order: c.order ?? 0,
        status: c.status || "published",
        created_at: c.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (!error) successCount++;
      else console.error(`❌ Failed certification ${c.name}:`, error.message);
    }
    console.log(`✅ Seeded ${successCount}/${seedData.certifications.length} certifications successfully.`);
  }

  // 9. Metrics
  if (seedData.metrics && Array.isArray(seedData.metrics)) {
    let successCount = 0;
    for (const m of seedData.metrics) {
      const { error } = await supabase.from("metrics").upsert({
        id: m.id || m._id,
        label: m.label,
        value: m.value,
        suffix: m.suffix || null,
        prefix: m.prefix || null,
        description: m.description || null,
        featured: Boolean(m.featured),
        order: m.order ?? 0,
        status: m.status || "published",
        created_at: m.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (!error) successCount++;
      else console.error(`❌ Failed metric ${m.label}:`, error.message);
    }
    console.log(`✅ Seeded ${successCount}/${seedData.metrics.length} metrics successfully.`);
  }

  // 10. Contact Settings
  if (seedData.contactSettings) {
    const cs = seedData.contactSettings;
    const { error } = await supabase.from("contact_settings").upsert({
      id: cs.id || cs._id || "contact_settings_default",
      recipient_email: cs.recipientEmail || "siddharth.varpe0@gmail.com",
      availability_status: cs.availabilityStatus || "available",
      preferred_contact_method: cs.preferredContactMethod || "email",
      social_links: cs.socialLinks || {},
      created_at: cs.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("❌ Failed to seed contact settings:", error.message);
    else console.log("✅ Seeded contact settings successfully.");
  }

  // 11. Resumes
  if (seedData.resumes && Array.isArray(seedData.resumes)) {
    let successCount = 0;
    for (const r of seedData.resumes) {
      const { error } = await supabase.from("resumes").upsert({
        id: r.id || r._id,
        filename: r.filename,
        storage_url: r.storageUrl,
        storage_key: r.storageKey || null,
        size_bytes: r.sizeBytes || 0,
        mime_type: r.mimeType || "application/pdf",
        version: r.version || "1.0",
        active: Boolean(r.active),
        download_enabled: Boolean(r.downloadEnabled),
        archived: Boolean(r.archived),
        uploaded_at: r.uploadedAt || new Date().toISOString(),
      });
      if (!error) successCount++;
      else console.error(`❌ Failed resume ${r.filename}:`, error.message);
    }
    console.log(`✅ Seeded ${successCount}/${seedData.resumes.length} resumes successfully.`);
  }

  // 12. SEO
  if (seedData.seo) {
    const s = seedData.seo;
    const { error } = await supabase.from("seo").upsert({
      id: s.id || s._id || "seo_default",
      title: s.title,
      description: s.description,
      author: s.author,
      og_title: s.ogTitle || s.title,
      og_description: s.ogDescription || s.description,
      og_image_url: s.ogImageUrl || null,
      canonical_url: s.canonicalUrl || "",
      no_index: Boolean(s.noIndex),
      created_at: s.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("❌ Failed to seed SEO metadata:", error.message);
    else console.log("✅ Seeded SEO metadata successfully.");
  }

  // 13. Site Content
  if (seedData.siteContent) {
    const sc = seedData.siteContent;
    const { error } = await supabase.from("site_content").upsert({
      id: sc.id || sc._id || "site_content_default",
      footer_text: sc.footerText || "",
      copyright: sc.copyright || "",
      global_cta: sc.globalCta || {},
      loading_message: sc.loadingMessage || null,
      empty_state_message: sc.emptyStateMessage || null,
      not_found_message: sc.notFoundMessage || null,
      created_at: sc.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("❌ Failed to seed site content:", error.message);
    else console.log("✅ Seeded site content successfully.");
  }

  console.log("\n🎉 Supabase PostgreSQL Seeding Completed Successfully!");
}

main().catch((err) => {
  console.error("❌ Fatal error during migration/seeding:", err);
  process.exit(1);
});
