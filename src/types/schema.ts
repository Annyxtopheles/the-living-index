export type AestheticType = 
  | 'editorial-serif' 
  | 'brutalist-technical' 
  | 'mid-century-modern';

export interface TypographyTokens {
  headerFont: string;
  bodyFont: string;
  monoFont?: string;
}

export interface ColorPaletteTokens {
  backgroundColor: string;
  surfaceColor?: string;
  textPrimary: string;
  textSecondary?: string;
  accentLineColor: string;
  borderColor?: string;
  specimenBgColor?: string;
}

export interface ThemingTokens {
  typography: TypographyTokens;
  palette: ColorPaletteTokens;
}

export interface ArchivalItem {
  id: string;
  title: string;
  date: string;
  medium: string;
  dimensions: string;
  provenanceText: string;
  highResImageUrl: string;
  tags: string[];
  // Optional museum-grade metadata extensions
  aspectRatio?: number;
  catalogNumber?: string;
  department?: string;
  rightsStatement?: string;
  location?: string;
  parsedYear?: number;
}

export interface CollectionMetadata {
  name: string;
  curator: string;
  description: string;
  aestheticType: AestheticType;
  // Optional archival headers
  institution?: string;
  curatorialStatement?: string;
  editionDate?: string;
  githubRepoUrl?: string;
}

export interface CollectionDatabase {
  collectionMetadata: CollectionMetadata;
  themingTokens: ThemingTokens;
  items: ArchivalItem[];
}
