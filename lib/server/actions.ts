import "server-only";
import { ZodSchema, ZodError } from "zod";
import type { ActionResult } from "@/types";

/**
 * Standard wrapper for server actions providing:
 * 1. Server boundary enforcement (server-only)
 * 2. Input validation using Zod schemas
 * 3. Security-safe error handling (no leaked stack traces or sensitive details)
 * 4. Consistent ActionResult return shape
 */
export function createSafeAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: (validatedInput: TInput) => Promise<TOutput>
): (rawInput: unknown) => Promise<ActionResult<TOutput>> {
  return async (rawInput: unknown): Promise<ActionResult<TOutput>> => {
    try {
      const validationResult = schema.safeParse(rawInput);

      if (!validationResult.success) {
        const error = validationResult.error as ZodError;
        const fieldErrors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const path = err.path.join(".");
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(err.message);
        });

        return {
          success: false,
          error: "Invalid request payload.",
          code: "VALIDATION_ERROR",
          fieldErrors,
        };
      }

      const data = await handler(validationResult.data);
      return {
        success: true,
        data,
      };
    } catch (err: unknown) {
      // Diagnostic logging strictly server-side
      console.error("[SafeAction Error]:", err instanceof Error ? err.message : "Unknown error");

      // Generic, safe response returned to client (prevents information disclosure)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
        code: "INTERNAL_SERVER_ERROR",
      };
    }
  };
}
