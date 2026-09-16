"use client";

import React, { useMemo } from "react";
import { ArchivalItem } from "@/types/schema";
import { computeTimelineBounds, extractYear } from "@/lib/dateUtils";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Calendar, RotateCcw } from "lucide-react";

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

  // Group specimens into distinct chronological eras / decades
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

  // All individual sorted years
  const individualYears = useMemo(() => {
    const set = new Set<number>();
    items.forEach((i) => {
      const y = extractYear(i.date);
      if (y !== null) set.add(y);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [items]);

  const isBrutalist = aestheticType === "brutalist-technical";
  const isEditorial = aestheticType === "editorial-serif";

  return (
    <div
      aria-label="Chronological Era Filter"
      className={cn(
        "p-6 border border-[var(--color-border)] bg-[var(--color-surface)]/40 transition-colors mb-12",
        className
      )}
    >
      {/* Header telemetry and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[var(--color-text-secondary)] uppercase">
          <Calendar className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span className="font-semibold text-[var(--color-text-primary)]">
            Chronological Filter
          </span>
          <span className="opacity-40">/</span>
          <span>
            {bounds.minYear} — {bounds.maxYear}
          </span>
        </div>

        {selectedYear !== null ? (
          <button
            onClick={() => onSelectYear(null)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-accent)] hover:underline uppercase self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Timeline (Show All {items.length})</span>
          </button>
        ) : (
          <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
            Showing all catalogued years
          </span>
        )}
      </div>

      {/* Clear Era Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => onSelectYear(null)}
          className={cn(
            "px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all",
            selectedYear === null
              ? "bg-[var(--color-text-primary)] text-[var(--color-bg)] font-semibold"
              : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          )}
        >
          All Eras
        </button>

        {eras.map((era) => {
          // An era is active if selectedYear matches one of its years
          const isActive = selectedYear !== null && era.years.includes(selectedYear);

          return (
            <button
              key={era.key}
              onClick={() => {
                // If already active, toggle off. Otherwise select the first year of the era
                if (isActive) {
                  onSelectYear(null);
                } else {
                  onSelectYear(era.years[0]);
                }
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5",
                isActive
                  ? "bg-[var(--color-accent)] text-white font-semibold"
                  : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <span>{era.label}</span>
              <span className="opacity-60 text-[10px]">({era.count})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Year Timeline Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
          <span>{bounds.minYear}</span>
          <span className="text-[var(--color-accent)] font-semibold">
            {selectedYear ? `Year: ${selectedYear}` : "Select specific specimen year"}
          </span>
          <span>{bounds.maxYear}</span>
        </div>

        {/* Clickable Year Ticks Strip */}
        <div className="flex items-center justify-between gap-1 p-2 bg-[var(--color-bg)] border border-[var(--color-border)] overflow-x-auto">
          {individualYears.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => onSelectYear(isSelected ? null : year)}
                className={cn(
                  "px-2.5 py-1 text-xs font-mono transition-all shrink-0",
                  isSelected
                    ? "bg-[var(--color-accent)] text-white font-bold"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                )}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
