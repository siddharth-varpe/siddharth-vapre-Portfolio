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
  var _mongoClientInstance: MongoClient | undefined;
}

let clientPromise: Promise<MongoClient>;
let clientInstance: MongoClient;

/**
 * Returns the synchronous raw MongoClient instance sharing the unified connection pool.
 */
export function getRawMongoClient(): MongoClient {
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
    if (!global._mongoClientInstance) {
      global._mongoClientInstance = new MongoClient(uri, options);
      global._mongoClientPromise = global._mongoClientInstance.connect();
    }
    return global._mongoClientInstance;
  } else {
    if (!clientInstance) {
      clientInstance = new MongoClient(uri, options);
      clientPromise = clientInstance.connect();
    }
    return clientInstance;
  }
}

/**
 * Returns the synchronous raw Db instance sharing the unified connection pool.
 */
export function getRawDatabase(): Db {
  return getRawMongoClient().db(DB_NAME);
}

/**
 * Returns the cached MongoDB client instance.
 */
export async function getMongoClient(): Promise<MongoClient> {
  getRawMongoClient();
  if (process.env.NODE_ENV === "development") {
    return global._mongoClientPromise!;
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
