"use client";

import React, { useState } from "react";
import { CollectionMetadata } from "@/types/schema";
import { useTheme } from "@/context/ThemeContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";

interface GalleryHeaderProps {
  metadata: CollectionMetadata;
  totalItems: number;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({ metadata, totalItems }) => {
  const { aestheticType } = useTheme();
  const [showStatement, setShowStatement] = useState(false);

  const isEditorial = aestheticType === "editorial-serif";
  const isBrutalist = aestheticType === "brutalist-technical";

  return (
    <header className="mb-20 pt-6 pb-12 border-b border-[var(--color-border)] transition-colors duration-500">
      {/* Top Ledger Masthead */}
      <div className="flex items-center justify-between pb-8 mb-16 border-b border-[var(--color-border)] text-xs font-mono tracking-[0.22em] uppercase text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[var(--color-text-primary)]">
            CABINET DES ÉPHÉMÈRES
          </span>
          <span className="opacity-30">/</span>
          <span className="opacity-70">{metadata.editionDate || "MMXXVI"}</span>
        </div>

        <ThemeSwitcher />
      </div>

      {/* Main Exhibition Identity — Pure Editorial Authority */}
      <div className="space-y-8">
        {/* Subtle chocolate hairline accent */}
        {isEditorial && (
          <div className="w-12 h-[1.5px] bg-[var(--color-accent)] mb-8 opacity-85" />
        )}

        <div className="flex items-baseline gap-4 text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-accent)] font-semibold">Catalogue Raisonné</span>
          <span className="opacity-30">—</span>
          <span>{totalItems} Objects Pinned</span>
        </div>

        {/* High-Impact Avant-Garde Title */}
        <h1
          className={cn(
            "text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.98] tracking-tight text-[var(--color-text-primary)] max-w-5xl",
            isEditorial
              ? "font-serif tracking-tight"
              : isBrutalist
              ? "font-mono font-bold uppercase tracking-tighter"
              : "font-sans font-semibold"
          )}
        >
          Cabinet des Éphémères
        </h1>

        {/* Curatorial Subtext & Expandable Statement */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 items-baseline">
          <p className="md:col-span-8 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-serif italic">
            Curated by <span className="text-[var(--color-text-primary)] not-italic font-normal">{metadata.curator}</span>. {metadata.description}
          </p>

          <div className="md:col-span-4 md:text-right">
            {metadata.curatorialStatement && (
              <button
                onClick={() => setShowStatement(true)}
                className="text-xs font-mono tracking-[0.18em] uppercase text-[var(--color-text-primary)] hover:text-[var(--color-accent)] pb-0.5 border-b border-[var(--color-accent)] transition-colors"
              >
                Curatorial Note [ + ]
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curatorial Note Modal */}
      {showStatement && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative max-w-xl w-full bg-[var(--color-bg)] border border-[var(--color-border)] p-10 sm:p-12 shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--color-accent)] font-semibold">
                Curatorial Note
              </span>
              <button
                onClick={() => setShowStatement(false)}
                className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Close [ × ]
              </button>
            </div>

            <blockquote className="text-lg leading-relaxed text-[var(--color-text-primary)] mb-8 font-serif italic">
              &ldquo;{metadata.curatorialStatement}&rdquo;
            </blockquote>

            <div className="pt-4 border-t border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] flex justify-between">
              <span>{metadata.curator}</span>
              <span>{metadata.institution}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
