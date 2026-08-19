import { Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import gsap from 'gsap';

@Component({
  selector: 'app-hero',
  imports: [],
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  @ViewChild('heroText') heroText!: ElementRef;
  protected readonly text = UI_TEXT;
  content = {
    hero: {
      line1: 'HAIR IN MOTION',
      line2: 'BEAUTY IN BALANCE',
    },
  };

  constructor() {
    // Never runs during the prerender pass, which is what we want twice over: GSAP needs a
    // real browser, and the prerendered HTML keeps the headline as a plain sentence instead
    // of one <span> per character — a crawler should read words, not 14 letter elements.
    afterNextRender(() => this.splitAndAnimate());
  }

  private splitAndAnimate(): void {
    const lines: Element[] = Array.from(
      this.heroText.nativeElement.querySelectorAll('.hero-line:not(.mobile-line)'),
    );

    lines.forEach((line: Element, lineIndex: number) => {
      const text = line.textContent?.trim() || '';
      line.innerHTML = text
        .split('')
        .map((char) =>
          char === ' '
            ? '<span class="inline-block">&nbsp;</span>'
            : `<span class="inline-block">${char}</span>`,
        )
        .join('');

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
