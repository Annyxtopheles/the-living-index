"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArchivalItem } from "@/types/schema";
import { AccessionPlacard } from "./AccessionPlacard";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface SpecimenDossierProps {
  item: ArchivalItem | null;
  items: ArchivalItem[];
  onClose: () => void;
  onSelectSpecimen: (item: ArchivalItem) => void;
}

export const SpecimenDossier: React.FC<SpecimenDossierProps> = ({
  item,
  items,
  onClose,
  onSelectSpecimen,
}) => {
  const { aestheticType } = useTheme();

  // Loupe & pan state
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"provenance" | "materials" | "microclimate" | "placard">("provenance");
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });
  const viewerRef = useRef<HTMLDivElement>(null);

  // Reset transform when specimen changes
  useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setIsImageLoaded(false);
    setCopiedCitation(false);
  }, [item?.id]);

  // Pointer wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

    setScale((prevScale) => {
      const newScale = Math.min(Math.max(0.5, prevScale * zoomFactor), 6.0);
      if (viewerRef.current) {
        const rect = viewerRef.current.getBoundingClientRect();
        const cursorX = e.clientX - rect.left - rect.width / 2;
        const cursorY = e.clientY - rect.top - rect.height / 2;

        setPan((prevPan) => ({
          x: cursorX - (cursorX - prevPan.x) * (newScale / prevScale),
          y: cursorY - (cursorY - prevPan.y) * (newScale / prevScale),
        }));
      }
      return newScale;
    });
  }, []);

  // Pointer drag & pan
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe capture release
      }
    }
  };

  const resetTransform = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const currentIndex = items.findIndex((i) => i.id === item?.id);

  const navigateSpecimen = (direction: number) => {
    if (currentIndex === -1 || items.length === 0) return;
    const nextIdx = (currentIndex + direction + items.length) % items.length;
    onSelectSpecimen(items[nextIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when focusing inputs or buttons
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigateSpecimen(-1);
      } else if (e.key === "ArrowRight") {
        navigateSpecimen(1);
      } else if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(6.0, s * 1.25));
      } else if (e.key === "-") {
        setScale((s) => Math.max(0.5, s * 0.8));
      } else if (e.key === "0") {
        resetTransform();
      } else if (e.key.toLowerCase() === "g") {
        setShowGrid((prev) => !prev);
      } else if (e.key.toLowerCase() === "d") {
        setShowDrawer((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, items, currentIndex, onClose]);

  const copyChicagoCitation = () => {
    if (!item) return;
    const citation = `"${item.title}," ${item.date}. ${item.medium}, ${item.dimensions}. The Living Index Archival Trust, Accession No. ${item.accessionCode}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2400);
  };

  if (!item) return null;

  const isEditorial = aestheticType === "editorial-serif";

  const getConditionGradeBadge = (grade: string) => {
    if (grade.includes("Grade I")) {
      return "border-emerald-600/40 text-emerald-400 bg-emerald-950/40";
    }
    if (grade.includes("Grade II")) {
      return "border-amber-600/40 text-amber-400 bg-amber-950/40";
    }
    return "border-rose-600/40 text-rose-400 bg-rose-950/40";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Curatorial Inspection Dossier: ${item.title}`}
      className="fixed inset-0 z-50 flex select-none bg-[var(--color-specimen-bg)] text-[#E2DFD8] overflow-hidden"
    >
      {/* Top Telemetry & Control Masthead */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-8 py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-auto border-b border-white/5">
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono tracking-[0.2em] text-[#8E8A82] uppercase">
          <span className="text-white font-bold tracking-wider">{item.accessionCode}</span>
          <span className="opacity-30">/</span>
          <span className="hidden sm:inline">{item.category}</span>
          <span className="opacity-30 hidden sm:inline">/</span>
          <span>Specimen {currentIndex + 1} of {items.length}</span>
        </div>

        {/* Loupe & Grid Overlay Controls */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono tracking-widest text-[#8E8A82]">
          <button
            type="button"
            onClick={() => setShowGrid((prev) => !prev)}
            className={cn(
              "px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors flex items-center gap-1.5",
              showGrid
                ? "border-emerald-500/50 text-emerald-400 bg-emerald-950/30 font-semibold"
                : "border-white/10 text-[#8E8A82] hover:text-white"
            )}
            title="Toggle Metric Millimeter Inspection Grid (Shortcut: G)"
          >
            <span>Grid [G]</span>
            <span className={cn("w-1.5 h-1.5 rounded-full", showGrid ? "bg-emerald-400" : "bg-white/20")} />
          </button>

          <div className="hidden md:flex items-center gap-3">
            <span className="opacity-70 text-[11px]">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(6.0, s * 1.3))}
              className="text-[#8E8A82] hover:text-white text-base font-mono px-1"
              title="Zoom In (+)"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.5, s * 0.77))}
              className="text-[#8E8A82] hover:text-white text-base font-mono px-1"
              title="Zoom Out (-)"
            >
              &minus;
            </button>
            <button
              type="button"
              onClick={resetTransform}
              className="text-[10px] uppercase tracking-wider text-[#8E8A82] hover:text-white border border-white/10 px-1.5 py-0.5"
              title="Fit to Screen (0)"
            >
              Fit
            </button>
          </div>

          <div className="w-[1px] h-3 bg-white/20" />

          <button
            type="button"
            onClick={() => setShowDrawer((prev) => !prev)}
            className={cn(
              "text-[11px] uppercase tracking-[0.16em] transition-colors",
              showDrawer ? "text-[#CBB5A1] font-semibold" : "text-[#8E8A82] hover:text-white"
            )}
            title="Toggle Inspector Drawer (Shortcut: D)"
          >
            {showDrawer ? "Hide Dossier [D]" : "Show Dossier [D]"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono tracking-widest uppercase text-[#8E8A82] hover:text-white transition-colors pl-2"
            title="Close Dossier (Esc)"
          >
            Close [Esc] &times;
          </button>
        </div>
      </header>

      {/* Main Specimen Inspection Stage */}
      <div
        ref={viewerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative flex-1 h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden touch-none",
          showGrid ? "inspection-grid" : "",
          isDragging ? "select-none" : ""
        )}
      >
        {/* Inspection Crosshair */}
        {showGrid && <div className="inspection-crosshair" />}

        {/* Specimen Container with Matrix Transformation */}
        <div
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
            transformOrigin: "center center",
            willChange: "transform",
            transition: isDragging ? "none" : "transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="relative max-w-[85vw] max-h-[85vh] flex items-center justify-center pointer-events-none"
        >
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono uppercase tracking-[0.24em] text-white/40">
              Retrieving High-Resolution Specimen Plate…
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.highResImageUrl}
            alt={item.title}
            onLoad={() => setIsImageLoaded(true)}
            draggable={false}
            className={cn(
              "max-h-[80vh] max-w-[75vw] object-contain transition-opacity duration-500 ease-out select-none shadow-2xl",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        {/* Prev / Next specimen steppers */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigateSpecimen(-1);
          }}
          aria-label="Previous archival plate"
          className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors p-3 bg-black/40 border border-white/10 hover:border-white/30 backdrop-blur-xs"
        >
          &larr; Prev
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigateSpecimen(1);
          }}
          aria-label="Next archival plate"
          className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors p-3 bg-black/40 border border-white/10 hover:border-white/30 backdrop-blur-xs"
        >
          Next &rarr;
        </button>
      </div>

      {/* Slide-Out Inspector Drawer */}
      {showDrawer && (
        <aside
          aria-label="Curatorial Specimen Dossier"
          className={cn(
            "w-full sm:w-[480px] lg:w-[540px] h-full overflow-y-auto z-20 shrink-0",
            "bg-[#11100F] border-l border-white/10 p-6 sm:p-10",
            "transition-transform duration-300 ease-out select-text"
          )}
        >
          {/* Drawer Accession Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs font-mono tracking-[0.2em] uppercase">
            <span className="text-[#CBB5A1] font-semibold">
              Curatorial Dossier
            </span>
            <span className={cn("px-2 py-0.5 text-[10px] font-semibold border", getConditionGradeBadge(item.conditionGrade))}>
              {item.conditionGrade}
            </span>
          </div>

          {/* Title & Epoch */}
          <div className="mb-6">
            <div className="text-[11px] font-mono text-[#8E8A82] uppercase tracking-widest mb-1">
              Accession ID: {item.accessionCode} · {item.date}
            </div>
            <h2
              className={cn(
                "text-2xl sm:text-3xl leading-snug text-[#F5F2EB]",
                isEditorial ? "font-serif italic font-normal" : "font-mono font-bold uppercase"
              )}
            >
              {item.title}
            </h2>
            <p className="text-xs text-[#A6A198] font-serif italic mt-2 leading-relaxed">
              {item.medium}
            </p>
          </div>

          {/* Dossier Section Tabs */}
          <div className="flex border-b border-white/10 mb-6 text-[11px] font-mono uppercase tracking-[0.14em]">
            <button
              type="button"
              onClick={() => setActiveTab("provenance")}
              className={cn(
                "pb-2.5 px-3 transition-colors",
                activeTab === "provenance"
                  ? "text-[#CBB5A1] border-b-2 border-[#CBB5A1] font-semibold"
                  : "text-[#8E8A82] hover:text-white"
              )}
            >
              Provenance Chain ({item.provenanceChain.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("materials")}
              className={cn(
                "pb-2.5 px-3 transition-colors",
                activeTab === "materials"
                  ? "text-[#CBB5A1] border-b-2 border-[#CBB5A1] font-semibold"
                  : "text-[#8E8A82] hover:text-white"
              )}
            >
              Material & Spectral
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("microclimate")}
              className={cn(
                "pb-2.5 px-3 transition-colors",
                activeTab === "microclimate"
                  ? "text-[#CBB5A1] border-b-2 border-[#CBB5A1] font-semibold"
                  : "text-[#8E8A82] hover:text-white"
              )}
            >
              Vault Climate
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("placard")}
              className={cn(
                "pb-2.5 px-3 transition-colors",
                activeTab === "placard"
                  ? "text-[#CBB5A1] border-b-2 border-[#CBB5A1] font-semibold"
                  : "text-[#8E8A82] hover:text-white"
              )}
            >
              Placard
            </button>
          </div>

          {/* Tab 1: Provenance Chain Ledger */}
          {activeTab === "provenance" && (
            <div className="space-y-6">
              <div className="text-xs font-serif italic text-[#C0BBB0] leading-relaxed p-3 bg-white/[0.03] border border-white/5">
                {item.provenanceText}
              </div>

              <div className="space-y-4 pt-2">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A82]">
                  Chronological Ownership Chain
                </span>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                  {item.provenanceChain.map((event, idx) => (
                    <div key={idx} className="relative font-mono text-xs space-y-1">
                      <span className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-[#CBB5A1] ring-4 ring-[#11100F]" />
                      <div className="flex items-baseline justify-between text-[11px]">
                        <span className="text-[#CBB5A1] font-bold">{event.date}</span>
                        <span className="text-[10px] text-[#8E8A82] uppercase">{event.transferType}</span>
                      </div>
                      <div className="text-white/95 font-medium">{event.holder}</div>
                      <div className="text-[10px] text-[#8E8A82]">{event.location}</div>
                      {event.notes && (
                        <p className="text-[11px] font-serif italic text-[#9F9A90] pt-1">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Material & Spectral Diagnostics */}
          {activeTab === "materials" && (
            <div className="space-y-6 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A82] mb-1">
                  Substrate & Material Composition
                </span>
                <p className="font-serif italic text-[#E0DDD5] leading-relaxed">
                  {item.mediumSubstrate || item.medium}
                </p>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A82] mb-1">
                  Physical Dimensions
                </span>
                <p className="font-mono text-[#E0DDD5]">{item.dimensions}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A82] mb-3">
                  Spectral & Analytical Diagnostics
                </span>
                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#8E8A82] uppercase block">IR Reflectography</span>
                    <span className={item.spectralImaging.infraredReflectography ? "text-emerald-400 font-bold" : "text-[#8E8A82]"}>
                      {item.spectralImaging.infraredReflectography ? "COMPLETED [✓]" : "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#8E8A82] uppercase block">UV Fluorescence</span>
                    <span className={item.spectralImaging.uvFluorescence ? "text-emerald-400 font-bold" : "text-[#8E8A82]"}>
                      {item.spectralImaging.uvFluorescence ? "COMPLETED [✓]" : "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#8E8A82] uppercase block">Radiography Scan</span>
                    <span className={item.spectralImaging.radiographyScan ? "text-emerald-400 font-bold" : "text-[#8E8A82]"}>
                      {item.spectralImaging.radiographyScan ? "ARCHIVED [✓]" : "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-[#8E8A82] uppercase block">Condition State</span>
                    <span className="text-amber-400 font-bold">{item.conditionGrade}</span>
                  </div>
                </div>

                {item.spectralImaging.xrfAnalysis && (
                  <div className="mt-3 p-3 bg-white/[0.02] border border-white/10 space-y-1 font-mono text-[11px]">
                    <span className="text-[10px] text-[#8E8A82] uppercase block">XRF Chemical Alloy Scan</span>
                    <span className="text-white/90">{item.spectralImaging.xrfAnalysis}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A82] mb-1">
                  Curatorial Conservation Notes
                </span>
                <p className="font-serif italic text-[#BCB7AC] leading-relaxed">
                  {item.curatorialNotes}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Storage Microclimate Telemetry */}
          {activeTab === "microclimate" && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-4 bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
                  <span className="text-[#8E8A82] uppercase">Storage Facility:</span>
                  <span className="font-bold text-white">{item.storageMicroclimate.vaultDesignation}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
                  <span className="text-[#8E8A82] uppercase">Target Relative Humidity (RH):</span>
                  <span className="font-bold text-emerald-400">{item.storageMicroclimate.targetRH}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
                  <span className="text-[#8E8A82] uppercase">Target Temperature:</span>
                  <span className="font-bold text-white">{item.storageMicroclimate.temperatureRange}</span>
                </div>
                <div className="text-[11px] pt-1">
                  <span className="text-[#8E8A82] uppercase block mb-1">Atmospheric Protocol:</span>
                  <p className="text-white/80 font-serif italic">{item.storageMicroclimate.atmosphericEnvironment}</p>
                </div>
              </div>

              <div className="text-[10px] text-[#8E8A82] space-y-1">
                <div>Sensor Calibration: {item.storageMicroclimate.sensorTelemetry || "Calibrated"}</div>
                <div>Location Designation: {item.location}</div>
                <div>Departmental Custody: {item.department}</div>
              </div>
            </div>
          )}

          {/* Tab 4: Printable Accession Placard */}
          {activeTab === "placard" && (
            <div className="space-y-6">
              <AccessionPlacard item={item} />
            </div>
          )}

          {/* Scholarly Citation Box */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A82]">
              <span>Chicago Manual of Style Citation</span>
              <button
                type="button"
                onClick={copyChicagoCitation}
                className="text-[#CBB5A1] hover:underline"
              >
                {copiedCitation ? "Copied to Clipboard ✓" : "Copy Citation"}
              </button>
            </div>
            <p className="text-xs font-serif italic text-[#A6A198] leading-relaxed select-all bg-white/[0.03] p-3 border border-white/5">
              &ldquo;{item.title},&rdquo; {item.date}. {item.medium}, {item.dimensions}. The Living Index Archival Trust, Accession No. {item.accessionCode}.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
};
