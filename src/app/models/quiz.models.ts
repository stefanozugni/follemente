export const ARCHETYPE_KEYS = [
  'professore_alfa',
  'romeo_giulietta',
  'eros_trilli',
  'valium_scheggia'
] as const;

export type ArchetypeKey = typeof ARCHETYPE_KEYS[number];
export type Scores = Record<ArchetypeKey, number>;

export interface Answer {
  id: string;
  text: string;
  analysis: string;
  scores: Scores;
}

export interface Question {
  id: number;
  theme: string;
  scenario: string;
  question: string;
  answers: Answer[];
}

export interface RawActor {
  name: string;
  imdbId: string;
  primaryEmotion: string;
  emotions: Record<string, number>;
}

export interface ActorMatch {
  name: string;
  imdbId: string;
  primaryEmotion: string;
  emotions: Scores;
  similarity: number;
  confidence: number;
  explanation: string;
}

export type EmotionalCast = Record<ArchetypeKey, ActorMatch>;

export interface ProfileResult {
  scores: Scores;
  primary: ArchetypeKey;
  secondary: ArchetypeKey;
  spread: number;
  isFlat: boolean;
  isClose: boolean;
}
