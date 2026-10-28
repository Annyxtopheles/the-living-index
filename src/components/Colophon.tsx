"use client";

import React from "react";
import { CollectionMetadata } from "@/types/schema";
import { cn } from "@/lib/utils";

interface ColophonProps {
  metadata: CollectionMetadata;
  className?: string;
}

export const Colophon: React.FC<ColophonProps> = ({ metadata, className }) => {
  return (
    <footer
      aria-label="Exhibition Colophon"
      className={cn(
        "mt-36 pt-16 border-t border-[var(--color-border)] select-text",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
        {/* Left Column: Archive Identity */}
        <div className="md:col-span-4 space-y-4">
          <div className="w-8 h-[1.5px] bg-[var(--color-accent)] mb-6 opacity-80" />
          <h4 className="text-xs font-mono uppercase tracking-[0.24em] text-[var(--color-accent)] font-semibold">
            Colophon & Archival Ledger
          </h4>
          <p className="text-sm font-serif italic text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
            {metadata.name} is an open-access curatorial registry dedicated to the study of form, shadow, psychological extremity, and the visceral lineage of modern art.
          </p>
          <div className="pt-2 text-xs font-mono text-[var(--color-text-secondary)]">
            <span className="block opacity-60 uppercase tracking-widest text-[10px] mb-1">Custodial Office</span>
            <span>{metadata.institution || "Atelier des Ombres"}</span>
          </div>
        </div>

        {/* Middle Column: Typography & Craft */}
        <div className="md:col-span-4 space-y-4 md:border-l border-[var(--color-border)] md:pl-10">
          <span className="block opacity-60 font-mono uppercase tracking-widest text-[10px] text-[var(--color-text-secondary)]">
            Typography & Typesetting
          </span>
          <p className="text-xs font-serif text-[var(--color-text-secondary)] leading-relaxed">
            Headings are typeset in <strong className="text-[var(--color-text-primary)] font-normal">Cinzel</strong>, drawn from classical Roman epigraphy by Natanael Gama, paired with <strong className="text-[var(--color-text-primary)] font-normal italic">Cormorant Garamond</strong> by Christian Thalmann. Body text is set in <strong className="text-[var(--color-text-primary)] font-normal">Newsreader</strong>, an optical-size text serif by Production Type. Monospaced notation is set in <strong className="text-[var(--color-text-primary)] font-normal">JetBrains Mono</strong>.
          </p>
          <p className="text-xs font-mono text-[var(--color-text-secondary)] opacity-75">
            Rendered on 300gsm virtual ivory rag paper.
          </p>
        </div>

        {/* Right Column: Git-Driven Protocol & Legal */}
        <div className="md:col-span-4 space-y-4 md:border-l border-[var(--color-border)] md:pl-10">
          <span className="block opacity-60 font-mono uppercase tracking-widest text-[10px] text-[var(--color-text-secondary)]">
            Archival Architecture
          </span>
          <p className="text-xs font-serif text-[var(--color-text-secondary)] leading-relaxed">
            Maintained via a version-controlled Git database (<code className="font-mono text-[11px] text-[var(--color-text-primary)]">collection.json</code>). Zero server runtime, zero centralized database overhead.
          </p>
          <div className="pt-2">
            <a
              href={metadata.githubRepoUrl || "https://github.com/Annyxtopheles/the-living-index"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono tracking-[0.18em] uppercase text-[var(--color-accent)] hover:underline inline-flex items-center gap-1.5"
            >
              <span>Inspect Source Repository</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal Hairline */}
      <div className="pt-8 border-t border-[var(--color-border)]/60 flex flex-col sm:flex-row items-baseline justify-between gap-4 text-xs font-mono text-[var(--color-text-secondary)] tracking-wider">
        <span>Curated by {metadata.curator} · {metadata.editionDate || "MMXXVI"}</span>
        <span className="text-[11px] opacity-70">Scholarly Non-Commercial Access / CC-BY-NC 4.0</span>
      </div>
    </footer>
  );
};
