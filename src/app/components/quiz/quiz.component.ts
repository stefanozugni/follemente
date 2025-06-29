import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Importa le tue domande direttamente dal file JSON
import questionsData from '../../../../public/assets/json/questions.json';

// Definiamo le interfacce per una tipizzazione pulita
interface Scores {
  professore_alfa: number;
  romeo_giulietta: number;
  eros_trilli: number;
  valium_scheggia: number;
}

interface Answer {
  id: string;
  text: string;
  analysis: string;
  scores: Scores;
}

interface Question {
  id: number;
  theme: string;
  scenario: string;
  question: string;
  answers: Answer[];
}

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

  // Oggetto che accumulerà i punteggi
  public finalScores: Scores = {
    professore_alfa: 0,
    romeo_giulietta: 0,
    eros_trilli: 0,
    valium_scheggia: 0
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Inizializza il quiz mostrando la prima domanda
    this.displayQuestion(this.currentQuestionIndex);
  }

  displayQuestion(index: number): void {
    // Imposta la domanda corrente da mostrare nel template
    this.currentQuestion = this.questions[index];
    this.selectedAnswerId = null; // Resetta la risposta selezionata
  }

  selectAnswer(answerId: string): void {
    // Registra la selezione dell'utente per applicare lo stile CSS
    this.selectedAnswerId = answerId;
  }

  submitAnswer(): void {
    // Se nessuna risposta è selezionata, non fare nulla
    if (!this.selectedAnswerId) {
      return;
    }

    // Trova la risposta scelta dall'utente
    const chosenAnswer = this.currentQuestion?.answers.find(answer => answer.id === this.selectedAnswerId);

    if (chosenAnswer) {
      // Aggiorna i punteggi totali
      for (const key in chosenAnswer.scores) {
        if (this.finalScores.hasOwnProperty(key)) {
          this.finalScores[key as keyof Scores] += chosenAnswer.scores[key as keyof Scores];
        }
      }

      // Log per il debug, come richiesto
      console.log(`Domanda ${this.currentQuestionIndex + 1} - Risposta scelta: ${this.selectedAnswerId}`);
      console.log('PUNTEGGI AGGIORNATI:', this.finalScores);
    }

    // Passa alla domanda successiva o termina il quiz
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.displayQuestion(this.currentQuestionIndex);
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz(): void {
    console.log('QUIZ TERMINATO! Punteggi finali:', this.finalScores);
    this.isQuizFinished = true;

    // Qui salvi i dati nel Local Storage per passarli alla pagina dei risultati
    localStorage.setItem('quizScores', JSON.stringify(this.finalScores));

    // Reindirizza alla pagina dei risultati
    this.router.navigate(['/results']);
  }
}