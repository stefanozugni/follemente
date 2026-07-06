import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import maleActorsData from '../../../../public/assets/json/male.json';
import femaleActorsData from '../../../../public/assets/json/female.json';
import { ARCHETYPE_KEYS, ActorMatch, ArchetypeKey, EmotionalCast, ProfileResult, RawActor, Scores } from '../../models/quiz.models';
import { ProfileMatcherService } from '../../services/profile-matcher.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  readonly archetypeKeys = ARCHETYPE_KEYS;
  isLoading = true;
  profile?: ProfileResult;
  emotionalCast?: EmotionalCast;
  gender: 'male' | 'female' = 'male';
  percentages: Scores = {
    professore_alfa: 0, romeo_giulietta: 0, eros_trilli: 0, valium_scheggia: 0
  };

  constructor(private router: Router, public matcher: ProfileMatcherService) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('quizScores');
    this.gender = localStorage.getItem('selectedGender') === 'female' ? 'female' : 'male';
    if (!raw) {
      this.router.navigate(['/quiz']);
      return;
    }
    try {
      const scores = JSON.parse(raw) as Scores;
      const actors = (this.gender === 'male' ? maleActorsData : femaleActorsData) as RawActor[];
      this.profile = this.matcher.analyze(scores);
      this.percentages = this.toPercentages(this.profile.scores);
      this.emotionalCast = this.matcher.buildEmotionalCast(scores, actors);
      localStorage.setItem('finalCast', JSON.stringify(this.emotionalCast));
      window.setTimeout(() => this.isLoading = false, 650);
    } catch {
      localStorage.removeItem('quizScores');
      this.router.navigate(['/quiz']);
    }
  }

  label(key: ArchetypeKey): string {
    return this.matcher.labels[key][this.gender];
  }

  percentage(key: ArchetypeKey): number {
    return this.percentages[key];
  }

  narrative(): string {
    if (!this.profile) return '';
    return `Il tuo profilo è guidato da ${this.matcher.axisLabels[this.profile.primary].toLowerCase()}, ` +
      `ma tutte e quattro le forze partecipano al tuo modo di sentire. Per ciascuna abbiamo scelto un interprete ` +
      `confrontando la tua intera distribuzione emotiva con quella dei candidati.`;
  }

  getActorImagePath(name: string): string {
    return `assets/images/actors/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  }

  private toPercentages(scores: Scores): Scores {
    const result = this.matcher.emptyScores();
    const exact = this.archetypeKeys.map(key => ({ key, value: scores[key] * 100 }));
    exact.forEach(item => result[item.key] = Math.floor(item.value));
    let remainder = 100 - this.archetypeKeys.reduce((sum, key) => sum + result[key], 0);
    exact
      .sort((a, b) => (b.value % 1) - (a.value % 1))
      .slice(0, remainder)
      .forEach(item => result[item.key]++);
    return result;
  }
}
