import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: '**', redirectTo: 'home' },
    { path: 'quiz', component: QuizComponent },
    { path: 'results', component: ResultsComponent },
];
