
export interface FileInfo {
  name: string;
  size_mb: number;
  dimensions: string;
  format: string;
  color_space: string;
}

export interface DetectionResult {
  verdict: "AI-Generated" | "Human-Made" | "Uncertain";
  ai_probability: number;
  human_probability: number;
  confidence_score: number;
  certainty_level: "Very High" | "High" | "Medium" | "Low";
  risk_level: "CONFIRMED_AI" | "LIKELY_AI" | "UNCERTAIN" | "LIKELY_HUMAN" | "CONFIRMED_HUMAN";
  summary: string;
  model_suspected: string | null;
  generation_technique: string | null;
}

export interface Signal {
  indicator: string;
  severity: "high" | "medium" | "low";
  location: string;
  evidence: string;
  confidence: number;
}

export interface MetadataAnalysis {
  exif_present: boolean;
  camera_model: string | null;
  software_detected: string | null;
  creation_date: string | null;
  gps_data: boolean;
  suspicious_flags: string[];
}

export interface PromptReconstruction {
  available: boolean;
  confidence: "high" | "medium" | "low";
  estimated_prompt: string;
  breakdown: {
    subject: string;
    visual_details: string[];
    style_keywords: string[];
    technical_params: string[];
  };
  similar_prompts: string[];
  notes: string;
}

export interface VisualBreakdown {
  composition_score: number;
  color_harmony: number;
  lighting_realism: number;
  texture_consistency: number;
  anatomical_accuracy: number;
  perspective_correctness: number;
  notes: number;
}

export interface UIHints {
  primary_color: string;
  confidence_bar_color: string;
  alert_level: "danger" | "warning" | "info" | "success";
  show_heatmap: boolean;
  animate_verdict: boolean;
}

export interface ProcessingMetadata {
  analysis_time_ms: number;
  apis_used: string[];
  version: string;
}

export interface HeatmapRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  intensity: number;
  label: string;
}

export interface AnalysisResponse {
  analysis_id: string;
  timestamp: string;
  file_info: FileInfo;
  detection: DetectionResult;
  signals: Signal[];
  metadata_analysis: MetadataAnalysis;
  prompt_reconstruction: PromptReconstruction;
  visual_breakdown: VisualBreakdown;
  recommendations: string[];
  ui_hints: UIHints;
  processing_metadata: ProcessingMetadata;
  heatmap_data?: {
    enabled: boolean;
    regions: HeatmapRegion[];
  };
  error?: boolean;
  message?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageSrc: string;
  analysis: AnalysisResponse;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  HISTORY = 'HISTORY'
}
