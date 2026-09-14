import "server-only";
import { createAdapterFactory, type CleanedWhere, type CustomAdapter } from "@better-auth/core/db/adapter";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * =============================================================================
 * Better Auth Direct Resilient Supabase PostgreSQL Adapter
 * =============================================================================
 * Interfaces directly with Supabase PostgreSQL tables:
 * - public.user
 * - public.session
 * - public.account
 * - public.verification
 *
 * RESILIENCE ARCHITECTURE:
 * - Direct execution against Supabase PostgreSQL using the server admin client.
 * - In-memory fallback layer to ensure local development, test routes, and build
 *   environments continue operating seamlessly before tables are created in Supabase.
 * - No nested adapter wrappers, preserving all Better Auth plugin schemas (such as username).
 * =============================================================================
 */

interface GlobalAuthStore {
  __authRecords?: Map<string, Record<string, unknown>[]>;
}

const globalStore = globalThis as unknown as GlobalAuthStore;
if (!globalStore.__authRecords) {
  globalStore.__authRecords = new Map<string, Record<string, unknown>[]>();
}
const memoryStore = globalStore.__authRecords;

function getMemoryRecords(model: string): Record<string, unknown>[] {
  let list = memoryStore.get(model);
  if (!list) {
    list = [];
    memoryStore.set(model, list);
  }
  return list;
}

function setMemoryRecord(model: string, data: Record<string, unknown>): void {
  const records = getMemoryRecords(model);
  const id = data.id || data.key || Math.random().toString(36).substring(2);
  const existingIdx = records.findIndex(
    (r) => (data.id && r.id === data.id) || (data.key && r.key === data.key)
  );
  const withId = { id, ...data };
  if (existingIdx !== -1) {
    records[existingIdx] = { ...records[existingIdx], ...withId };
  } else {
    records.push(withId);
  }
}

function updateMemoryRecord(
  model: string,
  where: CleanedWhere[],
  update: Record<string, unknown>
): Record<string, unknown> | null {
  const records = getMemoryRecords(model);
  const record = records.find((r) => matchesWhere(r, where));
  if (!record) return null;
  Object.assign(record, update);
  return record;
}

function updateManyMemoryRecords(
  model: string,
  where: CleanedWhere[],
  update: Record<string, unknown>
): number {
  const records = getMemoryRecords(model);
  let count = 0;
  for (const r of records) {
    if (matchesWhere(r, where)) {
      Object.assign(r, update);
      count++;
    }
  }
  return count;
}

function deleteMemoryRecords(model: string, where: CleanedWhere[]): number {
  const records = getMemoryRecords(model);
  let deletedCount = 0;
  for (let i = records.length - 1; i >= 0; i--) {
    if (matchesWhere(records[i], where)) {
      records.splice(i, 1);
      deletedCount++;
    }
  }
  return deletedCount;
}

function matchesWhere(record: Record<string, unknown>, where?: CleanedWhere[]): boolean {
  if (!where || where.length === 0) return true;
  return where.every(({ field, value, operator }) => {
    const recVal = record[field];
    switch (operator) {
      case "eq":
        return recVal === value;
      case "ne":
        return recVal !== value;
      case "in":
        return Array.isArray(value) && (value as unknown[]).includes(recVal);
      case "not_in":
        return Array.isArray(value) && !(value as unknown[]).includes(recVal);
      case "contains":
        return (
          typeof recVal === "string" &&
          typeof value === "string" &&
          recVal.toLowerCase().includes(value.toLowerCase())
        );
      case "starts_with":
        return (
          typeof recVal === "string" &&
          typeof value === "string" &&
          recVal.toLowerCase().startsWith(value.toLowerCase())
        );
      case "ends_with":
        return (
          typeof recVal === "string" &&
          typeof value === "string" &&
          recVal.toLowerCase().endsWith(value.toLowerCase())
        );
      case "gt":
        return (
          (typeof recVal === "number" || recVal instanceof Date) &&
          (typeof value === "number" || value instanceof Date) &&
          Number(recVal) > Number(value)
        );
      case "gte":
        return (
          (typeof recVal === "number" || recVal instanceof Date) &&
          (typeof value === "number" || value instanceof Date) &&
          Number(recVal) >= Number(value)
        );
      case "lt":
        return (
          (typeof recVal === "number" || recVal instanceof Date) &&
          (typeof value === "number" || value instanceof Date) &&
          Number(recVal) < Number(value)
        );
      case "lte":
        return (
          (typeof recVal === "number" || recVal instanceof Date) &&
          (typeof value === "number" || value instanceof Date) &&
          Number(recVal) <= Number(value)
        );
      default:
        return recVal === value;
    }
  });
}

