"use client";

import React from "react";
import { ArchivalItem } from "@/types/schema";

interface AccessionPlacardProps {
  item: ArchivalItem;
  onPrint?: () => void;
}

export const AccessionPlacard: React.FC<AccessionPlacardProps> = ({ item, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Screen Card */}
      <div
        id="printable-accession-placard"
        className="bg-[#FAF8F5] text-[#141211] p-6 border-2 border-[#141211] font-mono text-xs select-text shadow-sm"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between border-b-2 border-[#141211] pb-3 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#68625B]">
              The Living Index · Custodial Archive
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-0.5">
              Accession Identification Placard
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-2 py-0.5 border border-[#141211] bg-white">
              {item.accessionCode}
            </span>
          </div>
        </div>

        {/* Specimen Identity */}
        <div className="mb-4">
          <div className="text-[10px] text-[#68625B] uppercase tracking-widest">Specimen Title</div>
          <div className="font-serif italic text-base sm:text-lg font-normal text-[#141211] mt-0.5 leading-snug">
            {item.title}
          </div>
          <div className="text-[11px] text-[#68625B] mt-1 font-serif">
            {item.date} <span className="opacity-50">|</span> Category: {item.category}
          </div>
        </div>

        {/* Material & Physical Dimensions */}
        <div className="grid grid-cols-2 gap-4 border-t border-b border-[#141211]/20 py-2.5 my-3 text-[11px]">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#68625B] block">Substrate Composition:</span>
            <span className="font-serif italic text-[#141211]">{item.mediumSubstrate || item.medium}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#68625B] block">Physical Dimensions:</span>
            <span>{item.dimensions}</span>
          </div>
        </div>

        {/* Condition & Microclimate */}
        <div className="grid grid-cols-2 gap-4 text-[11px] mb-4">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#68625B] block">Conservation State:</span>
            <span className="font-bold uppercase tracking-wide text-[#3E1414]">
              {item.conditionGrade}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#68625B] block">Vault Microclimate:</span>
            <span>
              {item.storageMicroclimate.vaultDesignation.split("·")[0]} ({item.storageMicroclimate.targetRH})
            </span>
          </div>
        </div>

        {/* Curatorial Seal & Sign-off footer */}
        <div className="pt-3 border-t-2 border-[#141211] flex items-end justify-between text-[9px] uppercase tracking-wider text-[#68625B]">
          <div>
            <span>Verified Custodial Registry</span>
            <div className="font-bold text-[#141211] text-[10px] mt-0.5">The Living Index Trust</div>
          </div>
          <div className="text-right">
            <span className="opacity-70">Catalog Ref:</span> {item.catalogNumber || "TLI-REG"}
          </div>
        </div>
      </div>

      {/* Action Button (hidden when printing) */}
      <div className="no-print flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] bg-[#141211] text-[#FAF8F5] px-4 py-2 hover:bg-[#3E1414] transition-colors"
        >
          <span>Print Accession Placard (4×6")</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
        <span className="text-[10px] font-mono text-white/50">
          Standard Archival Index Card Spec
        </span>
      </div>
    </div>
  );
};
