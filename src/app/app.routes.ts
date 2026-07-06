import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultsComponent } from './components/results/results.component';
import { TestingComponent } from './components/testing/testing.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'results', component: ResultsComponent },
    { path: 'testing', component: TestingComponent },
    {
        path: 'metodo',
        loadComponent: () => import('./components/method/method.component').then(module => module.MethodComponent)
    },
    { path: '**', redirectTo: '' },
];