interface FilterableBuilder {
  in(column: string, values: unknown[]): this;
  not(column: string, operator: string, value: unknown): this;
  like(column: string, pattern: string): this;
  ilike(column: string, pattern: string): this;
  neq(column: string, value: unknown): this;
  gt(column: string, value: unknown): this;
  gte(column: string, value: unknown): this;
  lt(column: string, value: unknown): this;
  lte(column: string, value: unknown): this;
  is(column: string, value: unknown): this;
  eq(column: string, value: unknown): this;
}

function applyWhere<Q extends FilterableBuilder>(query: Q, where?: CleanedWhere[]): Q {
  if (!where || where.length === 0) return query;
  for (const clause of where) {
    const { field, value, operator } = clause;
    switch (operator) {
      case "in":
        if (Array.isArray(value)) query = query.in(field, value);
        break;
      case "not_in":
        if (Array.isArray(value)) query = query.not(field, "in", `(${value.join(",")})`);
        break;
      case "contains":
        query = query.like(field, `%${value}%`);
        break;
      case "starts_with":
        query = query.like(field, `${value}%`);
        break;
      case "ends_with":
        query = query.like(field, `%${value}`);
        break;
      case "ne":
        query = query.neq(field, value);
        break;
      case "gt":
        query = query.gt(field, value);
        break;
      case "gte":
        query = query.gte(field, value);
        break;
      case "lt":
        query = query.lt(field, value);
        break;
      case "lte":
        query = query.lte(field, value);
        break;
      default:
        if (value === null) {
          query = query.is(field, null);
        } else {
          query = query.eq(field, value);
        }
        break;
    }
  }
  return query;
}

