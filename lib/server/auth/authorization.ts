import "server-only";

/**
 * Authoritative IDOR / BOLA authorization check (Phase 4).
 *
 * Ensures the requesting admin or entity owns or has explicit rights to the target resource.
 * Prevents horizontal privilege escalation across tenant/user boundaries.
 *
 * @param resourceOwnerId The ID of the owner of the target resource
 * @param currentUserId The ID of the currently authenticated user
 * @throws Error if authorization check fails
 */
export function assertResourceAccess(
  resourceOwnerId: string | undefined | null,
  currentUserId: string
): void {
  if (!resourceOwnerId) {
    throw new Error("AUTHORIZATION VIOLATION: Target resource owner ID is missing.");
  }

  if (resourceOwnerId !== currentUserId) {
    throw new Error(
      "AUTHORIZATION VIOLATION: IDOR attempt detected. User is not authorized for this resource."
    );
  }
}
