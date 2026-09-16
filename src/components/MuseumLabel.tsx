"use client";

import React from "react";
import { ArchivalItem } from "@/types/schema";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface MuseumLabelProps {
  item: ArchivalItem;
  className?: string;
  variant?: "wall-pinned" | "lightbox";
  onInspect?: () => void;
}

export const MuseumLabel: React.FC<MuseumLabelProps> = ({
  item,
  className,
  variant = "wall-pinned",
  onInspect,
}) => {
  const { aestheticType } = useTheme();

  const isBrutalist = aestheticType === "brutalist-technical";
  const isEditorial = aestheticType === "editorial-serif";

  // Lightbox: Scholarly Museum Dossier
  if (variant === "lightbox") {
    return (
      <article
        aria-label={`Curatorial dossier for ${item.title}`}
        className={cn("relative select-text max-w-md", className)}
      >
        {isEditorial && (
          <div className="w-12 h-[1.5px] bg-[#CBB5A1] mb-8" />
        )}

        {/* Accession Header */}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-[#8E8A82] uppercase mb-4">
          <span>{item.id}</span>
          <span className="opacity-40">/</span>
          <span>{item.date}</span>
          {item.catalogNumber && (
            <>
              <span className="opacity-40">/</span>
              <span>{item.catalogNumber}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h2
          className={cn(
            "text-2xl sm:text-3xl leading-snug text-[#F5F2EB] mb-4",
            isEditorial
              ? "font-serif italic font-normal tracking-tight"
              : isBrutalist
              ? "font-mono font-bold uppercase text-lg"
              : "font-sans font-semibold"
          )}
        >
          {item.title}
        </h2>

        {/* Physical Specimen Details */}
        <div className="space-y-1.5 text-xs text-[#BCB7AC] leading-relaxed mb-6 font-serif">
          <p className="text-white/90 italic">{item.medium}</p>
          <p className="font-mono text-[11px] opacity-75">{item.dimensions}</p>
          {item.location && (
            <p className="text-[11px] opacity-60 font-mono">Location: {item.location}</p>
          )}
        </div>

        {/* Provenance Trail */}
        {item.provenanceText && (
          <div className="pt-6 border-t border-white/10">
            <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#CBB5A1] mb-2 font-medium">
              Custodial History & Provenance
            </span>
            <p className="text-xs leading-relaxed text-[#BCB7AC] font-serif">
              {item.provenanceText}
            </p>
          </div>
        )}

        {/* Rights & Department */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#8C887F]">
          {item.department && <span>{item.department}</span>}
          {item.rightsStatement && (
            <>
              <span>•</span>
              <span>{item.rightsStatement}</span>
            </>
          )}
        </div>
      </article>
    );
  }

  // Gallery Wall: Minimal, authentic, zero AI slop
  return (
    <div className={cn("relative select-text pt-4", className)}>
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <h3
          onClick={onInspect}
          className={cn(
            "text-xl font-normal leading-tight text-[var(--color-text-primary)] cursor-pointer hover:opacity-70 transition-opacity",
            isEditorial
              ? "font-serif italic"
              : isBrutalist
              ? "font-mono font-bold uppercase text-base"
              : "font-sans font-medium"
          )}
        >
          {item.title}
        </h3>
        <span className="text-xs font-mono text-[var(--color-text-secondary)] shrink-0">
          {item.date}
        </span>
      </div>

      <p className="text-xs text-[var(--color-text-secondary)] font-serif italic mb-3">
        {item.medium} <span className="opacity-40 not-italic">•</span> <span className="font-mono not-italic text-[11px]">{item.dimensions}</span>
      </p>

      <button
        onClick={onInspect}
        className="text-[11px] font-mono tracking-[0.16em] uppercase text-[var(--color-accent)] opacity-80 hover:opacity-100 transition-opacity"
      >
        Examine Specimen →
      </button>
    </div>
  );
};
