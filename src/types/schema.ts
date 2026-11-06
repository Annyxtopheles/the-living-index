export type AestheticType = 
  | 'editorial-serif' 
  | 'brutalist-technical';

export type ObjectCategory =
  | 'Horological Complications'
  | 'Rare Botanical Folios'
  | 'Mineral / Tectonic Specimens'
  | 'Sub-Antarctic Ephemera';

export type ConditionGrade =
  | 'Grade I (Mint)'
  | 'Grade II (Stabilized)'
  | 'Grade III (Conservation Required)';

export interface StorageMicroclimate {
  vaultDesignation: string;
  targetRH: string;
  temperatureRange: string;
  atmosphericEnvironment: string;
  sensorTelemetry?: string;
}

export interface ProvenanceEvent {
  date: string;
  holder: string;
  location: string;
  transferType: string;
  verified: boolean;
  notes?: string;
}

export interface SpectralImaging {
  infraredReflectography?: boolean;
  uvFluorescence?: boolean;
  xrfAnalysis?: string;
  radiographyScan?: boolean;
}

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
  id: string; // Accession code, e.g. "TLI-2026-084"
  accessionCode: string;
  title: string;
  date: string;
  acquisitionYear: number;
  category: ObjectCategory;
  medium: string; // Human readable substrate/material description
  mediumSubstrate: string;
  dimensions: string;
  conditionGrade: ConditionGrade;
  storageMicroclimate: StorageMicroclimate;
  provenanceText: string;
  provenanceChain: ProvenanceEvent[];
  spectralImaging: SpectralImaging;
  curatorialNotes: string;
  highResImageUrl: string;
  tags: string[];
  aspectRatio?: number;
  catalogNumber?: string;
  department?: string;
  rightsStatement?: string;
  location?: string;
  parsedYear?: number;
}

export interface EnvironmentalTelemetry {
  vaultDesignation: string;
  relativeHumidity: string;
  temperature: string;
  atmosphere: string;
  lastInspection: string;
  sensorHealth: 'OPTIMAL' | 'CALIBRATING' | 'WARNING';
}

export interface CollectionMetadata {
  name: string;
  curator: string;
  institution: string;
  description: string;
  aestheticType: AestheticType;
  curatorialStatement?: string;
  editionDate?: string;
  githubRepoUrl?: string;
  environmentalTelemetry: EnvironmentalTelemetry;
}

export interface CollectionDatabase {
  collectionMetadata: CollectionMetadata;
  themingTokens: ThemingTokens;
  items: ArchivalItem[];
}
