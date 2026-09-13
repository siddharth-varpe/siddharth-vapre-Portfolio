import { adminDb } from "../lib/firebase/admin";
import seedDataRaw from "../data/portfolio-seed-data.json";

function ensureDates(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(ensureDates);
  const record = obj as Record<string, unknown>;
  const res: Record<string, unknown> = {};
  for (const k of Object.keys(record)) {
    const val = record[k];
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
      res[k] = new Date(val);
    } else if (val && typeof val === "object") {
      res[k] = ensureDates(val);
    } else {
      res[k] = val;
    }
  }
  return res;
}

async function seedCollection(
  collectionName: string,
  items: unknown[],
  idPrefix: string
) {
  let count = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown>;
    const id = (item.id as string) || (item._id as string) || `${idPrefix}_${i + 1}`;
    const docData: Record<string, unknown> = {
      ...(ensureDates(item) as Record<string, unknown>),
      id,
      _id: id,
      updatedAt: new Date(),
    };
    if (!docData.createdAt) docData.createdAt = new Date();

    await adminDb.collection(collectionName).doc(id).set(docData, { merge: true });
    count++;
  }
  console.log(`[PASS] Seeded ${count}/${items.length} records into Firestore collection '${collectionName}'.`);
}

async function seedSingleton(collectionName: string, docId: string, data: unknown) {
  if (!data) return;
  const docData: Record<string, unknown> = {
    ...(ensureDates(data) as Record<string, unknown>),
    id: docId,
    _id: docId,
    updatedAt: new Date(),
  };
  if (!docData.createdAt) docData.createdAt = new Date();

  await adminDb.collection(collectionName).doc(docId).set(docData, { merge: true });
  console.log(`[PASS] Seeded singleton '${docId}' into Firestore collection '${collectionName}'.`);
}

async function main() {
  console.log("==================================================");
  console.log("SEEDING CLOUD FIRESTORE FROM AUTHENTIC PORTFOLIO DATA");
  console.log("==================================================");

  const raw = seedDataRaw as Record<string, unknown>;

  // 1. Singletons
  await seedSingleton("profiles", "profile_root", raw.profile);
  await seedSingleton("hero", "hero_root", raw.hero);
  await seedSingleton("about", "about_root", raw.about);
  await seedSingleton("contactSettings", "contact_settings_root", raw.contact_settings || raw.contactSettings);
  await seedSingleton("seo", "seo_root", raw.seo);
  await seedSingleton("siteContent", "site_content_root", raw.site_content || raw.siteContent);

  // 2. Collections
  if (Array.isArray(raw.skills)) await seedCollection("skills", raw.skills, "skill");
  if (Array.isArray(raw.experience)) await seedCollection("experience", raw.experience, "exp");
  if (Array.isArray(raw.projects)) await seedCollection("projects", raw.projects, "proj");
  if (Array.isArray(raw.achievements)) await seedCollection("achievements", raw.achievements, "ach");
  if (Array.isArray(raw.certifications)) await seedCollection("certifications", raw.certifications, "cert");
  if (Array.isArray(raw.metrics)) await seedCollection("metrics", raw.metrics, "metric");
  if (Array.isArray(raw.resumes)) await seedCollection("resumes", raw.resumes, "resume");

  console.log("==================================================");
  console.log("FIRESTORE SEEDING COMPLETED WITH 100% AUTHENTIC DATA");
  console.log("==================================================");
}

main().catch((err) => {
  console.error("Firestore seeding note/error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
