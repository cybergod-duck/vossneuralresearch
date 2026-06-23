export interface DemographicProfile {
  id: string;
  name: string;
  description: string;
  initialContext: string;
  transitionMarker: string;
  neurobehavioralCorrelate: string;
  quote: string;
}

export interface ExposureStage {
  phase: number;
  name: string;
  datDensity: number;
  naturalLiking: number;
  sensitizedWanting: number;
  prefrontalControl: number;
  generalDescription: string;
}

export interface VossAnalysisResponse {
  rewrittenText: string;
  neurochemicalDecomposition: string;
  behavioralDecomposition: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface ImageGenerationSettings {
  prompt: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  imageSize: "1K" | "2K" | "4K";
}
