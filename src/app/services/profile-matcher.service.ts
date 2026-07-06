import { Injectable } from '@angular/core';
import {
  ARCHETYPE_KEYS, ActorMatch, ArchetypeKey, EmotionalCast, ProfileResult, RawActor, Scores
} from '../models/quiz.models';

@Injectable({ providedIn: 'root' })
export class ProfileMatcherService {
  readonly labels: Record<ArchetypeKey, { male: string; female: string }> = {
    professore_alfa: { male: 'Professore', female: 'Alfa' },
    romeo_giulietta: { male: 'Romeo', female: 'Giulietta' },
    eros_trilli: { male: 'Eros', female: 'Trilli' },
    valium_scheggia: { male: 'Scheggia', female: 'Valium' }
  };
  readonly axisLabels: Record<ArchetypeKey, string> = {
    professore_alfa: 'Logica / Controllo',
    romeo_giulietta: 'Sentimento / Connessione',
    eros_trilli: 'Istinto / Impulso',
    valium_scheggia: 'Protezione / Ritiro'
  };

  private readonly emotionMap: Record<string, ArchetypeKey> = {
    Professore: 'professore_alfa', Alfa: 'professore_alfa',
    Romeo: 'romeo_giulietta', Giulietta: 'romeo_giulietta',
    Eros: 'eros_trilli', Trilli: 'eros_trilli',
    Scheggia: 'valium_scheggia', Valium: 'valium_scheggia'
  };

  emptyScores(): Scores {
    return {
      professore_alfa: 0, romeo_giulietta: 0,
      eros_trilli: 0, valium_scheggia: 0
    };
  }

  normalize(scores: Partial<Scores>): Scores {
    const safe = this.emptyScores();
    ARCHETYPE_KEYS.forEach(key => safe[key] = Math.max(0, Number(scores[key]) || 0));
    const total = ARCHETYPE_KEYS.reduce((sum, key) => sum + safe[key], 0);
    if (!total) return safe;
    ARCHETYPE_KEYS.forEach(key => safe[key] = safe[key] / total);
    return safe;
  }

  analyze(scores: Partial<Scores>): ProfileResult {
    const normalized = this.normalize(scores);
    const ranked = [...ARCHETYPE_KEYS].sort((a, b) => normalized[b] - normalized[a]);
    const values = ARCHETYPE_KEYS.map(key => normalized[key]);
    const spread = Math.max(...values) - Math.min(...values);
    return {
      scores: normalized,
      primary: ranked[0],
      secondary: ranked[1],
      spread,
      isFlat: spread < 0.08,
      isClose: normalized[ranked[0]] - normalized[ranked[1]] < 0.035
    };
  }

  rankActors(scores: Partial<Scores>, actors: RawActor[]): ActorMatch[] {
    const profile = this.analyze(scores);
    return actors
      .map(actor => {
        const emotions = this.actorVector(actor);
        const cosine = this.cosine(profile.scores, emotions);
        const similarity = cosine;
        const shared = [...ARCHETYPE_KEYS]
          .sort((a, b) => profile.scores[b] * emotions[b] - profile.scores[a] * emotions[a])[0];
        const actorDistance = Math.sqrt(ARCHETYPE_KEYS.reduce(
          (sum, key) => sum + (profile.scores[key] - emotions[key]) ** 2, 0
        ));
        return {
          name: actor.name,
          imdbId: actor.imdbId,
          primaryEmotion: actor.primaryEmotion,
          emotions,
          similarity,
          confidence: Math.round(similarity * 100),
          explanation: `Il match considera tutti e quattro gli assi. La sintonia maggiore è su ${this.axisLabels[shared].toLowerCase()} e la distanza complessiva tra i due profili è ${actorDistance.toFixed(2)}.`
        };
      })
      .sort((a, b) => b.similarity - a.similarity || a.name.localeCompare(b.name));
  }

  rankActorsForArchetype(
    scores: Partial<Scores>,
    actors: RawActor[],
    archetype: ArchetypeKey
  ): ActorMatch[] {
    const rankedGlobally = this.rankActors(scores, actors);
    const primaryCandidates = actors.filter(actor => this.emotionMap[actor.primaryEmotion] === archetype);
    const highScoreCandidates = [...actors]
      .sort((a, b) => this.actorVector(b)[archetype] - this.actorVector(a)[archetype])
      .slice(0, 8);
    const candidateNames = new Set(
      [...primaryCandidates, ...highScoreCandidates].map(actor => actor.name)
    );

    return rankedGlobally
      .filter(actor => candidateNames.has(actor.name))
      .sort((a, b) =>
        b.similarity - a.similarity ||
        b.emotions[archetype] - a.emotions[archetype] ||
        a.name.localeCompare(b.name)
      )
      .map(actor => ({
        ...actor,
        explanation: this.archetypeExplanation(archetype, scores, actor)
      }));
  }

  buildEmotionalCast(scores: Partial<Scores>, actors: RawActor[]): EmotionalCast {
    const cast = {} as EmotionalCast;
    const usedActors = new Set<string>();

    ARCHETYPE_KEYS.forEach(archetype => {
      const candidates = this.rankActorsForArchetype(scores, actors, archetype);
      const selected = candidates.find(actor => !usedActors.has(actor.name)) || candidates[0];
      if (selected) {
        cast[archetype] = selected;
        usedActors.add(selected.name);
      }
    });
    return cast;
  }

  private actorVector(actor: RawActor): Scores {
    const scores = this.emptyScores();
    Object.entries(actor.emotions || {}).forEach(([emotion, value]) => {
      const key = this.emotionMap[emotion];
      if (key) scores[key] += Number(value) || 0;
    });
    return this.normalize(scores);
  }

  private archetypeExplanation(
    archetype: ArchetypeKey,
    scores: Partial<Scores>,
    actor: ActorMatch
  ): string {
    const profile = this.analyze(scores);
    const companion = [...ARCHETYPE_KEYS]
      .filter(key => key !== archetype)
      .sort((a, b) =>
        profile.scores[b] * actor.emotions[b] - profile.scores[a] * actor.emotions[a]
      )[0];
    return `Questo volto rappresenta la tua componente ${this.axisLabels[archetype].toLowerCase()}: ` +
      `il suo profilo completo combina questo asse con ${this.axisLabels[companion].toLowerCase()} ` +
      `in modo vicino alla tua distribuzione.`;
  }

  private cosine(a: Scores, b: Scores): number {
    const dot = ARCHETYPE_KEYS.reduce((sum, key) => sum + a[key] * b[key], 0);
    const normA = Math.sqrt(ARCHETYPE_KEYS.reduce((sum, key) => sum + a[key] ** 2, 0));
    const normB = Math.sqrt(ARCHETYPE_KEYS.reduce((sum, key) => sum + b[key] ** 2, 0));
    return normA && normB ? dot / (normA * normB) : 0;
  }
}
