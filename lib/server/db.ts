import "server-only";
import dns from "node:dns";
import { MongoClient, Db } from "mongodb";

// Ensure IPv4 DNS resolution for MongoDB Atlas connectivity
dns.setDefaultResultOrder("ipv4first");

/**
 * MongoDB Atlas Connection Management (Phase 3).
 *
 * Implements server-only connection pooling and singleton caching compatible
 * with Next.js fast-refresh in local development and serverless execution on Vercel.
 *
 * SECURITY:
 * - Credentials remain strictly server-side.
 * - MONGODB_URI is never logged, printed, or sent to client bundles.
 */

const DB_NAME = "siddharth_portfolio";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

function initializeMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Database configuration error: MONGODB_URI environment variable is not defined."
    );
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  };

  if (process.env.NODE_ENV === "development") {
    // Cache connection across HMR module reloads in development
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // Standard singleton client promise for production
    const client = new MongoClient(uri, options);
    return client.connect();
  }
}

/**
 * Returns the cached MongoDB client instance.
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = initializeMongoClient();
  }
  return clientPromise;
}

/**
 * Returns the portfolio MongoDB database instance ("siddharth_portfolio").
 */
export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

/**
 * Safe connectivity check.
 * Returns ping latency without exposing credentials or database host info.
 */
export async function pingDatabase(): Promise<{ success: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return {
      success: true,
      latencyMs: Date.now() - start,
    };
  } catch {
    console.error("[Database Connection Error]: Ping failed.");
    return {
      success: false,
      latencyMs: Date.now() - start,
    };
  }
}
