"use client";

import React from "react";
import { ArchivalItem } from "@/types/schema";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface MuseumLabelProps {
  item: ArchivalItem;
  className?: string;
  variant?: "wall-pinned" | "compact" | "lightbox";
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

  // Lightbox view: Full scholarly museum record with complete provenance and custody
  if (variant === "lightbox") {
    return (
      <article
        aria-label={`Detailed curatorial dossier for ${item.title}`}
        className={cn("relative select-text max-w-md", className)}
      >
        {isEditorial && (
          <div className="w-10 h-[1.5px] bg-[var(--color-accent)] mb-6" />
        )}

        {/* Accession Header */}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#9E9A90] uppercase mb-3">
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
            "text-2xl leading-tight text-white mb-3",
            isEditorial
              ? "font-serif italic font-normal"
              : isBrutalist
              ? "font-mono font-bold uppercase text-lg"
              : "font-sans font-semibold"
          )}
        >
          {item.title}
        </h2>

        {/* Physical Specimen Details */}
        <div className="space-y-1 text-xs text-[#BCB7AC] leading-relaxed mb-6">
          <p className="text-white/90">{item.medium}</p>
          <p className="font-mono text-[11px] opacity-80">{item.dimensions}</p>
          {item.location && (
            <p className="text-[11px] italic opacity-60">Archive Location: {item.location}</p>
          )}
        </div>

        {/* Provenance & Custody Trail */}
        {item.provenanceText && (
          <div className="pt-4 border-t border-white/10">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)] mb-2 font-semibold">
              Provenance & Custodial Trail
            </span>
            <p
              className={cn(
                "text-xs leading-relaxed text-[#BCB7AC]",
                isEditorial ? "font-serif text-[13px]" : "font-sans text-xs"
              )}
            >
              {item.provenanceText}
            </p>
          </div>
        )}

        {/* Rights & Department Metadata */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#8C887F]">
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

  // Gallery Wall Pinned view: Streamlined, breathable, zero text walls!
  return (
    <div
      className={cn(
        "relative select-text pt-4 transition-colors",
        className
      )}
    >
      {/* Title & Date */}
      <div className="flex items-baseline justify-between gap-4 mb-1.5">
        <h3
          className={cn(
            "text-lg sm:text-xl font-normal leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors",
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

      {/* Medium & Dimensions */}
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {item.medium} <span className="opacity-40">•</span> {item.dimensions}
      </p>

      {/* Subtle Call to Action */}
      <button
        onClick={onInspect}
        className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[var(--color-accent)] opacity-80 hover:opacity-100 transition-opacity"
      >
        <span>Examine Specimen</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
};
