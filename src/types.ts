export interface StudyWeekData {
  week: number;
  ghb: number;
  meth: number;
  clobromazolam: number;
  compositeIndex: number;
  aiSessions: number;
  promptInterval: number;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  period: string;
  description: string;
  journalLog: string;
  metrics?: {
    label: string;
    value: string;
    change?: string;
  }[];
}

export interface PathwayNode {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  neurobiology: string;
  iconName: string;
  color: string;
}

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
