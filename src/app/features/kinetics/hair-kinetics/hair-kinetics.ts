import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

type Feature = {
  title: string;
  desc: string;
  icon: string;        // raw svg string
  safeIcon?: SafeHtml; // trusted svg
};

@Component({
  selector: 'app-hair-kinetics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hair-kinetics.html',
  styleUrl: './hair-kinetics.css',
})
export class HairKinetics implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollRail') scrollRail!: ElementRef<HTMLElement>;

  scrollPosition = 0;
  private rafId: number | null = null;
  private lastTs = 0;

  // px per second (smooth, frame-rate independent)
  private speed = 24;

  // height of ONE full set of features (measured)
  private oneSetHeight = 0;

  content: { features: Feature[] } = {
    features: [
      {
        title: 'Extensions',
        desc: 'Premium, seamless extensions that add fullness, length, and effortless movement to your hair.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40">
          <path d="M12 2v20"/><path d="M8 6l4-4 4 4"/><path d="M8 18l4 4 4-4"/>
        </svg>`,
      },
      {
        title: 'Treatments',
        desc: 'Advanced chemical treatments that deliver long-lasting shine, smoothness, and healthy, refined texture.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40">
          <rect x="7" y="2" width="10" height="20" rx="2"/>
          <line x1="10" y1="8" x2="14" y2="8"/>
          <line x1="10" y1="12" x2="14" y2="12"/>
          <line x1="10" y1="16" x2="14" y2="16"/>
        </svg>`,
      },
      {
        title: 'Color',
        desc: 'Dimensional, customized color designed to enhance your features and elevate your natural beauty.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40">
          <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="10"/>
        </svg>`,
      },
      {
        title: 'Cutting',
        desc: 'Precision cutting that creates sharp, clean, and beautifully balanced shapes tailored to you.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40">
          <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
          <line x1="20" y1="4" x2="8.12" y2="15.88"/>
          <line x1="14.47" y1="14.48" x2="20" y2="20"/>
          <line x1="8.12" y1="8.12" x2="12" y2="12"/>
        </svg>`,
      },
    ],
  };

  constructor(private sanitizer: DomSanitizer) {}

  // triple list so the loop always looks continuous
  get duplicatedFeatures(): Feature[] {
    const base = this.content.features.map(f => ({
      ...f,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(f.icon),
    }));
    return [...base, ...base, ...base];
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Measure height of ONE set (first N items)
    // We render 3 sets; so one set height = total / 3.
    requestAnimationFrame(() => {
      const rail = this.scrollRail?.nativeElement;
      if (!rail) return;

      const total = rail.scrollHeight;
      this.oneSetHeight = total / 3;

      this.start();
    });
  }

  ngOnDestroy() {
    this.stop();
  }

  private start() {
    this.stop();
    this.lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = (ts - this.lastTs) / 1000; // seconds
      this.lastTs = ts;

      this.scrollPosition += this.speed * dt;

      // when we've scrolled one set, jump back by oneSetHeight (no visible jump)
      if (this.oneSetHeight > 0 && this.scrollPosition >= this.oneSetHeight) {
        this.scrollPosition -= this.oneSetHeight;
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
}

