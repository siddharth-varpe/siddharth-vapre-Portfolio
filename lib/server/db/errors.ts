import "server-only";

export class DatabaseError extends Error {
  public readonly code: string;

  constructor(message: string = "A database operation failed", code: string = "DB_OPERATION_ERROR") {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
  }
}

/**
 * Masks internal database exceptions into safe generic DatabaseErrors.
 * Prevents connection string, collection schema, or query leaks.
 */
export function handleDatabaseError(error: unknown, fallbackMessage = "Database operation failed"): never {
  if (process.env.NODE_ENV !== "production") {
    const rawMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Database Error Debug]:", rawMsg);
  } else {
    console.error("[Database Error]: Internal database error occurred.");
  }
  throw new DatabaseError(fallbackMessage);
}

/**
 * Wraps an async database operation with error handling.
 */
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
  fallbackMessage = "Database operation failed"
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    return handleDatabaseError(error, fallbackMessage);
  }
}
