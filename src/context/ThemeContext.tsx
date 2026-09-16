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
      headerFont: "'Playfair Display', 'Cinzel', 'Didot', serif",
      bodyFont: "'Newsreader', 'Georgia', serif",
      monoFont: "'JetBrains Mono', 'Courier New', monospace",
    },
    palette: {
      backgroundColor: "#F7F5F0",
      surfaceColor: "#ECE8DD",
      textPrimary: "#1B1917",
      textSecondary: "#635F57",
      accentLineColor: "#BA3826", // Vermillion gallery accent
      borderColor: "#DDD6C6",
      specimenBgColor: "#121110",
    },
    layoutClasses: {
      container: "max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16",
      grid: "grid grid-cols-1 md:grid-cols-12 gap-y-24 gap-x-12",
      header: "mb-24 pb-12 border-b border-[var(--color-border)]",
      card: "transition-all duration-700 ease-out",
      label: "font-serif text-sm tracking-wide leading-relaxed",
      divider: "h-[1px] bg-[var(--color-border)] my-12",
      button: "font-serif uppercase tracking-widest text-xs py-2.5 px-6 transition-all duration-300",
    },
  },
  "brutalist-technical": {
    typography: {
      headerFont: "'Space Mono', 'JetBrains Mono', monospace",
      bodyFont: "'Space Grotesk', -apple-system, monospace",
      monoFont: "'Space Mono', monospace",
    },
    palette: {
      backgroundColor: "#0B0C0E",
      surfaceColor: "#14171D",
      textPrimary: "#EDEDEE",
      textSecondary: "#828D9E",
      accentLineColor: "#00FF7F", // Phosphor green telemetry
      borderColor: "#262C38",
      specimenBgColor: "#050607",
    },
    layoutClasses: {
      container: "w-full max-w-[1500px] mx-auto px-4 sm:px-8 py-8",
      grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[var(--color-border)]",
      header: "mb-8 p-6 bg-[var(--color-surface)] border border-[var(--color-border)]",
      card: "border-r border-b border-[var(--color-border)] p-5 transition-none",
      label: "font-mono text-xs uppercase tracking-wider",
      divider: "h-[1px] bg-[var(--color-border)] my-6",
      button: "font-mono text-xs uppercase tracking-widest py-2 px-4 border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)] hover:text-black transition-none",
    },
  },
  "mid-century-modern": {
    typography: {
      headerFont: "'Cabinet Grotesk', 'Avenir Next', sans-serif",
      bodyFont: "'Instrument Sans', 'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
    },
    palette: {
      backgroundColor: "#F2EDE4",
      surfaceColor: "#E3DACB",
      textPrimary: "#26211C",
      textSecondary: "#6E6358",
      accentLineColor: "#D35400", // Burnt cadmium
      borderColor: "#D2C5B2",
      specimenBgColor: "#1A1715",
    },
    layoutClasses: {
      container: "max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-14",
      grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12",
      header: "mb-20 pb-10 border-b-2 border-[var(--color-accent)]",
      card: "transition-transform duration-500 hover:-translate-y-1",
      label: "font-sans text-xs tracking-normal leading-normal font-medium",
      divider: "h-[2px] bg-[var(--color-border)] my-10",
      button: "font-sans font-medium text-xs tracking-wider uppercase py-2.5 px-6 rounded-none transition-colors duration-200",
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
  const [aestheticType, setAestheticType] = useState<AestheticType>(initialAestheticType);

  // Merge the active preset with any custom tokens provided in collection.json
  const activeTokens: ThemingTokens = useMemo(() => {
    const preset = THEME_PRESETS[aestheticType];
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

  const activeLayoutClasses = THEME_PRESETS[aestheticType].layoutClasses;

  // Injects dynamic CSS variables directly into root DOM
  useEffect(() => {
    const root = document.documentElement;
    const { palette, typography } = activeTokens;

    root.style.setProperty("--color-bg", palette.backgroundColor);
    root.style.setProperty("--color-surface", palette.surfaceColor || palette.backgroundColor);
    root.style.setProperty("--color-text-primary", palette.textPrimary);
    root.style.setProperty("--color-text-secondary", palette.textSecondary || "#777777");
    root.style.setProperty("--color-accent", palette.accentLineColor);
    root.style.setProperty("--color-border", palette.borderColor || "rgba(0,0,0,0.1)");
    root.style.setProperty("--color-specimen-bg", palette.specimenBgColor || "#111111");

    root.style.setProperty("--font-heading", typography.headerFont);
    root.style.setProperty("--font-body", typography.bodyFont);
    root.style.setProperty("--font-mono", typography.monoFont || "monospace");

    // Add data-aesthetic attribute to root element for styling hooks
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
