import "server-only";

/**
 * Database Abstraction Foundation (Phase 1).
 *
 * This file establishes the server-side architectural boundary for database
 * access. It ensures that any future MongoDB driver interaction (Phase 3) is
 * strictly contained on the server and never exposed to the client bundle.
 *
 * Flow:
 * UI / Route Handler -> Server Layer / Service -> lib/server/db.ts -> MongoDB Atlas
 */

export interface DatabaseConnection {
  isConnected: boolean;
  getDbName(): string;
}

/**
 * Placeholder for future MongoDB client connection getter.
 * Will be implemented with the official MongoDB Node.js driver in Phase 3.
 */
export async function getDatabaseConnection(): Promise<DatabaseConnection> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    // In Phase 1, database is not yet connected. Return boundary state.
    return {
      isConnected: false,
      getDbName: () => "unconfigured",
    };
  }

  return {
    isConnected: true,
    getDbName: () => "portfolio",
  };
}
