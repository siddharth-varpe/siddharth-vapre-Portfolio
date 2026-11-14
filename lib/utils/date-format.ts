/**
 * Professional Track Date & Duration Utilities
 * Handles parsing, sorting, and canonical range formatting for career milestones.
 */

const SHORT_MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Parses any date string (ISO, YYYY-MM, Mon YYYY, MM/YYYY) into a normalized UTC timestamp for accurate sorting.
 */
export function parseDateForSort(dateStr?: string | null): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  const trimmed = dateStr.trim();
  if (!trimmed) return 0;

  // Pattern 1: YYYY-MM or YYYY-MM-DD
  const yyyyMmMatch = trimmed.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?/);
  if (yyyyMmMatch) {
    const year = parseInt(yyyyMmMatch[1], 10);
    const month = parseInt(yyyyMmMatch[2], 10) - 1;
    return Date.UTC(year, Math.max(0, Math.min(11, month)), 1);
  }

  // Pattern 2: Month YYYY (e.g., "Jun 2026", "October 2024")
  const monYearMatch = trimmed.match(/^([a-zA-Z]+)[\s,]+(\d{4})/);
  if (monYearMatch) {
    const monthName = monYearMatch[1].toLowerCase();
    const year = parseInt(monYearMatch[2], 10);
    const monthIdx = SHORT_MONTH_NAMES.findIndex(
      (m) => monthName.startsWith(m.toLowerCase())
    );
    if (monthIdx !== -1) {
      return Date.UTC(year, monthIdx, 1);
    }
  }

  // Pattern 3: MM/YYYY
  const mmYyyyMatch = trimmed.match(/^(\d{1,2})\/(\d{4})/);
  if (mmYyyyMatch) {
    const month = parseInt(mmYyyyMatch[1], 10) - 1;
    const year = parseInt(mmYyyyMatch[2], 10);
    return Date.UTC(year, Math.max(0, Math.min(11, month)), 1);
  }

  // Fallback: standard Date.parse
  const parsed = Date.parse(trimmed);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats a single date into "Mon YYYY" (e.g. "Jun 2026").
 */
export function formatSingleDate(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const trimmed = dateStr.trim();
  if (!trimmed) return "";

  // If year-only (e.g. "2024")
  if (/^\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  // If already "Mon YYYY" (e.g. "Jun 2026")
  const shortMonMatch = trimmed.match(/^([A-Za-z]{3})\s+(\d{4})$/);
  if (shortMonMatch) {
    const m = shortMonMatch[1].charAt(0).toUpperCase() + shortMonMatch[1].slice(1).toLowerCase();
    return `${m} ${shortMonMatch[2]}`;
  }

  const timestamp = parseDateForSort(trimmed);
  if (!timestamp) return trimmed;

  const date = new Date(timestamp);
  const month = SHORT_MONTH_NAMES[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${month} ${year}`;
}

export interface DateRangeOptions {
  verboseDuration?: boolean;
}

/**
 * Formats date range and calculates derived duration.
 * Example:
 * formatDateRange("Jun 2026", "Oct 2026", false) => { rangeText: "Jun 2026 – Oct 2026", durationText: "5 mos" }
 * formatDateRange("2024", "2028", false, { verboseDuration: true }) => { rangeText: "2024 – 2028", durationText: "4 Years" }
 */
export function formatDateRange(
  startDate?: string | null,
  endDate?: string | null,
  isCurrent?: boolean,
  options?: DateRangeOptions
): { rangeText: string; durationText: string } {
  const isStartYearOnly = Boolean(startDate && /^\d{4}$/.test(startDate.trim()));
  const isEndYearOnly = Boolean(endDate && /^\d{4}$/.test(endDate.trim()));

  const formattedStart = formatSingleDate(startDate) || "Start Date";

  if (isCurrent) {
    const rangeText = `${formattedStart} – Present`;
    let durationText = "";
    const startTs = parseDateForSort(startDate);
    if (startTs > 0 && options?.verboseDuration) {
      const now = new Date();
      const dStart = new Date(startTs);
      const totalMonths =
        (now.getUTCFullYear() - dStart.getUTCFullYear()) * 12 +
        (now.getUTCMonth() - dStart.getUTCMonth()) +
        1;
      if (totalMonths > 0) {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        if (years > 0 && months > 0) {
          durationText = `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""}`;
        } else if (years > 0) {
          durationText = `${years} Year${years > 1 ? "s" : ""}`;
        } else {
          durationText = `${months} Month${months > 1 ? "s" : ""}`;
        }
      }
    }
    return { rangeText, durationText };
  }

  const formattedEnd = formatSingleDate(endDate);
  if (!formattedEnd) {
    return { rangeText: formattedStart, durationText: "" };
  }

  const rangeText = `${formattedStart} – ${formattedEnd}`;

  // If year-only range like 2024 - 2028
  if (isStartYearOnly && isEndYearOnly) {
    const yStart = parseInt(startDate!.trim(), 10);
    const yEnd = parseInt(endDate!.trim(), 10);
    const diff = yEnd - yStart;
    if (diff > 0) {
      const durationText = options?.verboseDuration
        ? `${diff} Year${diff > 1 ? "s" : ""}`
        : `${diff} yr${diff > 1 ? "s" : ""}`;
      return { rangeText, durationText };
    }
  }

  // Calculate duration if valid dates
  const startTs = parseDateForSort(startDate);
  const endTs = parseDateForSort(endDate);

  if (startTs > 0 && endTs >= startTs) {
    const dStart = new Date(startTs);
    const dEnd = new Date(endTs);
    const totalMonths =
      (dEnd.getUTCFullYear() - dStart.getUTCFullYear()) * 12 +
      (dEnd.getUTCMonth() - dStart.getUTCMonth()) +
      1;

    if (totalMonths > 0) {
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      if (options?.verboseDuration) {
        if (years > 0 && months === 0) {
          return { rangeText, durationText: `${years} Year${years > 1 ? "s" : ""}` };
        }
        if (years === 0 && months > 0) {
          return { rangeText, durationText: `${months} Month${months > 1 ? "s" : ""}` };
        }
        if (years > 0 && months > 0) {
          return {
            rangeText,
            durationText: `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""}`,
          };
        }
      }

      let durationText = "";
      if (years > 0) {
        durationText += `${years} yr${years > 1 ? "s" : ""}`;
      }
      if (months > 0) {
        durationText += `${durationText ? " " : ""}${months} mo${months > 1 ? "s" : ""}`;
      }
      return { rangeText, durationText: durationText || "1 mo" };
    }
  }

  return { rangeText, durationText: "" };
}
