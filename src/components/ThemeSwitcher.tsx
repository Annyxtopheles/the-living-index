"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { AestheticType } from "@/types/schema";
import { cn } from "@/lib/utils";

export const ThemeSwitcher: React.FC = () => {
  const { aestheticType, setAestheticType } = useTheme();

  const options: { id: AestheticType; label: string }[] = [
    { id: "editorial-serif", label: "Editorial" },
    { id: "brutalist-technical", label: "Monochrome Index" },
  ];

  return (
    <nav aria-label="Visual Philosophy Switcher" className="inline-flex items-center gap-4 text-[11px] font-mono tracking-widest uppercase">
      {options.map((option, idx) => {
        const isActive = aestheticType === option.id;
        return (
          <React.Fragment key={option.id}>
            {idx > 0 && <span className="opacity-30">/</span>}
            <button
              onClick={() => setAestheticType(option.id)}
              className={cn(
                "pb-0.5 transition-all duration-300 relative",
                isActive
                  ? "text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] opacity-70 hover:opacity-100"
              )}
            >
              {option.label}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
