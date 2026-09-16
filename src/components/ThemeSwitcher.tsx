"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { AestheticType } from "@/types/schema";
import { cn } from "@/lib/utils";

export const ThemeSwitcher: React.FC = () => {
  const { aestheticType, setAestheticType } = useTheme();

  const options: { id: AestheticType; label: string }[] = [
    { id: "editorial-serif", label: "Editorial Serif" },
    { id: "brutalist-technical", label: "Brutalist Monospace" },
    { id: "mid-century-modern", label: "Mid-Century Modern" },
  ];

  return (
    <div className="inline-flex items-center gap-1 border border-[var(--color-border)] p-1 bg-[var(--color-surface)]/50">
      {options.map((option) => {
        const isActive = aestheticType === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setAestheticType(option.id)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase transition-all",
              isActive
                ? "bg-[var(--color-accent)] text-white font-semibold"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
