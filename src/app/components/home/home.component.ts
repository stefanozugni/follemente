import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Assicurati di avere Router
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  @ViewChildren('archetypeRow') rows!: QueryList<ElementRef>;

  // --- INIZIO MODIFICHE ---

  // Proprietà per gestire la visualizzazione della scelta del sesso
  public genderSelectionVisible: boolean = false;

  // Inietta il Router nel costruttore per poter navigare tra le pagine
  constructor(private router: Router) { }

  // Questo metodo viene chiamato dal primo pulsante per mostrare le opzioni
  showGenderSelection(): void {
    this.genderSelectionVisible = true;
  }

  // Questo metodo salva la scelta e avvia il quiz
  selectGenderAndStart(gender: 'male' | 'female'): void {
    localStorage.setItem('selectedGender', gender);
    console.log(`Sesso selezionato e salvato: ${gender}`);
    this.router.navigate(['/quiz']);
  }

  // --- FINE MODIFICHE ---

  ngAfterViewInit(): void {
    // La tua logica di animazione GSAP rimane qui, invariata.
    this.rows.forEach(row => {
      const el = row.nativeElement;
      const leftItem = el.querySelector('.from-left');
      const rightItem = el.querySelector('.from-right');

      if (leftItem) {
        gsap.from(leftItem, {
          opacity: 0,
          x: -200,
          scale: 0.8,
          rotate: -5,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      if (rightItem) {
        gsap.from(rightItem, {
          opacity: 0,
          x: 200,
          scale: 0.8,
          rotate: 5,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    });
  }
}