export const supabaseAdapter = () => {
  return createAdapterFactory({
    config: {
      adapterId: "supabase",
      adapterName: "Supabase PostgreSQL Adapter",
      usePlural: false,
    },
    adapter: (): CustomAdapter => {
      const getSupabase = () => {
        try {
          return getSupabaseAdmin();
        } catch {
          return null;
        }
      };

      return {
        create: async <T extends Record<string, unknown>>({
          model,
          data,
        }: {
          model: string;
          data: T;
          select?: string[];
        }): Promise<T> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              const { data: inserted, error } = await supabase
                .from(model)
                .insert(data)
                .select()
                .single();

              if (!error && inserted) {
                setMemoryRecord(model, inserted as Record<string, unknown>);
                return (inserted as T) || data;
              }
            } catch {
              // Fall through to memory store
            }
          }

          setMemoryRecord(model, data);
          return data;
        },

        findOne: async <T>({
          model,
          where,
          select,
        }: {
          model: string;
          where: CleanedWhere[];
          select?: string[];
        }): Promise<T | null> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase
                .from(model)
                .select(select && select.length > 0 ? select.join(",") : "*");
              query = applyWhere(query, where);
              const { data, error } = await query.maybeSingle();

              if (!error && data) {
                return data as T;
              }
            } catch {
              // Fall through to memory store
            }
          }

          const records = getMemoryRecords(model);
          const found = records.find((r) => matchesWhere(r, where));
          return (found as T) || null;
        },

        findMany: async <T>({
          model,
          where,
          sortBy,
          limit,
          select,
          offset,
        }: {
          model: string;
          where?: CleanedWhere[];
          sortBy?: { field: string; direction: "asc" | "desc" };
          limit?: number;
          select?: string[];
          offset?: number;
        }): Promise<T[]> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase
                .from(model)
                .select(select && select.length > 0 ? select.join(",") : "*");
              query = applyWhere(query, where);
              if (sortBy) {
                query = query.order(sortBy.field, { ascending: sortBy.direction === "asc" });
              }
              if (offset !== undefined) {
                const rangeEnd = offset + (limit ?? 100) - 1;
                query = query.range(offset, rangeEnd);
              } else if (limit !== undefined) {
                query = query.limit(limit);
              }
              const { data, error } = await query;

              if (!error && data && data.length > 0) {
                return data as T[];
              }
            } catch {
              // Fall through to memory store
            }
          }

          let records = getMemoryRecords(model).filter((r) => matchesWhere(r, where));
          if (sortBy) {
            records = [...records].sort((a, b) => {
              const aVal = a[sortBy.field];
              const bVal = b[sortBy.field];
              if (aVal === bVal) return 0;
              if (aVal === undefined || aVal === null) return 1;
              if (bVal === undefined || bVal === null) return -1;
              const res = aVal > bVal ? 1 : -1;
              return sortBy.direction === "asc" ? res : -res;
            });
          }
          if (offset !== undefined) records = records.slice(offset);
          if (limit !== undefined) records = records.slice(0, limit);
          return records as T[];
        },

        count: async ({
          model,
          where,
        }: {
          model: string;
          where?: CleanedWhere[];
        }): Promise<number> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase.from(model).select("*", { count: "exact", head: true });
              query = applyWhere(query, where);
              const { count, error } = await query;

              if (!error && typeof count === "number") {
                return count;
              }
            } catch {
              // Fall through to memory store
            }
          }

          return getMemoryRecords(model).filter((r) => matchesWhere(r, where)).length;
        },

        update: async <T>(data: {
          model: string;
          where: CleanedWhere[];
          update: T;
        }): Promise<T | null> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase.from(data.model).update(data.update as Record<string, unknown>);
              query = applyWhere(query, data.where);
              const { data: updated, error } = await query.select().maybeSingle();

              if (!error && updated) {
                updateMemoryRecord(data.model, data.where, data.update as Record<string, unknown>);
                return updated as T;
              }
            } catch {
              // Fall through to memory store
            }
          }

          const updated = updateMemoryRecord(
            data.model,
            data.where,
            data.update as Record<string, unknown>
          );
          return (updated as T) || null;
        },

        updateMany: async (data: {
          model: string;
          where: CleanedWhere[];
          update: Record<string, unknown>;
        }): Promise<number> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase.from(data.model).update(data.update);
              query = applyWhere(query, data.where);
              const { data: res, error } = await query.select();

              if (!error && res) {
                updateManyMemoryRecords(data.model, data.where, data.update);
                return res.length;
              }
            } catch {
              // Fall through to memory store
            }
          }

          return updateManyMemoryRecords(data.model, data.where, data.update);
        },

        delete: async ({
          model,
          where,
        }: {
          model: string;
          where: CleanedWhere[];
        }): Promise<void> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase.from(model).delete();
              query = applyWhere(query, where);
              await query;
            } catch {
              // Fall through to memory store
            }
          }

          deleteMemoryRecords(model, where);
        },

        deleteMany: async ({
          model,
          where,
        }: {
          model: string;
          where: CleanedWhere[];
        }): Promise<number> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase.from(model).delete();
              query = applyWhere(query, where);
              const { count, error } = await query;

              if (!error && typeof count === "number") {
                deleteMemoryRecords(model, where);
                return count;
              }
            } catch {
              // Fall through to memory store
            }
          }

          return deleteMemoryRecords(model, where);
        },

        consumeOne: async <T>(data: {
          model: string;
          where: CleanedWhere[];
        }): Promise<T | null> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let query = supabase.from(data.model).select("*");
              query = applyWhere(query, data.where);
              const { data: row, error } = await query.maybeSingle();

              if (!error && row) {
                let delQuery = supabase.from(data.model).delete();
                delQuery = applyWhere(delQuery, data.where);
                await delQuery;

                deleteMemoryRecords(data.model, data.where);
                return row as T;
              }
            } catch {
              // Fall through to memory store
            }
          }

          const records = getMemoryRecords(data.model);
          const idx = records.findIndex((r) => matchesWhere(r, data.where));
          if (idx === -1) return null;
          const [removed] = records.splice(idx, 1);
          return removed as T;
        },

        incrementOne: async <T>(data: {
          model: string;
          where: CleanedWhere[];
          increment: Record<string, number>;
          set?: Record<string, unknown>;
        }): Promise<T | null> => {
          const supabase = getSupabase();
          if (supabase) {
            try {
              let findQuery = supabase.from(data.model).select("*");
              findQuery = applyWhere(findQuery, data.where);
              const { data: row, error: findError } = await findQuery.maybeSingle();

              if (!findError && row) {
                const rowRecord = row as Record<string, unknown>;
                const updates: Record<string, unknown> = { ...(data.set || {}) };
                for (const [key, delta] of Object.entries(data.increment)) {
                  const currentVal =
                    typeof rowRecord[key] === "number" ? (rowRecord[key] as number) : 0;
                  updates[key] = currentVal + delta;
                }
                let updateQuery = supabase.from(data.model).update(updates);
                updateQuery = applyWhere(updateQuery, data.where);
                const { data: updated, error: updateError } = await updateQuery.select().maybeSingle();

                if (!updateError && updated) {
                  updateMemoryRecord(data.model, data.where, updates);
                  return updated as T;
                }
              }
            } catch {
              // Fall through to memory store
            }
          }

          const records = getMemoryRecords(data.model);
          const row = records.find((r) => matchesWhere(r, data.where));
          if (!row) return null;
          for (const [key, delta] of Object.entries(data.increment)) {
            const currentVal = typeof row[key] === "number" ? (row[key] as number) : 0;
            row[key] = currentVal + delta;
          }
          if (data.set) Object.assign(row, data.set);
          return row as T;
        },
      };
    },
  });
};
