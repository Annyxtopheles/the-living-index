"use client";

import React, { useState, useMemo } from "react";
import { CollectionDatabase, ArchivalItem, ObjectCategory } from "@/types/schema";
import { CuratorialHeader } from "./CuratorialHeader";
import { MuseumLabel } from "./MuseumLabel";
import { SpecimenLightbox } from "./SpecimenLightbox";
import { Colophon } from "./Colophon";
import { toRomanNumeral, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CollectionViewerProps {
  initialData: CollectionDatabase;
}

type SortField = "accessionCode" | "acquisitionYear" | "title" | "category" | "conditionGrade";
type SortDirection = "asc" | "desc";

export const CollectionViewer: React.FC<CollectionViewerProps> = ({ initialData }) => {
  const { collectionMetadata, items } = initialData;

  const [selectedCategory, setSelectedCategory] = useState<ObjectCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSpecimen, setActiveSpecimen] = useState<ArchivalItem | null>(null);
  const [viewMode, setViewMode] = useState<"plates" | "ledger">("plates");
  
  // Ledger sorting state
  const [sortField, setSortField] = useState<SortField>("acquisitionYear");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // All distinct categories
  const categories: ObjectCategory[] = [
    "Horological Complications",
    "Rare Botanical Folios",
    "Mineral / Tectonic Specimens",
    "Sub-Antarctic Ephemera",
  ];

  // Year range telemetry
  const yearRange = useMemo(() => {
    const years = items.map((i) => i.acquisitionYear);
    return {
      min: Math.min(...years),
      max: Math.max(...years),
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMedium = item.medium.toLowerCase().includes(query) || item.mediumSubstrate.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesProvenance = item.provenanceText.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMedium && !matchesId && !matchesCategory && !matchesProvenance) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  // Sorted items for ledger view
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      if (sortField === "acquisitionYear") {
        comparison = a.acquisitionYear - b.acquisitionYear;
      } else if (sortField === "accessionCode") {
        comparison = a.accessionCode.localeCompare(b.accessionCode);
      } else if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === "conditionGrade") {
        comparison = a.conditionGrade.localeCompare(b.conditionGrade);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredItems, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getConditionGradeBadge = (grade: string) => {
    if (grade.includes("Grade I")) {
      return "border-emerald-700/40 text-emerald-800 bg-emerald-500/10";
    }
    if (grade.includes("Grade II")) {
      return "border-amber-700/40 text-amber-800 bg-amber-500/10";
    }
    return "border-rose-700/40 text-rose-800 bg-rose-500/10";
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-500 pb-28">
      <div className="max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-16 pt-6">
        {/* Curatorial Header with Vault Telemetry & Instant Search */}
        <CuratorialHeader
          metadata={collectionMetadata}
          totalItems={items.length}
          yearRange={yearRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dual-Surface Navigation & Category Filter Strip */}
        <nav
          aria-label="Collection Surface Switcher"
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 mb-16 border-b border-[var(--color-border)] text-xs font-mono tracking-[0.18em] uppercase"
        >
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[var(--color-text-secondary)]">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={cn(
                "pb-1 transition-colors",
                selectedCategory === "ALL"
                  ? "text-[var(--color-text-primary)] font-semibold border-b-2 border-[var(--color-accent)]"
                  : "hover:text-[var(--color-text-primary)]"
              )}
            >
              All Categories ({items.length})
            </button>
            {categories.map((cat) => {
              const count = items.filter((i) => i.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? "ALL" : cat)}
                  className={cn(
                    "pb-1 transition-colors",
                    isSelected
                      ? "text-[var(--color-text-primary)] font-semibold border-b-2 border-[var(--color-accent)]"
                      : "hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Dual-Surface View Mode Toggle: Plates vs Ledger */}
          <div className="flex items-center gap-3 shrink-0 self-start xl:self-auto bg-[var(--color-surface)] px-3 py-1.5 border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-secondary)] mr-1">SURFACE:</span>
            <button
              type="button"
              onClick={() => setViewMode("plates")}
              className={cn(
                "px-2.5 py-1 text-[11px] transition-all",
                viewMode === "plates"
                  ? "bg-[var(--color-bg)] text-[var(--color-text-primary)] font-semibold shadow-xs border border-[var(--color-border)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              Plates View
            </button>
            <span className="opacity-30">/</span>
            <button
              type="button"
              onClick={() => setViewMode("ledger")}
              className={cn(
                "px-2.5 py-1 text-[11px] transition-all",
                viewMode === "ledger"
                  ? "bg-[var(--color-bg)] text-[var(--color-text-primary)] font-semibold shadow-xs border border-[var(--color-border)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              Ledger View
            </button>
          </div>
        </nav>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center border-t border-b border-[var(--color-border)] my-12">
            <p className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-4">
              No archival objects match the active curatorial filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] border-b border-[var(--color-accent)] pb-0.5"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "plates" ? (
          /* ========================================================
             PLATES VIEW: Asymmetric Editorial Passe-Partout Framing
             ======================================================== */
          <div className="space-y-32">
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const isEven = index % 2 === 0;
                const isLeadPiece = index === 0 && selectedCategory === "ALL" && searchQuery === "";

                if (isLeadPiece) {
                  return (
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      key={item.id}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-20 border-b border-[var(--color-border)]"
                    >
                      {/* Left: Monumental Uncropped Plate */}
                      <div className="lg:col-span-8">
                        <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-[var(--color-border)] text-xs font-mono">
                          <span className="font-serif italic text-[var(--color-accent)] font-normal text-sm">
                            Plate № {toRomanNumeral(index + 1)} · Exemplar Specimen
                          </span>
                          <span className="tracking-[0.2em] text-[var(--color-text-secondary)] uppercase">
                            {item.accessionCode}
                          </span>
                        </div>

                        {/* Archival Passe-Partout Mat */}
                        <div
                          onClick={() => setActiveSpecimen(item)}
                          className="archival-mat p-4 sm:p-8 cursor-pointer group transition-all duration-500"
                        >
                          <div className="overflow-hidden flex items-center justify-center bg-black/[0.02]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.highResImageUrl}
                              alt={item.title}
                              loading="eager"
                              className="w-full max-h-[640px] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] select-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Curatorial Marginalia & Label */}
                      <div className="lg:col-span-4 lg:pt-6 space-y-8">
                        <div className="w-12 h-[1.5px] bg-[var(--color-accent)] opacity-80" />

                        <MuseumLabel
                          item={item}
                          variant="wall-pinned"
                          onInspect={() => setActiveSpecimen(item)}
                        />

                        {/* Conservational Microclimate Snapshot */}
                        <div className="pt-6 border-t border-[var(--color-border)] space-y-3 font-mono text-xs">
                          <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                            Microclimate Preservation Vault
                          </span>
                          <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5 text-[11px] text-[var(--color-text-secondary)]">
                            <div className="flex justify-between">
                              <span className="opacity-70">Vault:</span>
                              <span className="font-medium text-[var(--color-text-primary)]">{item.storageMicroclimate.vaultDesignation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-70">Target RH:</span>
                              <span className="font-medium text-[var(--color-text-primary)]">{item.storageMicroclimate.targetRH}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-70">Temp Range:</span>
                              <span className="font-medium text-[var(--color-text-primary)]">{item.storageMicroclimate.temperatureRange}</span>
                            </div>
                          </div>
                        </div>

                        {/* Provenance Extract */}
                        <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
                          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                            Custodial Provenance Extract
                          </span>
                          <p className="text-xs font-serif italic text-[var(--color-text-secondary)] leading-relaxed">
                            {item.provenanceText.split(";")[0]}.
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  );
                }

                // Subsequent Alternating Plates
                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    key={item.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                  >
                    <div className={cn("lg:col-span-7", isEven ? "" : "lg:order-2")}>
                      <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-[var(--color-border)] text-xs font-mono">
                        <span className="font-serif italic text-[var(--color-accent)] font-normal text-sm">
                          Plate № {toRomanNumeral(index + 1)}
                        </span>
                        <span className="tracking-[0.2em] text-[var(--color-text-secondary)] uppercase">
                          {item.accessionCode}
                        </span>
                      </div>

                      <div
                        onClick={() => setActiveSpecimen(item)}
                        className="archival-mat p-4 sm:p-6 cursor-pointer group transition-all duration-500"
                      >
                        <div className="overflow-hidden flex items-center justify-center bg-black/[0.02]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.highResImageUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full max-h-[520px] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] select-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className={cn("lg:col-span-5", isEven ? "lg:pl-6" : "lg:order-1 lg:pr-6")}>
                      <MuseumLabel
                        item={item}
                        variant="wall-pinned"
                        onInspect={() => setActiveSpecimen(item)}
                      />

                      <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
                        <span>Vault RH: {item.storageMicroclimate.targetRH}</span>
                        <span>{item.provenanceChain.length} Provenance Events</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* ========================================================
             INDEX LEDGER VIEW: High-Density Monospaced Tabular Inventory
             ======================================================== */
          <div className="w-full overflow-x-auto border border-[var(--color-border)] bg-[var(--color-surface)] my-8">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                  <th
                    scope="col"
                    onClick={() => handleSort("accessionCode")}
                    className="py-3.5 px-4 cursor-pointer hover:text-[var(--color-text-primary)] select-none"
                  >
                    Accession Code {sortField === "accessionCode" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("category")}
                    className="py-3.5 px-4 cursor-pointer hover:text-[var(--color-text-primary)] select-none"
                  >
                    Category {sortField === "category" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("title")}
                    className="py-3.5 px-4 cursor-pointer hover:text-[var(--color-text-primary)] select-none"
                  >
                    Specimen Title & Substrate {sortField === "title" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("acquisitionYear")}
                    className="py-3.5 px-4 cursor-pointer hover:text-[var(--color-text-primary)] select-none"
                  >
                    Acquisition {sortField === "acquisitionYear" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("conditionGrade")}
                    className="py-3.5 px-4 cursor-pointer hover:text-[var(--color-text-primary)] select-none"
                  >
                    Condition Grade {sortField === "conditionGrade" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Microclimate
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Dossier
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg)]">
                {sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveSpecimen(item)}
                    className="hover:bg-[var(--color-surface)] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono font-medium text-[var(--color-accent)] whitespace-nowrap">
                      {item.accessionCode}
                    </td>
                    <td className="py-4 px-4 text-[var(--color-text-secondary)] whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <div className="font-serif text-sm font-normal text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-secondary)] truncate font-serif italic mt-0.5">
                        {item.medium}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-[var(--color-text-secondary)]">
                      {item.date} <span className="opacity-50 text-[10px]">({item.acquisitionYear})</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={cn("px-2 py-0.5 text-[10px] font-semibold border", getConditionGradeBadge(item.conditionGrade))}>
                        {item.conditionGrade}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-[11px] text-[var(--color-text-secondary)]">
                      <div>{item.storageMicroclimate.targetRH}</div>
                      <div className="text-[10px] opacity-70">{item.storageMicroclimate.temperatureRange}</div>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-[10px] font-mono text-[var(--color-accent)] uppercase tracking-wider group-hover:underline">
                        Examine &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Handcrafted Exhibition Colophon */}
        <Colophon metadata={collectionMetadata} />
      </div>

      {/* Optical Specimen Lightbox / Slide-Out Specimen Dossier */}
      <SpecimenLightbox
        item={activeSpecimen}
        items={filteredItems}
        onClose={() => setActiveSpecimen(null)}
        onSelectSpecimen={(specimen) => setActiveSpecimen(specimen)}
      />
    </div>
  );
};
