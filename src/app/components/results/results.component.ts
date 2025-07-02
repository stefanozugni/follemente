import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import maleActorsData from '../../../../public/assets/json/male.json';
import femaleActorsData from '../../../../public/assets/json/female.json';

// Interfacce per una tipizzazione pulita
interface Scores {
  professore_alfa: number;
  romeo_giulietta: number;
  eros_trilli: number;
  valium_scheggia: number;
}

interface Actor {
  name: string;
  imdbId: string;
  primaryEmotion: string;
  emotions: Scores;
  affinity?: number;
}

interface RawActor {
  name: string;
  imdbId: string;
  primaryEmotion: string;
  emotions: { [key: string]: number };
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  public isLoading: boolean = true;
  public userScores: Scores | null = null;
  public finalCast: { [key: string]: Actor } = {};
  public gender: 'male' | 'female' = 'male';

  private keyMap: { [key: string]: keyof Scores } = {
    Professore: 'professore_alfa', Alfa: 'professore_alfa',
    Romeo: 'romeo_giulietta', Giulietta: 'romeo_giulietta',
    Eros: 'eros_trilli', Trilli: 'eros_trilli',
    Scheggia: 'valium_scheggia', Valium: 'valium_scheggia'
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.calculateResults();
      this.isLoading = false;
    }, 2500);
  }

  calculateResults(): void {
    const scoresString = localStorage.getItem('quizScores');
    const selectedGender = localStorage.getItem('selectedGender') || 'male';
    this.gender = (localStorage.getItem('selectedGender') as 'male' | 'female') || 'male';

    if (!scoresString) {
      this.router.navigate(['/quiz']);
      return;
    }

    const rawUserScores = JSON.parse(scoresString);
    const userScores = this.normalizeScores(rawUserScores);
    this.userScores = userScores;

    const rawActors: RawActor[] = (selectedGender === 'male') ? maleActorsData : femaleActorsData;
    const transformedActors: Actor[] = rawActors.map(actor => this.transformActor(actor));

    // ========= NUOVA LOGICA DI RAGGRUPPAMENTO (PIÙ ROBUSTA) =========
    const actorsByArchetype: { [key: string]: Actor[] } = {
      professore_alfa: [],
      romeo_giulietta: [],
      eros_trilli: [],
      valium_scheggia: []
    };

    // Raggruppa gli attori in base al loro archetipo primario, usando la nostra chiave unificata
    transformedActors.forEach(actor => {
      const primaryArchetypeKey = this.keyMap[actor.primaryEmotion as keyof typeof this.keyMap];
      if (primaryArchetypeKey) {
        actorsByArchetype[primaryArchetypeKey].push(actor);
      }
    });
    // ==============================================================

    // Ora eseguiamo il matching per ogni asse, usando le nostre liste raggruppate
    for (const archetypeKey in actorsByArchetype) {
      const candidates = actorsByArchetype[archetypeKey as keyof Scores];
      if (candidates && candidates.length > 0) {
        const bestMatch = this.findBestMatch(userScores, candidates);
        this.finalCast[archetypeKey] = bestMatch;
      }
    }

    console.log("IL TUO CAST FINALE:", this.finalCast);
  }

  transformActor(actor: RawActor): Actor {
    const newEmotions: Scores = {
      professore_alfa: 0, romeo_giulietta: 0, eros_trilli: 0, valium_scheggia: 0
    };
    for (const oldKey in actor.emotions) {
      const newKey = this.keyMap[oldKey as keyof typeof this.keyMap];
      if (newKey) {
        newEmotions[newKey] = actor.emotions[oldKey];
      }
    }
    return { ...actor, emotions: this.normalizeScores(newEmotions) };
  }

  normalizeScores(scores: any): Scores {
    const total = Object.values(scores as { [key: string]: number }).reduce((sum, score) => sum + score, 0);
    if (total === 0) return scores;
    const normalized: any = {};
    for (const key in scores) {
      normalized[key] = scores[key] / total;
    }
    return normalized as Scores;
  }

  // Funzione semplificata che lavora su una lista già filtrata
  findBestMatch(userScores: Scores, candidates: Actor[]): Actor {
    candidates.forEach(actor => {
      let sumOfSquares = 0;
      for (const key in userScores) {
        const userScore = userScores[key as keyof Scores];
        const actorScore = actor.emotions[key as keyof Scores] || 0;
        sumOfSquares += Math.pow(userScore - actorScore, 2);
      }
      actor.affinity = Math.sqrt(sumOfSquares);
    });

    return candidates.reduce((best, current) =>
      (best.affinity! < current.affinity!) ? best : current
    );
  }
}