import { Component, isDevMode, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import questionsData from '../../../../public/assets/json/questions.json';
import maleActorsData from '../../../../public/assets/json/male.json';
import femaleActorsData from '../../../../public/assets/json/female.json';
import { ARCHETYPE_KEYS, ActorMatch, ArchetypeKey, EmotionalCast, ProfileResult, Question, RawActor, Scores } from '../../models/quiz.models';
import { ProfileMatcherService } from '../../services/profile-matcher.service';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  readonly questions = questionsData as Question[];
  readonly keys = ARCHETYPE_KEYS;
  answers: Record<number, string> = {};
  gender: 'male' | 'female' = 'male';
  scores: Scores;
  profile: ProfileResult;
  candidateRanks = {} as Record<ArchetypeKey, ActorMatch[]>;
  emotionalCast?: EmotionalCast;
  candidateWarnings = {} as Record<ArchetypeKey, string | null>;

  constructor(public matcher: ProfileMatcherService, private router: Router) {
    this.scores = matcher.emptyScores();
    this.profile = matcher.analyze(this.scores);
  }

  ngOnInit(): void {
    if (!isDevMode()) {
      this.router.navigate(['/']);
      return;
    }
    this.simulate('balanced');
  }

  recalculate(): void {
    this.scores = this.matcher.emptyScores();
    this.questions.forEach(question => {
      const answer = question.answers.find(item => item.id === this.answers[question.id]);
      if (answer) this.keys.forEach(key => this.scores[key] += answer.scores[key]);
    });
    this.profile = this.matcher.analyze(this.scores);
    const actors = (this.gender === 'male' ? maleActorsData : femaleActorsData) as RawActor[];
    this.emotionalCast = this.matcher.buildEmotionalCast(this.scores, actors);
    this.keys.forEach(key => {
      const candidates = this.matcher.rankActorsForArchetype(this.scores, actors, key);
      this.candidateRanks[key] = candidates.slice(0, 5);
      this.candidateWarnings[key] = candidates.length < 5
        ? `Solo ${candidates.length} candidati disponibili: è stato applicato il fallback sul punteggio dell’asse.`
        : null;
    });
  }

  simulate(mode: 'balanced' | 'random' | ArchetypeKey): void {
    this.questions.forEach((question, index) => {
      let answer = question.answers[index % question.answers.length];
      if (mode === 'random') answer = question.answers[Math.floor(Math.random() * question.answers.length)];
      if (this.keys.includes(mode as ArchetypeKey)) {
        answer = [...question.answers].sort((a, b) =>
          b.scores[mode as ArchetypeKey] - a.scores[mode as ArchetypeKey])[0];
      }
      this.answers[question.id] = answer.id;
    });
    this.recalculate();
  }

  label(key: ArchetypeKey): string {
    return this.matcher.labels[key][this.gender];
  }
}
