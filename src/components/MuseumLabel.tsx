"use client";

import React from "react";
import { ArchivalItem } from "@/types/schema";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface MuseumLabelProps {
  item: ArchivalItem;
  className?: string;
  variant?: "wall-pinned" | "dossier" | "lightbox";
  onInspect?: () => void;
}

export const MuseumLabel: React.FC<MuseumLabelProps> = ({
  item,
  className,
  variant = "wall-pinned",
  onInspect,
}) => {
  const { aestheticType } = useTheme();

  const isEditorial = aestheticType === "editorial-serif";

  const getConditionBadgeStyle = (grade: string) => {
    if (grade.includes("Grade I")) {
      return "border-emerald-700/40 text-emerald-800 bg-emerald-500/10";
    }
    if (grade.includes("Grade II")) {
      return "border-amber-700/40 text-amber-800 bg-amber-500/10";
    }
    return "border-rose-700/40 text-rose-800 bg-rose-500/10";
  };

  // Gallery Wall Plate Label: Authentic, scholarly, high craft
  return (
    <div className={cn("relative select-text pt-2", className)}>
      {/* Category & Condition Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[var(--color-border)] text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
        <span className="font-semibold text-[var(--color-accent)]">{item.category}</span>
        <span className={cn("px-2 py-0.5 text-[9px] font-semibold border", getConditionBadgeStyle(item.conditionGrade))}>
          {item.conditionGrade}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h3
          onClick={onInspect}
          className={cn(
            "text-2xl sm:text-3xl font-normal leading-snug text-[var(--color-text-primary)] cursor-pointer hover:text-[var(--color-accent)] transition-colors",
            isEditorial ? "font-serif italic tracking-tight" : "font-mono font-bold uppercase text-lg"
          )}
        >
          {item.title}
        </h3>
        <span className="text-xs font-mono text-[var(--color-text-secondary)] shrink-0 tracking-wider">
          {item.date}
        </span>
      </div>

      {/* Substrate & Dimensions */}
      <p className="text-xs text-[var(--color-text-secondary)] font-serif italic mb-3 leading-relaxed">
        {item.medium}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-[var(--color-text-secondary)] mb-4">
        <span><strong className="text-[var(--color-text-primary)] font-medium">Dim:</strong> {item.dimensions}</span>
        <span className="opacity-30">/</span>
        <span><strong className="text-[var(--color-text-primary)] font-medium">Vault:</strong> {item.storageMicroclimate.vaultDesignation.split("·")[0].trim()}</span>
      </div>

      {/* Curatorial Action */}
      <button
        type="button"
        onClick={onInspect}
        className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[var(--color-accent)] hover:opacity-100 transition-opacity pb-0.5 border-b border-[var(--color-accent)] group"
      >
        <span>Access Specimen Dossier</span>
        <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
      </button>
    </div>
  );
};
