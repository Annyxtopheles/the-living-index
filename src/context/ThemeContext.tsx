"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AestheticType, ThemingTokens, ColorPaletteTokens, TypographyTokens } from "@/types/schema";

interface ThemePreset {
  typography: TypographyTokens;
  palette: ColorPaletteTokens;
  layoutClasses: {
    container: string;
    grid: string;
    header: string;
    card: string;
    label: string;
    divider: string;
    button: string;
  };
}

export const THEME_PRESETS: Record<AestheticType, ThemePreset> = {
  "editorial-serif": {
    typography: {
      headerFont: "'Cinzel', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
      bodyFont: "'Newsreader', Georgia, serif",
      monoFont: "'JetBrains Mono', 'Courier New', monospace",
    },
    palette: {
      backgroundColor: "#FAF8F5", // Luminous warm ivory / archival rag
      surfaceColor: "#F3EFE8",
      textPrimary: "#181513", // Carbon bone-black
      textSecondary: "#6E675F", // Warm graphite
      accentLineColor: "#382218", // Deep bitter chocolate / raw umber
      borderColor: "#E7E1D7", // Fine parchment hairline
      specimenBgColor: "#11100F",
    },
    layoutClasses: {
      container: "max-w-[1360px] mx-auto px-6 sm:px-12 lg:px-20 py-16",
      grid: "grid grid-cols-1 md:grid-cols-12 gap-y-28 gap-x-16",
      header: "mb-28 pb-14 border-b border-[var(--color-border)]",
      card: "transition-all duration-700 ease-out",
      label: "font-serif text-sm tracking-wide leading-relaxed",
      divider: "h-[1px] bg-[var(--color-border)] my-16",
      button: "font-serif text-xs uppercase tracking-[0.2em] py-2 px-4 transition-colors duration-300",
    },
  },
  "brutalist-technical": {
    typography: {
      headerFont: "'Space Mono', monospace",
      bodyFont: "'Space Grotesk', -apple-system, monospace",
      monoFont: "'Space Mono', monospace",
    },
    palette: {
      backgroundColor: "#0B0C0E",
      surfaceColor: "#13161A",
      textPrimary: "#ECEFF4",
      textSecondary: "#7D8797",
      accentLineColor: "#EAEAEA", // Stark cold white / hairline rule
      borderColor: "#222730",
      specimenBgColor: "#050607",
    },
    layoutClasses: {
      container: "w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8",
      grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[var(--color-border)]",
      header: "mb-8 p-6 bg-[var(--color-surface)] border border-[var(--color-border)]",
      card: "border-r border-b border-[var(--color-border)] p-6 transition-none",
      label: "font-mono text-xs uppercase tracking-wider",
      divider: "h-[1px] bg-[var(--color-border)] my-6",
      button: "font-mono text-xs uppercase tracking-widest py-2 px-4 border border-[var(--color-border)] bg-transparent hover:bg-white hover:text-black transition-none",
    },
  },
};

interface ThemeContextValue {
  aestheticType: AestheticType;
  setAestheticType: (type: AestheticType) => void;
  themingTokens: ThemingTokens;
  layoutClasses: ThemePreset["layoutClasses"];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  initialAestheticType,
  initialTokens,
  children,
}: {
  initialAestheticType: AestheticType;
  initialTokens: ThemingTokens;
  children: React.ReactNode;
}) {
  const [aestheticType, setAestheticType] = useState<AestheticType>(
    initialAestheticType === ("mid-century-modern" as any) ? "editorial-serif" : initialAestheticType
  );

  const activeTokens: ThemingTokens = useMemo(() => {
    const preset = THEME_PRESETS[aestheticType] || THEME_PRESETS["editorial-serif"];
    return {
      typography: {
        ...preset.typography,
        ...(aestheticType === initialAestheticType ? initialTokens.typography : {}),
      },
      palette: {
        ...preset.palette,
        ...(aestheticType === initialAestheticType ? initialTokens.palette : {}),
      },
    };
  }, [aestheticType, initialAestheticType, initialTokens]);

  const activeLayoutClasses = (THEME_PRESETS[aestheticType] || THEME_PRESETS["editorial-serif"]).layoutClasses;

  useEffect(() => {
    const root = document.documentElement;
    const { palette, typography } = activeTokens;

    root.style.setProperty("--color-bg", palette.backgroundColor);
    root.style.setProperty("--color-surface", palette.surfaceColor || palette.backgroundColor);
    root.style.setProperty("--color-text-primary", palette.textPrimary);
    root.style.setProperty("--color-text-secondary", palette.textSecondary || "#6E675F");
    root.style.setProperty("--color-accent", palette.accentLineColor);
    root.style.setProperty("--color-border", palette.borderColor || "#E7E1D7");
    root.style.setProperty("--color-specimen-bg", palette.specimenBgColor || "#11100F");

    root.style.setProperty("--font-heading", typography.headerFont);
    root.style.setProperty("--font-body", typography.bodyFont);
    root.style.setProperty("--font-mono", typography.monoFont || "monospace");

    root.setAttribute("data-aesthetic", aestheticType);
  }, [activeTokens, aestheticType]);

  return (
    <ThemeContext.Provider
      value={{
        aestheticType,
        setAestheticType,
        themingTokens: activeTokens,
        layoutClasses: activeLayoutClasses,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
