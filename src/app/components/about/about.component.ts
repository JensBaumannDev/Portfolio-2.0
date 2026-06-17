import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NgOptimizedImage } from '@angular/common';
import {
  lucideBriefcase,
  lucideInfo,
  lucideMapPin,
  lucideTerminal,
  lucideAward,
  lucideHammer,
  lucideGlobe,
  lucideSparkles,
  lucideChevronDown,
  lucideChevronUp
} from '@ng-icons/lucide';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';

const FACT_CARD_COUNT = 9;

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, NgIcon, NgOptimizedImage, Reveal, RevealStagger],
  providers: [
    provideIcons({
      lucideBriefcase,
      lucideInfo,
      lucideMapPin,
      lucideTerminal,
      lucideAward,
      lucideHammer,
      lucideGlobe,
      lucideSparkles,
      lucideChevronDown,
      lucideChevronUp
    })
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements OnInit, OnDestroy {
  protected readonly images = [
    './img/profile/hello_world.png',
    './img/profile/jb_one_small.jpg',
    './img/profile/jb_two_small.jpg',
  ];

  protected readonly activeIndex = signal(0);
  protected readonly flippedStates = signal<boolean[]>(Array(FACT_CARD_COUNT).fill(false));
  protected readonly isExpanded = signal(false);
  private intervalId?: ReturnType<typeof setInterval>;

  protected toggleExpand(): void {
    this.isExpanded.update((val) => !val);
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.activeIndex.update((index) => (index + 1) % this.images.length);
    }, 8000);
  }

  protected toggleCard(index: number): void {
    this.flippedStates.update((states) => {
      const newStates = Array(FACT_CARD_COUNT).fill(false);
      newStates[index] = !states[index];
      return newStates;
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
