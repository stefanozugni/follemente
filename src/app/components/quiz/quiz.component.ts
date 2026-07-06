import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import questionsData from '../../../../public/assets/json/questions.json';
import { Answer, Question, Scores } from '../../models/quiz.models';
import { ProfileMatcherService } from '../../services/profile-matcher.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  // Proprietà per gestire lo stato del quiz
  public questions: Question[] = questionsData;
  public currentQuestionIndex: number = 0;
  public currentQuestion: Question | undefined;
  public selectedAnswerId: string | null = null;
  public isQuizFinished: boolean = false;

  public finalScores: Scores;

  constructor(private router: Router, matcher: ProfileMatcherService) {
    this.finalScores = matcher.emptyScores();
  }

  ngOnInit(): void {
    this.displayQuestion(this.currentQuestionIndex);
  }

  displayQuestion(index: number): void {
    this.currentQuestion = this.questions[index];
    this.selectedAnswerId = null;
  }

  selectAnswer(answer: Answer): void {
    this.selectedAnswerId = answer.id;
  }

  submitAnswer(): void {
    if (!this.selectedAnswerId) {
      return;
    }
    const chosenAnswer = this.currentQuestion?.answers.find(answer => answer.id === this.selectedAnswerId);

    if (chosenAnswer) {
      for (const key in chosenAnswer.scores) {
        if (this.finalScores.hasOwnProperty(key)) {
          this.finalScores[key as keyof Scores] += chosenAnswer.scores[key as keyof Scores];
        }
      }
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.displayQuestion(this.currentQuestionIndex);
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz(): void {
    this.isQuizFinished = true;

    localStorage.setItem('quizScores', JSON.stringify(this.finalScores));
    localStorage.removeItem('finalCast');
    this.router.navigate(['/results']);
  }
}
