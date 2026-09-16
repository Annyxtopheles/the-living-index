"use client";

import React, { useMemo } from "react";
import { ArchivalItem } from "@/types/schema";
import { computeTimelineBounds, extractYear } from "@/lib/dateUtils";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface TimelineControllerProps {
  items: ArchivalItem[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
  className?: string;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  items,
  selectedYear,
  onSelectYear,
  className,
}) => {
  const { aestheticType } = useTheme();

  const bounds = useMemo(() => computeTimelineBounds(items), [items]);

  // Group specimens into distinct decades
  const eras = useMemo(() => {
    const eraMap: Record<string, { label: string; count: number; years: number[] }> = {};

    items.forEach((item) => {
      const y = extractYear(item.date);
      if (y !== null) {
        const decade = Math.floor(y / 10) * 10;
        const key = `${decade}s`;
        if (!eraMap[key]) {
          eraMap[key] = { label: key, count: 0, years: [] };
        }
        eraMap[key].count += 1;
        eraMap[key].years.push(y);
      }
    });

    return Object.entries(eraMap)
      .map(([key, val]) => ({ key, ...val }))
      .sort((a, b) => parseInt(a.key) - parseInt(b.key));
  }, [items]);

  const individualYears = useMemo(() => {
    const set = new Set<number>();
    items.forEach((i) => {
      const y = extractYear(i.date);
      if (y !== null) set.add(y);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [items]);

  const isBrutalist = aestheticType === "brutalist-technical";

  return (
    <div
      aria-label="Chronological Axis"
      className={cn(
        "py-6 px-8 border border-[var(--color-border)] bg-[var(--color-surface)]/40 transition-colors mb-16",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 mb-6 border-b border-[var(--color-border)] text-xs font-mono tracking-[0.2em] uppercase text-[var(--color-text-secondary)]">
        <div>
          <span className="font-semibold text-[var(--color-text-primary)]">
            Chronological Axis
          </span>
          <span className="opacity-30 mx-2">/</span>
          <span>{bounds.minYear} — {bounds.maxYear}</span>
          {selectedYear && (
            <span className="text-[var(--color-accent)] font-semibold ml-3">
              — {selectedYear}
            </span>
          )}
        </div>

        {selectedYear !== null && (
          <button
            onClick={() => onSelectYear(null)}
            className="text-[11px] text-[var(--color-accent)] hover:underline uppercase self-start sm:self-auto"
          >
            Reset (Show All)
          </button>
        )}
      </div>

      {/* Decade Selector */}
      <div className="flex flex-wrap items-center gap-6 mb-6 text-xs font-mono uppercase tracking-[0.16em]">
        <button
          onClick={() => onSelectYear(null)}
          className={cn(
            "pb-0.5 transition-colors",
            selectedYear === null
              ? "text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-accent)]"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          )}
        >
          All Decades
        </button>

        {eras.map((era) => {
          const isActive = selectedYear !== null && era.years.includes(selectedYear);

          return (
            <button
              key={era.key}
              onClick={() => onSelectYear(isActive ? null : era.years[0])}
              className={cn(
                "pb-0.5 transition-colors flex items-center gap-1.5",
                isActive
                  ? "text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <span>{era.label}</span>
              <span className="opacity-50 text-[10px]">({era.count})</span>
            </button>
          );
        })}
      </div>

      {/* Individual Year Strip */}
      <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]/60 overflow-x-auto text-xs font-mono">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-60 mr-2 shrink-0">
          Year:
        </span>
        {individualYears.map((year) => {
          const isSelected = selectedYear === year;
          return (
            <button
              key={year}
              onClick={() => onSelectYear(isSelected ? null : year)}
              className={cn(
                "px-2.5 py-1 transition-all shrink-0",
                isSelected
                  ? "bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
};
