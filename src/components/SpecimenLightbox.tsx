"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArchivalItem } from "@/types/schema";
import { MuseumLabel } from "./MuseumLabel";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface SpecimenLightboxProps {
  item: ArchivalItem | null;
  items: ArchivalItem[];
  onClose: () => void;
  onSelectSpecimen: (item: ArchivalItem) => void;
}

export const SpecimenLightbox: React.FC<SpecimenLightboxProps> = ({
  item,
  items,
  onClose,
  onSelectSpecimen,
}) => {
  const { aestheticType } = useTheme();

  // Transform matrix state for micro-viewer
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showLabel, setShowLabel] = useState<boolean>(true);
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

  // Pointer-wheel zoom centered on cursor
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

    setScale((prevScale) => {
      const newScale = Math.min(Math.max(0.6, prevScale * zoomFactor), 6.5);
      
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

  // Pointer grab & pan
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

  // Keyboard navigation & Esc-dismissal
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigateSpecimen(-1);
      } else if (e.key === "ArrowRight") {
        navigateSpecimen(1);
      } else if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(6.5, s * 1.25));
      } else if (e.key === "-") {
        setScale((s) => Math.max(0.6, s * 0.8));
      } else if (e.key === "0") {
        resetTransform();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, items, onClose]);

  const currentIndex = items.findIndex((i) => i.id === item?.id);

  const navigateSpecimen = (direction: number) => {
    if (currentIndex === -1) return;
    const nextIdx = (currentIndex + direction + items.length) % items.length;
    onSelectSpecimen(items[nextIdx]);
  };

  const copyChicagoCitation = () => {
    if (!item) return;
    const citation = `"${item.title}," ${item.date}. ${item.medium}, ${item.dimensions}. Cabinet des Éphémères, Accession No. ${item.id}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2400);
  };

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Examination room for ${item.title}`}
      className="fixed inset-0 z-50 flex select-none bg-[var(--color-specimen-bg)] text-[#E0DDD5] overflow-hidden"
    >
      {/* Top Editorial Telemetry Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/90 to-transparent pointer-events-auto">
        <div className="flex items-center gap-4 text-xs font-mono tracking-[0.24em] text-[#8E8A82] uppercase">
          <span className="text-white font-medium">{item.id}</span>
          <span className="opacity-30">/</span>
          <span>Folio {currentIndex + 1} of {items.length}</span>
        </div>

        {/* Optical Loupe Readout & Controls */}
        <div className="flex items-center gap-6 text-xs font-mono tracking-widest text-[#8E8A82]">
          <span className="hidden sm:inline opacity-70">
            Loupe: {Math.round(scale * 100)}%
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setScale((s) => Math.min(6.5, s * 1.3))}
              className="text-[#8E8A82] hover:text-white transition-colors"
              title="Zoom In (+)"
            >
              +
            </button>
            <button
              onClick={() => setScale((s) => Math.max(0.6, s * 0.77))}
              className="text-[#8E8A82] hover:text-white transition-colors"
              title="Zoom Out (-)"
            >
              −
            </button>
            <button
              onClick={resetTransform}
              className="text-[11px] uppercase tracking-wider text-[#8E8A82] hover:text-white transition-colors"
              title="Fit to Screen (0)"
            >
              Fit
            </button>
          </div>

          <div className="w-[1px] h-3 bg-white/20" />

          <button
            onClick={() => setShowLabel((prev) => !prev)}
            className={cn(
              "text-[11px] uppercase tracking-[0.16em] transition-colors",
              showLabel ? "text-[#CBB5A1]" : "text-[#8E8A82] hover:text-white"
            )}
          >
            {showLabel ? "Hide Dossier" : "Show Dossier"}
          </button>

          <button
            onClick={onClose}
            className="text-xs font-mono tracking-widest uppercase text-[#8E8A82] hover:text-white transition-colors pl-2"
            title="Close Viewer (Esc)"
          >
            Close ×
          </button>
        </div>
      </header>

      {/* Main Specimen Stage with Uncropped Natural Proportions */}
      <div
        ref={viewerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative flex-1 h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden touch-none",
          isDragging ? "select-none" : ""
        )}
      >
        {/* Specimen Container with Matrix Transformation */}
        <div
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
            transformOrigin: "center center",
            willChange: "transform",
            transition: isDragging ? "none" : "transform 0.14s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="relative max-w-[85vw] max-h-[85vh] flex items-center justify-center pointer-events-none"
        >
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono uppercase tracking-[0.24em] text-white/40">
              Retrieving Specimen…
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.highResImageUrl}
            alt={item.title}
            onLoad={() => setIsImageLoaded(true)}
            draggable={false}
            className={cn(
              "max-h-[82vh] max-w-[78vw] object-contain transition-opacity duration-700 ease-out select-none",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        {/* Discreet Corner Steppers */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateSpecimen(-1);
          }}
          aria-label="Previous plate"
          className="absolute left-8 top-1/2 -translate-y-1/2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors p-3"
        >
          ← Prev
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateSpecimen(1);
          }}
          aria-label="Next plate"
          className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors p-3"
        >
          Next →
        </button>
      </div>

      {/* Asymmetrical Curatorial Dossier Placard */}
      {showLabel && (
        <aside
          aria-label="Archival Specimen Record"
          className={cn(
            "w-full sm:w-[400px] lg:w-[460px] h-full overflow-y-auto z-20",
            "bg-[#131211]/95 backdrop-blur-md p-8 sm:p-12 border-l border-white/10",
            "transition-transform duration-500 ease-out"
          )}
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 text-xs font-mono tracking-[0.22em] uppercase">
            <span className="text-[#CBB5A1] font-semibold">
              Accession Record
            </span>
            <button
              onClick={() => setShowLabel(false)}
              className="text-[#8E8A82] hover:text-white"
            >
              Dismiss ×
            </button>
          </div>

          <MuseumLabel item={item} variant="lightbox" />

          {/* Academic Citation Generator */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A82]">
              <span>Chicago Citation</span>
              <button
                onClick={copyChicagoCitation}
                className="text-[#CBB5A1] hover:underline"
              >
                {copiedCitation ? "Copied to Clipboard ✓" : "Copy Citation"}
              </button>
            </div>
            <p className="text-xs font-serif italic text-[#A6A198] leading-relaxed select-all bg-white/[0.03] p-3 border border-white/5">
              &ldquo;{item.title},&rdquo; {item.date}. {item.medium}, {item.dimensions}. Cabinet des Éphémères, Accession No. {item.id}.
            </p>
          </div>

          {/* Classification & Subject Descriptors */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[#8E8A82] mb-3">
              Subject Classification
            </span>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-serif italic text-[#D8D3CA] px-2.5 py-1 bg-white/5 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
