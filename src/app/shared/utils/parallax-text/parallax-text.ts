import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, NgFor, NgIf } from '@angular/common';

export type RevealMode = 'words' | 'lines' | 'chars';
export type ParallaxStrength = 'none' | 'subtle' | 'medium' | 'strong';


@Component({
  selector: 'app-parallax-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parallax-text.html',
  styleUrl: './parallax-text.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParallaxText implements AfterViewInit, OnChanges, OnDestroy {
  @Input() text = '';
  @Input() mode: RevealMode = 'words';
  @Input() parallaxStrength: ParallaxStrength = 'subtle';
  @Input() scrub = 1.2;
  @Input() startTrigger = 'top 85%';
  @Input() endTrigger = 'top 25%';

  units: string[] = [];

  private triggers: any[] = [];
  private gsap: any;
  private ST: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private el: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    this.buildUnits();
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    this.buildUnits();
    this.cdr.markForCheck();

    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => requestAnimationFrame(() => this.initAnimations()));
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }


  private buildUnits(): void {
    const t = (this.text || '').trim();
    if (!t) {
      this.units = [];
      return;
    }

    switch (this.mode) {
      case 'chars':
        this.units = t.split('');
        break;
      case 'lines':
        this.units = t
          .split(/\\n|\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        break;
      default: // words
        this.units = t.split(/\s+/).filter(Boolean);
    }
  }

  private cleanup(): void {
    this.triggers.forEach((t) => t?.kill?.());
    this.triggers = [];
  }

  private async initAnimations(): Promise<void> {
    try {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      this.gsap = gsap;
      this.ST = ScrollTrigger;
      this.animate();
    } catch {
      // GSAP not available — degrade to CSS IntersectionObserver
      this.cssOnlyFallback();
    }
  }

  private animate(): void {
    const host = this.el.nativeElement;
    const units = Array.from(host.querySelectorAll<HTMLElement>('.prt-unit'));
    if (!units.length) return;

    const style = getComputedStyle(host);
    const dimColor = style.getPropertyValue('--prt-dim').trim() || 'rgba(255,255,255,0.15)';
    const litColor = style.getPropertyValue('--prt-lit').trim() || '#ffffff';
    const yRange = this.parallaxPx;

    this.gsap.set(units, { color: dimColor });

    const tl = this.gsap.timeline({
      scrollTrigger: {
        trigger: host,
        start: this.startTrigger,
        end: this.endTrigger,
        scrub: this.scrub,
      },
    });

    tl.to(units, {
      color: litColor,
      stagger: { each: 0.03, ease: 'none' },
      ease: 'power1.inOut',
      duration: 1,
    });

    this.triggers.push(tl.scrollTrigger);

    if (yRange > 0) {
      const depthTable = [1, 1.45, 0.65, 1.2, 0.85, 1.35, 0.75, 1.1];

      units.forEach((unit, i) => {
        const depth = depthTable[i % depthTable.length];
        const drift = yRange * depth;

        const st = this.ST.create({
          trigger: host,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self: any) => {
            const y = (0.5 - self.progress) * drift;
            unit.style.transform = `translateY(${y.toFixed(1)}px)`;
          },
        });

        this.triggers.push(st);
      });
    }
  }

  private get parallaxPx(): number {
    const map: Record<ParallaxStrength, number> = {
      none: 0,
      subtle: 28,
      medium: 55,
      strong: 110,
    };
    return map[this.parallaxStrength] ?? 28;
  }

  private cssOnlyFallback(): void {
    const host = this.el.nativeElement;
    const units = Array.from(host.querySelectorAll<HTMLElement>('.prt-unit'));
    const litColor = getComputedStyle(host).getPropertyValue('--prt-lit').trim() || '#ffffff';

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        units.forEach((u, i) => {
          u.style.transition = `color 0.75s ease ${(i * 0.06).toFixed(2)}s`;
          u.style.color = litColor;
        });
        io.disconnect();
      },
      { threshold: 0.1 },
    );

    io.observe(host);
  }
}
