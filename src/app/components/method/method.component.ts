import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-method',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent {
  readonly axes = [
    { number: '01', title: 'Logica / Controllo', pair: 'Professore · Alfa', text: 'Analizza, pianifica e cerca una struttura prima di agire.' },
    { number: '02', title: 'Sentimento / Connessione', pair: 'Romeo · Giulietta', text: 'Mette al centro empatia, legami, idealismo e cura.' },
    { number: '03', title: 'Istinto / Impulso', pair: 'Eros · Trilli', text: 'Segue intensità, spontaneità e desiderio di azione immediata.' },
    { number: '04', title: 'Protezione / Ritiro', pair: 'Scheggia · Valium', text: 'Prende distanza o costruisce difese per proteggere una parte vulnerabile.' }
  ];
}
