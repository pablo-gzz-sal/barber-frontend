import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../../core/constants/app-text';

type TabId = 'extensions' | 'treatments' | 'color' | 'styling';

type OptionItem = {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  image: string; // default
  hoverImage: string; // on hover
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
      { id: 'styling' as TabId, number: '04', label: 'STYLING' },
    ],
  };

  // default hero image per tab
  private tabHeroImage: Record<TabId, string> = {
    extensions: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Extensions.jpg?v=1773360159',
    treatments: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Treatments.jpg?v=1773360145',
    color: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Color.jpg?v=1773360143',
    styling: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Styling.jpg?v=1773360148',
  };

  // options shown inside each tab
  tabOptions: Record<TabId, OptionItem[]> = {
    treatments: [
      {
        id: 'gloss',
        number: '01',
        title: 'Botanical Smoother',
        image: 'assets/images/tr_gloss.png',
        hoverImage: 'assets/images/tr_gloss_hover.png',
        position: { top: '25%', left: '10%', align: 'start' },
      },
      {
        id: 'repairative',
        number: '02',
        title: 'Keratin',
        image: 'assets/images/tr_repair.png',
        hoverImage: 'assets/images/tr_repair_hover.png',
        position: { top: '20%', right: '12%', align: 'end' },
      },
    ],

    // you can add these later with their own positions
    extensions: [
      {
        id: 'sewIn',
        number: '01',
        title: 'Sew In',
        image: 'assets/images/tr_shine.png',
        hoverImage: 'assets/images/tr_shine_hover.png',
        position: { bottom: '25%', left: '50%', transform: 'translateX(-50%)', align: 'center' },
      },
    ],
    color: [
      {
        id: 'highlight',
        number: '01',
        title: 'Highlight',
        image: 'assets/images/tr_gloss.png',
        hoverImage: 'assets/images/tr_gloss_hover.png',
        position: { top: '25%', left: '10%', align: 'start' },
      },
      {
        id: 'balayage',
        number: '02',
        title: 'Balayage',
        image: 'assets/images/tr_repair.png',
        hoverImage: 'assets/images/tr_repair_hover.png',
        position: { top: '20%', right: '12%', align: 'end' },
      },
      {
        id: 'gloss',
        number: '03',
        title: 'Gloss',
        image: 'assets/images/tr_shine.png',
        hoverImage: 'assets/images/tr_shine_hover.png',
        position: { bottom: '25%', left: '50%', transform: 'translateX(-50%)', align: 'center' },
      },
    ],
    styling: [
      {
        id: 'blowout',
        number: '01',
        title: 'Blowout',
        image: 'assets/images/tr_gloss.png',
        hoverImage: 'assets/images/tr_gloss_hover.png',
        position: { top: '25%', left: '10%', align: 'start' },
      },
      {
        id: 'braids',
        number: '02',
        title: 'Braids',
        image: 'assets/images/tr_repair.png',
        hoverImage: 'assets/images/tr_repair_hover.png',
        position: { top: '20%', right: '12%', align: 'end' },
      },
      {
        id: 'silkPress',
        number: '03',
        title: 'Silk Press',
        image: 'assets/images/tr_shine.png',
        hoverImage: 'assets/images/tr_shine_hover.png',
        position: { bottom: '25%',left: '10%', align: 'start' },
      },
            {
        id: 'updo',
        number: '04',
        title: 'Updo',
        image: 'assets/images/tr_shine.png',
        hoverImage: 'assets/images/tr_shine_hover.png',
        position: { bottom: '25%', right: '12%', align: 'end' },
      },
    ],
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

    const opt = this.activeOptions.find((o) => o.id === this.hoveredOptionId);
    return opt?.hoverImage ?? base;
  }
}
