"use client";

import React, { useState, useEffect, useRef } from "react";
import { CollectionMetadata } from "@/types/schema";
import { useTheme } from "@/context/ThemeContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";

interface CuratorialHeaderProps {
  metadata: CollectionMetadata;
  totalItems: number;
  yearRange: { min: number; max: number };
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CuratorialHeader: React.FC<CuratorialHeaderProps> = ({
  metadata,
  totalItems,
  yearRange,
  searchQuery,
  onSearchChange,
}) => {
  const { aestheticType } = useTheme();
  const [showStatement, setShowStatement] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isEditorial = aestheticType === "editorial-serif";
  const telemetry = metadata.environmentalTelemetry;

  // Keyboard shortcut listener for '/' to focus search, 'Escape' to blur/clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        if (searchQuery) {
          onSearchChange("");
        } else {
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, onSearchChange]);

  return (
    <header className="mb-14 pt-8 pb-10 border-b border-[var(--color-border)] transition-colors duration-300">
      {/* Top Registry Masthead */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[var(--color-border)] text-xs font-mono tracking-[0.22em] uppercase text-[var(--color-text-secondary)] gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-2 h-2 bg-[var(--color-accent)] inline-block" />
          <span className="font-semibold text-[var(--color-text-primary)] tracking-widest">
            {metadata.name}
          </span>
          <span className="opacity-30">/</span>
          <span className="opacity-70">{metadata.editionDate || "MMXXVI REGISTRY"}</span>
          <span className="opacity-30 hidden sm:inline">/</span>
          <span className="opacity-70 hidden sm:inline">{metadata.institution}</span>
        </div>

        <div className="flex items-center gap-6 self-start md:self-auto">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Conservation Climate Telemetry Bar */}
      {telemetry && (
        <aside
          aria-label="Conservational Vault Telemetry"
          className="mb-10 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-secondary)] flex flex-wrap items-center justify-between gap-y-2 gap-x-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold text-[var(--color-text-primary)]">
              VAULT TELEMETRY
            </span>
            <span className="opacity-40">|</span>
            <span className="text-[var(--color-text-primary)]">{telemetry.vaultDesignation}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 tracking-wider">
            <div>
              <span className="opacity-60 text-[10px] uppercase block sm:inline mr-1">Target RH:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{telemetry.relativeHumidity}</span>
            </div>
            <div>
              <span className="opacity-60 text-[10px] uppercase block sm:inline mr-1">Temp:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{telemetry.temperature}</span>
            </div>
            <div className="hidden lg:block">
              <span className="opacity-60 text-[10px] uppercase mr-1">Atmosphere:</span>
              <span className="text-[var(--color-text-primary)]">{telemetry.atmosphere}</span>
            </div>
            <div>
              <span className="inline-flex items-center px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border border-emerald-700/30 text-emerald-800 bg-emerald-500/10">
                {telemetry.sensorHealth}
              </span>
            </div>
          </div>
        </aside>
      )}

      {/* Primary Curatorial Title & Scope */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline gap-4 text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-accent)] font-semibold">
            Scholarly Custodial Registry
          </span>
          <span className="opacity-30">—</span>
          <span>{totalItems} Primary Specimens Catalogued</span>
          <span className="opacity-30">—</span>
          <span>Accession Epoch: {yearRange.min} — {yearRange.max}</span>
        </div>

        <h1
          className={cn(
            "text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.0] tracking-tight text-[var(--color-text-primary)] max-w-5xl",
            isEditorial ? "font-heading font-serif" : "font-mono font-bold uppercase tracking-tight"
          )}
        >
          {metadata.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-baseline">
          <p className="lg:col-span-8 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-body">
            {metadata.description}
          </p>

          <div className="lg:col-span-4 lg:text-right">
            {metadata.curatorialStatement && (
              <button
                type="button"
                onClick={() => setShowStatement(true)}
                className="inline-flex items-center gap-1.5 text-xs font-mono tracking-[0.18em] uppercase text-[var(--color-text-primary)] hover:text-[var(--color-accent)] pb-1 border-b border-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
              >
                <span>Curatorial Mandate & Protocol</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Instant Search Bar with '/' Shortcut */}
        <div className="pt-6">
          <div className="relative max-w-2xl">
            <label htmlFor="curatorial-search" className="sr-only">
              Search accession code, title, material substrate, or provenance
            </label>
            <input
              ref={searchInputRef}
              id="curatorial-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by accession ID, material, provenance, or category... (Press '/' to focus)"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] py-3 pl-4 pr-24 text-sm font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] placeholder:opacity-60 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="pointer-events-auto text-[11px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] uppercase px-1.5 py-0.5 border border-[var(--color-border)]"
                >
                  Clear [Esc]
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-border)] bg-[var(--color-bg)] uppercase shadow-xs">
                  /
                </kbd>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curatorial Statement Dialog */}
      {showStatement && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="statement-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs"
        >
          <div className="relative max-w-2xl w-full bg-[var(--color-bg)] border border-[var(--color-border)] p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
              <span id="statement-title" className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--color-accent)] font-semibold">
                Curatorial Mandate & Protocol
              </span>
              <button
                type="button"
                onClick={() => setShowStatement(false)}
                className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Close [Esc] &times;
              </button>
            </div>

            <blockquote className="text-lg leading-relaxed text-[var(--color-text-primary)] mb-8 font-body italic">
              &ldquo;{metadata.curatorialStatement}&rdquo;
            </blockquote>

            <div className="pt-6 border-t border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] grid grid-cols-2 gap-4">
              <div>
                <span className="opacity-50 block uppercase text-[10px]">Curator:</span>
                <span className="text-[var(--color-text-primary)] font-medium">{metadata.curator}</span>
              </div>
              <div>
                <span className="opacity-50 block uppercase text-[10px]">Custodial Authority:</span>
                <span className="text-[var(--color-text-primary)] font-medium">{metadata.institution}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
