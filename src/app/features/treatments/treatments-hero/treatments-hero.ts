import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../../core/constants/app-text';

type TabId = 'extensions' | 'treatments' | 'color';

type OptionItem = {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  image: string;       // default
  hoverImage: string;  // on hover
    position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string; // for centering (like -translate-x-1/2)
    align?: 'start' | 'center' | 'end';
  };
};

@Component({
  selector: 'app-treatments-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treatments-hero.html',
  styleUrl: './treatments-hero.css',
})
export class TreatmentsHero {
  protected readonly text = UI_TEXT;

  content = {
    activeTab: 'treatments' as TabId,
    tabs: [
      { id: 'extensions' as TabId, number: '01', label: 'EXTENSIONS' },
      { id: 'treatments' as TabId, number: '02', label: 'TREATMENTS' },
      { id: 'color' as TabId, number: '03', label: 'COLOR' },
    ],
  };

  // default hero image per tab
  private tabHeroImage: Record<TabId, string> = {
    extensions: 'assets/images/extensionsHero.png',
    treatments: 'assets/images/treatmentsHero.png',
    color: 'assets/images/colorHero.png',
  };

  // options shown inside each tab
tabOptions: Record<TabId, OptionItem[]> = {
    treatments: [
      {
        id: 'gloss',
        number: '03',
        title: 'GLOSS',
        image: 'assets/images/tr_gloss.png',
        hoverImage: 'assets/images/tr_gloss_hover.png',
        position: { top: '25%', left: '10%', align: 'start' },
      },
      {
        id: 'repairative',
        number: '02',
        title: 'REPAIRATIVE',
        image: 'assets/images/tr_repair.png',
        hoverImage: 'assets/images/tr_repair_hover.png',
        position: { top: '20%', right: '12%', align: 'end' },
      },
      {
        id: 'shine',
        number: '02',
        title: 'SHINE',
        image: 'assets/images/tr_shine.png',
        hoverImage: 'assets/images/tr_shine_hover.png',
        position: { bottom: '25%', left: '50%', transform: 'translateX(-50%)', align: 'center' },
      },
    ],

    // you can add these later with their own positions
    extensions: [],
    color: [],
  };

  hoveredOptionId: string | null = null;

  setTab(tabId: TabId) {
    this.content.activeTab = tabId;
    this.hoveredOptionId = null; // reset hover when switching tabs
  }

  onHoverOption(optionId: string) {
    this.hoveredOptionId = optionId;
  }

  onLeaveOptions() {
    this.hoveredOptionId = null;
  }

  get activeOptions(): OptionItem[] {
    return this.tabOptions[this.content.activeTab];
  }

  /** This decides what big hero image to show */
  get heroImageSrc(): string {
    const base = this.tabHeroImage[this.content.activeTab];
    if (!this.hoveredOptionId) return base;

    const opt = this.activeOptions.find(o => o.id === this.hoveredOptionId);
    return opt?.hoverImage ?? base;
  }
}
