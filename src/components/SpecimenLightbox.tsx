"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArchivalItem } from "@/types/schema";
import { MuseumLabel } from "./MuseumLabel";
import { useTheme } from "@/context/ThemeContext";
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Info } from "lucide-react";
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
  }, [item?.id]);

  // Handle pointer-wheel zoom centered on cursor
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

    setScale((prevScale) => {
      const newScale = Math.min(Math.max(0.6, prevScale * zoomFactor), 6.5);
      
      // Compute zoom relative to cursor position inside viewer
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

  // Pointer Grab-and-Drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary mouse button or touch
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
        setScale((s) => Math.min(6.5, s * 1.2));
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

  if (!item) return null;

  const isBrutalist = aestheticType === "brutalist-technical";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Museum specimen lightbox for ${item.title}`}
      className="fixed inset-0 z-50 flex select-none bg-[var(--color-specimen-bg)] text-[#E0DDD5] overflow-hidden"
    >
      {/* Top Gallery Telemetry Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#9E9A90] uppercase">
            <span>INDEX</span>
            <span className="opacity-40">/</span>
            <span className="text-white font-medium">{item.id}</span>
            <span className="opacity-40">/</span>
            <span>
              {currentIndex + 1} OF {items.length}
            </span>
          </div>
        </div>

        {/* Center zoom telemetry readout */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-mono tracking-widest text-[#9E9A90]">
          <span>ZOOM: {Math.round(scale * 100)}%</span>
          <span className="opacity-40">|</span>
          <span className="opacity-70 text-[10px] uppercase">Scroll wheel or drag to examine</span>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.min(6.5, s * 1.25))}
            aria-label="Zoom in"
            title="Zoom In (+)"
            className="p-2 text-[#9E9A90] hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.6, s * 0.8))}
            aria-label="Zoom out"
            title="Zoom Out (-)"
            className="p-2 text-[#9E9A90] hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetTransform}
            aria-label="Reset viewport"
            title="Reset Zoom (0)"
            className="p-2 text-[#9E9A90] hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowLabel((prev) => !prev)}
            aria-label="Toggle specimen label"
            title="Toggle Label"
            className={cn(
              "p-2 transition-colors",
              showLabel ? "text-[var(--color-accent)]" : "text-[#9E9A90] hover:text-white"
            )}
          >
            <Info className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/20 mx-1" />
          <button
            onClick={onClose}
            aria-label="Close specimen viewer"
            title="Close (Esc)"
            className="p-2 text-[#9E9A90] hover:text-white hover:rotate-90 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Specimen Stage with Hardware-Accelerated Pan/Zoom Matrix */}
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
            transition: isDragging ? "none" : "transform 0.12s cubic-bezier(0.2, 0, 0, 1)",
          }}
          className="relative max-w-[85vw] max-h-[85vh] flex items-center justify-center pointer-events-none"
        >
          {/* Subtle archival loader */}
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono uppercase tracking-widest text-white/50">
              Retrieving Specimen...
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.highResImageUrl}
            alt={item.title}
            onLoad={() => setIsImageLoaded(true)}
            draggable={false}
            className={cn(
              "max-h-[80vh] max-w-[80vw] object-contain transition-opacity duration-700 ease-out select-none",
              // Clean museum display: zero cards or drop-shadows
              isImageLoaded ? "opacity-100" : "opacity-0",
              isBrutalist ? "filter contrast-110" : ""
            )}
          />
        </div>

        {/* Specimen Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateSpecimen(-1);
          }}
          aria-label="Previous specimen"
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateSpecimen(1);
          }}
          aria-label="Next specimen"
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Asymmetrical Museum Wall Label Pinned to Side */}
      {showLabel && (
        <aside
          aria-label="Archival Specimen Details"
          className={cn(
            "w-full sm:w-[380px] lg:w-[440px] h-full overflow-y-auto z-20",
            "bg-[#151413]/90 backdrop-blur-md p-8 sm:p-10 border-l border-white/10",
            "transition-transform duration-500 ease-out"
          )}
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-accent)] font-semibold">
              Archival Object Ledger
            </span>
            <button
              onClick={() => setShowLabel(false)}
              className="text-xs text-white/50 hover:text-white font-mono"
            >
              HIDE [X]
            </button>
          </div>

          <MuseumLabel item={item} variant="lightbox" />

          {/* Archival Tag Index */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[#9E9A90] mb-2.5">
              Taxonomy & Categorization
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono px-2.5 py-1 bg-white/5 border border-white/10 text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
