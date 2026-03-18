import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import gsap from 'gsap';

@Component({
  selector: 'app-hero',
  imports: [],
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit {
  @ViewChild('heroText') heroText!: ElementRef;
  protected readonly text = UI_TEXT;
  content = {
    hero: {
      line1: 'HAIR IN MOTION',
      line2: 'BEAUTY IN BALANCE'
    }
  }

ngAfterViewInit() {
  const lines = this.heroText.nativeElement.querySelectorAll('.hero-line');

  lines.forEach((line: Element, lineIndex: number) => {
    const text = line.textContent?.trim() || '';
    line.innerHTML = text.split('').map(char =>
      char === ' '
        ? '<span class="inline-block">&nbsp;</span>'
        : `<span class="inline-block">${char}</span>`
    ).join('');

    const chars = Array.from(line.querySelectorAll('span'));
    const mid = Math.floor(chars.length / 2);

    gsap.from(chars, {
      opacity: 0,
      filter: 'blur(12px)',
      y: 20,
      duration: 1.8,
      ease: 'power3.out',
      stagger: {
        each: 0.06,
        from: mid,
      },
      delay: 0.2 + lineIndex * 0.25,
    });
  });
}

}
