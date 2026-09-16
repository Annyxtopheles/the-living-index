import { ArchivalItem } from "@/types/schema";

/**
 * Extracts a numeric Gregorian year from varied archival date strings:
 * e.g., "1924", "ca. 1952", "1889-1904", "Spring 1972", "c. 1965"
 */
export function extractYear(dateStr: string): number | null {
  if (!dateStr) return null;
  // Look for 4 consecutive digits (supports 1000 - 2999)
  const match = dateStr.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

export interface TimelineBounds {
  minYear: number;
  maxYear: number;
  span: number;
}

export function computeTimelineBounds(items: ArchivalItem[]): TimelineBounds {
  let min = Infinity;
  let max = -Infinity;

  items.forEach((item) => {
    const year = extractYear(item.date);
    if (year !== null) {
      if (year < min) min = year;
      if (year > max) max = year;
    }
  });

  if (min === Infinity || max === -Infinity) {
    const currentYear = new Date().getFullYear();
    return { minYear: currentYear - 100, maxYear: currentYear, span: 100 };
  }

  // Add slight aesthetic padding to timeline bounds if min === max
  if (min === max) {
    min -= 5;
    max += 5;
  }

  return {
    minYear: min,
    maxYear: max,
    span: Math.max(1, max - min),
  };
}

/**
 * Normalizes an item's chronological position from 0.0 to 1.0 on the timeline track
 */
export function getTimelineFraction(dateStr: string, bounds: TimelineBounds): number {
  const year = extractYear(dateStr);
  if (year === null) return 0.5;
  const clamped = Math.max(bounds.minYear, Math.min(bounds.maxYear, year));
  return (clamped - bounds.minYear) / bounds.span;
}
