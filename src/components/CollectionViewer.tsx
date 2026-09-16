"use client";

import React, { useState, useMemo } from "react";
import { CollectionDatabase, ArchivalItem } from "@/types/schema";
import { useTheme } from "@/context/ThemeContext";
import { GalleryHeader } from "./GalleryHeader";
import { MuseumLabel } from "./MuseumLabel";
import { SpecimenLightbox } from "./SpecimenLightbox";
import { TimelineController } from "./TimelineController";
import { extractYear } from "@/lib/dateUtils";
import { toRomanNumeral, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, Search, Maximize2, Calendar, Filter } from "lucide-react";

interface CollectionViewerProps {
  initialData: CollectionDatabase;
}

export const CollectionViewer: React.FC<CollectionViewerProps> = ({ initialData }) => {
  const { aestheticType } = useTheme();

  // State management: purely client-side data slicing
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSpecimen, setActiveSpecimen] = useState<ArchivalItem | null>(null);
  const [viewMode, setViewMode] = useState<"gallery" | "ledger">("gallery");
  const [showTimeline, setShowTimeline] = useState<boolean>(false);

  const { collectionMetadata, items } = initialData;

  // Extract all distinct movement tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => item.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [items]);

  // Filtered specimen list
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tag filter
      if (selectedTag && !item.tags?.includes(selectedTag)) {
        return false;
      }
      // Year timeline filter
      if (selectedYear !== null) {
        const itemYear = extractYear(item.date);
        if (itemYear !== selectedYear) return false;
      }
      // Text search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMedium = item.medium.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMedium && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedTag, selectedYear, searchQuery]);

  const isEditorial = aestheticType === "editorial-serif";
  const isBrutalist = aestheticType === "brutalist-technical";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-500 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-4">
        {/* Editorial Masthead */}
        <GalleryHeader metadata={collectionMetadata} totalItems={items.length} />

        {/* Minimalist Gallery Navigation & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--color-border)]">
          {/* Movement / Tag Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                "px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all",
                selectedTag === null
                  ? "bg-[var(--color-text-primary)] text-[var(--color-bg)] font-semibold"
                  : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              All Works ({items.length})
            </button>
            {allTags.map((tag) => {
              const count = items.filter((i) => i.tags?.includes(tag)).length;
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all",
                    isSelected
                      ? "bg-[var(--color-accent)] text-white font-semibold"
                      : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {tag} <span className="opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Timeline Toggle, Search, View Switch */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Timeline Filter Toggle Button */}
            <button
              onClick={() => setShowTimeline((prev) => !prev)}
              className={cn(
                "px-3 py-1.5 text-xs font-mono tracking-wider uppercase flex items-center gap-1.5 border transition-all",
                showTimeline || selectedYear !== null
                  ? "bg-[var(--color-surface)] border-[var(--color-accent)] text-[var(--color-accent)] font-semibold"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {selectedYear ? `Era: ${selectedYear}` : "Timeline Filter"}
              </span>
            </button>

            {/* Live Search */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-[var(--color-text-secondary)] pointer-events-none" />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-xs font-mono bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] w-36 sm:w-48"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-[var(--color-border)]">
              <button
                onClick={() => setViewMode("gallery")}
                aria-label="Gallery View"
                title="Gallery View"
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === "gallery"
                    ? "bg-[var(--color-text-primary)] text-[var(--color-bg)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("ledger")}
                aria-label="Scholarly Ledger View"
                title="Scholarly Ledger View"
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === "ledger"
                    ? "bg-[var(--color-text-primary)] text-[var(--color-bg)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible / Expandable Timeline Controller */}
        {showTimeline && (
          <TimelineController
            items={items}
            selectedYear={selectedYear}
            onSelectYear={(year) => setSelectedYear(year)}
          />
        )}

        {/* Specimen Output Canvas */}
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[var(--color-border)] p-12 my-8">
            <p className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">
              No archival specimens match your current filter.
            </p>
            <button
              onClick={() => {
                setSelectedTag(null);
                setSelectedYear(null);
                setSearchQuery("");
              }}
              className="text-xs font-mono underline uppercase tracking-wider text-[var(--color-accent)]"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "gallery" ? (
          /* Editorial Gallery Wall (inspired by Harriet — clean, breathable, artwork-first) */
          <motion.div
            layout
            className={cn(
              "grid gap-y-20 gap-x-12",
              isBrutalist
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[var(--color-border)] gap-0"
                : "grid-cols-1 md:grid-cols-2"
            )}
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                    className={cn(
                      "group relative flex flex-col justify-between",
                      isBrutalist ? "border-r border-b border-[var(--color-border)] p-6" : "",
                      isEditorial && !isEven ? "md:mt-16" : ""
                    )}
                  >
                    {/* Minimalist Specimen Index Header */}
                    <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-[var(--color-border)]/50">
                      <span className="text-xs font-serif italic text-[var(--color-accent)] font-semibold">
                        {toRomanNumeral(index + 1)}
                      </span>
                      <span className="text-[11px] font-mono tracking-widest text-[var(--color-text-secondary)] uppercase">
                        {item.id}
                      </span>
                    </div>

                    {/* Specimen Artwork Image — Large, Card-free, Pure Float */}
                    <div
                      onClick={() => setActiveSpecimen(item)}
                      className="relative overflow-hidden cursor-pointer aspect-[4/3] bg-black/5 flex items-center justify-center group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.highResImageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                      />

                      {/* Click overlay indicator */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="px-4 py-2 bg-black/80 backdrop-blur-sm text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Examine Specimen
                        </div>
                      </div>
                    </div>

                    {/* Minimalist Museum Wall Label (No wall of text!) */}
                    <MuseumLabel
                      item={item}
                      variant="wall-pinned"
                      onInspect={() => setActiveSpecimen(item)}
                    />
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Scholarly Archival Ledger Table Mode */
          <div className="w-full overflow-x-auto border border-[var(--color-border)] my-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">
                  <th className="p-4">Accession</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Medium</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-xs">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveSpecimen(item)}
                    className="hover:bg-[var(--color-surface)]/70 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-mono text-[11px] text-[var(--color-text-secondary)]">
                      {item.id}
                    </td>
                    <td className="p-4 font-medium text-[var(--color-text-primary)]">
                      {item.title}
                    </td>
                    <td className="p-4 font-mono">{item.date}</td>
                    <td className="p-4 text-[var(--color-text-secondary)]">{item.medium}</td>
                    <td className="p-4 font-mono text-[11px] text-[var(--color-text-secondary)]">
                      {item.dimensions}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-mono text-[var(--color-accent)] group-hover:underline uppercase tracking-wider">
                        Inspect →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* High-Performance Museum Specimen Lightbox */}
      <SpecimenLightbox
        item={activeSpecimen}
        items={filteredItems}
        onClose={() => setActiveSpecimen(null)}
        onSelectSpecimen={(specimen) => setActiveSpecimen(specimen)}
      />
    </div>
  );
};
