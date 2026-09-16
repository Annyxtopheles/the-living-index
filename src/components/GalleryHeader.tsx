"use client";

import React, { useState } from "react";
import { CollectionMetadata } from "@/types/schema";
import { useTheme } from "@/context/ThemeContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";
import { BookOpen, X } from "lucide-react";

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
    <header className="mb-16 pt-4 pb-10 border-b border-[var(--color-border)] transition-colors duration-500">
      {/* Top Minimal Navigation Bar */}
      <div className="flex items-center justify-between pb-6 mb-12 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[var(--color-text-secondary)] uppercase">
          <span className="w-2 h-2 bg-[var(--color-accent)] inline-block" />
          <span className="font-semibold text-[var(--color-text-primary)]">
            {metadata.name.split(":")[0] || "THE LIVING INDEX"}
          </span>
          <span className="opacity-40 hidden sm:inline">/</span>
          <span className="hidden sm:inline opacity-70">
            {metadata.editionDate || "EDITION 2026"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Main Editorial Masthead */}
      <div className="space-y-6">
        {/* Subtle accent rule inspired by Harriet */}
        {isEditorial && (
          <div className="w-12 h-[2px] bg-[var(--color-accent)] mb-4" />
        )}

        <div className="flex flex-wrap items-baseline gap-3 text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-accent)] font-semibold">
            {metadata.institution || "Scholarly Archive"}
          </span>
          <span className="opacity-40">•</span>
          <span>{totalItems} Master Specimens</span>
        </div>

        <h1
          className={cn(
            "text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[var(--color-text-primary)] max-w-5xl",
            isEditorial
              ? "font-serif tracking-tight"
              : isBrutalist
              ? "font-mono font-bold uppercase tracking-tight"
              : "font-sans font-semibold"
          )}
        >
          {metadata.name}
        </h1>

        {/* Short, digestible curatorial subline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Curated by <strong className="text-[var(--color-text-primary)] font-medium">{metadata.curator}</strong>.{" "}
            {metadata.description}
          </p>

          {/* Curatorial Statement Modal Trigger */}
          {metadata.curatorialStatement && (
            <button
              onClick={() => setShowStatement(true)}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent)] hover:underline whitespace-nowrap self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Curatorial Note</span>
            </button>
          )}
        </div>
      </div>

      {/* Curatorial Statement Dialog */}
      {showStatement && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative max-w-xl w-full bg-[var(--color-bg)] border border-[var(--color-border)] p-8 sm:p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border)]">
              <span className="text-xs font-mono tracking-widest uppercase text-[var(--color-accent)] font-semibold">
                Curatorial Note
              </span>
              <button
                onClick={() => setShowStatement(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <blockquote
              className={cn(
                "text-base sm:text-lg leading-relaxed text-[var(--color-text-primary)] mb-6",
                isEditorial ? "font-serif italic" : "font-sans"
              )}
            >
              &ldquo;{metadata.curatorialStatement}&rdquo;
            </blockquote>

            <p className="text-xs font-mono text-[var(--color-text-secondary)]">
              — {metadata.curator}, {metadata.institution}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
