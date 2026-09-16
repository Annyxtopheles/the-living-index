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

interface CollectionViewerProps {
  initialData: CollectionDatabase;
}

export const CollectionViewer: React.FC<CollectionViewerProps> = ({ initialData }) => {
  const { aestheticType } = useTheme();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSpecimen, setActiveSpecimen] = useState<ArchivalItem | null>(null);
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"gallery" | "inventory">("gallery");

  const { collectionMetadata, items } = initialData;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => item.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedTag && !item.tags?.includes(selectedTag)) {
        return false;
      }
      if (selectedYear !== null) {
        const itemYear = extractYear(item.date);
        if (itemYear !== selectedYear) return false;
      }
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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-700 pb-32">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-12 lg:px-16 pt-6">
        {/* Editorial Masthead */}
        <GalleryHeader metadata={collectionMetadata} totalItems={items.length} />

        {/* Curatorial Controls & Navigation — Minimal & Editorial */}
        <nav aria-label="Curatorial Filters" className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-6 pb-6 mb-16 border-b border-[var(--color-border)] text-xs font-mono tracking-[0.18em] uppercase">
          {/* Movement Taxonomy Links */}
          <div className="flex flex-wrap items-center gap-6 text-[var(--color-text-secondary)]">
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                "pb-0.5 transition-colors",
                selectedTag === null
                  ? "text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-accent)]"
                  : "hover:text-[var(--color-text-primary)]"
              )}
            >
              All Objects ({items.length})
            </button>
            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={cn(
                    "pb-0.5 transition-colors",
                    isSelected
                      ? "text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-accent)]"
                      : "hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Timeline, Search, View Mode */}
          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setShowTimeline((prev) => !prev)}
              className={cn(
                "pb-0.5 transition-colors",
                showTimeline || selectedYear !== null
                  ? "text-[var(--color-accent)] font-semibold border-b border-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {selectedYear ? `Era: ${selectedYear}` : "Chronology [ + ]"}
            </button>

            {/* Quiet Search */}
            <input
              type="text"
              placeholder="Search index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-[var(--color-border)] pb-0.5 text-xs font-mono text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/60 focus:outline-none focus:border-[var(--color-accent)] w-32 sm:w-40 transition-colors"
            />

            {/* View Mode Switcher */}
            <div className="flex items-center gap-3 text-[11px]">
              <button
                onClick={() => setViewMode("gallery")}
                className={cn(
                  "pb-0.5 transition-colors",
                  viewMode === "gallery"
                    ? "text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                Gallery
              </button>
              <span className="opacity-30">/</span>
              <button
                onClick={() => setViewMode("inventory")}
                className={cn(
                  "pb-0.5 transition-colors",
                  viewMode === "inventory"
                    ? "text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                Ledger
              </button>
            </div>
          </div>
        </nav>

        {/* Collapsible Chronological Axis */}
        {showTimeline && (
          <TimelineController
            items={items}
            selectedYear={selectedYear}
            onSelectYear={(year) => setSelectedYear(year)}
          />
        )}

        {/* Specimen Output Canvas */}
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center border-t border-b border-[var(--color-border)] my-12">
            <p className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-4">
              No archival objects match this criteria.
            </p>
            <button
              onClick={() => {
                setSelectedTag(null);
                setSelectedYear(null);
                setSearchQuery("");
              }}
              className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] border-b border-[var(--color-accent)] pb-0.5"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "gallery" ? (
          /* Editorial Asymmetrical Gallery (Harriet-inspired authentic rhythm) */
          <motion.div
            layout
            className={cn(
              "grid gap-y-28 gap-x-16",
              isBrutalist
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[var(--color-border)] gap-0"
                : "grid-cols-1 md:grid-cols-12"
            )}
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                // Editorial alternating layout spans
                const colSpan = isBrutalist
                  ? ""
                  : index % 3 === 0
                  ? "md:col-span-7"
                  : index % 3 === 1
                  ? "md:col-span-5 md:mt-24"
                  : "md:col-span-6 md:-mt-8";

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    key={item.id}
                    className={cn(
                      "group relative flex flex-col justify-between",
                      isBrutalist ? "border-r border-b border-[var(--color-border)] p-6" : colSpan
                    )}
                  >
                    {/* Specimen Numbering */}
                    <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-[var(--color-border)]/60">
                      <span className="text-sm font-serif italic text-[var(--color-accent)] font-normal">
                        № {toRomanNumeral(index + 1)}
                      </span>
                      <span className="text-[11px] font-mono tracking-[0.2em] text-[var(--color-text-secondary)] uppercase">
                        {item.id}
                      </span>
                    </div>

                    {/* Specimen Artwork Image */}
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
                    </div>

                    {/* Clean Museum Label */}
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
          /* Scholarly Archival Ledger */
          <div className="w-full overflow-x-auto border-t border-b border-[var(--color-border)] my-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                  <th className="py-4 pr-6">Accession</th>
                  <th className="py-4 pr-6">Title</th>
                  <th className="py-4 pr-6">Date</th>
                  <th className="py-4 pr-6">Medium</th>
                  <th className="py-4 pr-6">Dimensions</th>
                  <th className="py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/60 text-xs">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveSpecimen(item)}
                    className="hover:bg-[var(--color-surface)]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pr-6 font-mono text-[11px] text-[var(--color-text-secondary)]">
                      {item.id}
                    </td>
                    <td className="py-4 pr-6 font-serif text-base italic text-[var(--color-text-primary)]">
                      {item.title}
                    </td>
                    <td className="py-4 pr-6 font-mono">{item.date}</td>
                    <td className="py-4 pr-6 text-[var(--color-text-secondary)] font-serif">{item.medium}</td>
                    <td className="py-4 pr-6 font-mono text-[11px] text-[var(--color-text-secondary)]">
                      {item.dimensions}
                    </td>
                    <td className="py-4">
                      <span className="text-[10px] font-mono text-[var(--color-accent)] group-hover:underline uppercase tracking-[0.16em]">
                        Examine →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Museum Specimen Lightbox */}
      <SpecimenLightbox
        item={activeSpecimen}
        items={filteredItems}
        onClose={() => setActiveSpecimen(null)}
        onSelectSpecimen={(specimen) => setActiveSpecimen(specimen)}
      />
    </div>
  );
};
