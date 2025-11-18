
// FIX: Define and export the Language enum. This was missing, causing errors in multiple files.
export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  SANSKRIT = 'Sanskrit',
  TAMIL = 'Tamil',
  BENGALI = 'Bengali',
  MALAYALAM = 'Malayalam',
}

// FIX: Define and export the Explanation interface. This was missing for GrammarExplanationDisplay.
export interface Explanation {
  breakdown: string;
  dependencyParse?: string;
  errorAnalysis?: string;
}

// FIX: Define and export the EvaluationMetrics interface. This was missing for EvaluationMetricsDisplay.
export interface EvaluationMetrics {
  fluency: number;
  accuracy: number;
  grammar_correctness: number;
  tone_appropriateness: number;
}

// FIX: Define and export the GrammarExplanationResponse interface. This was missing in App.tsx and geminiService.ts.
export interface GrammarExplanationResponse {
  translation: string;
  explanation: Explanation;
  evaluation: EvaluationMetrics;
}
