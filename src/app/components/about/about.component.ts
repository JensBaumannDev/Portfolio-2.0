import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NgOptimizedImage } from '@angular/common';
import {
  lucideUser,
  lucideBriefcase,
  lucideInfo,
  lucideMapPin,
  lucideTerminal,
  lucideTarget,
  lucideAward,
  lucideHammer,
  lucideGlobe,
  lucideSparkles,
  lucideChevronDown,
  lucideChevronUp
} from '@ng-icons/lucide';

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, NgIcon, NgOptimizedImage],
  providers: [
    provideIcons({
      lucideUser,
      lucideBriefcase,
      lucideInfo,
      lucideMapPin,
      lucideTerminal,
      lucideTarget,
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
    './img/profile/jb_one.JPEG',
    './img/profile/jb_two.JPEG',
  ];

  protected readonly activeIndex = signal(0);
  protected readonly previousIndex = signal(-1);
  protected readonly flippedStates = signal<boolean[]>(Array(12).fill(false));
  protected readonly isExpanded = signal(false);
  private intervalId?: any;

  protected toggleExpand(): void {
    this.isExpanded.update((val) => !val);
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.previousIndex.set(this.activeIndex());
      this.activeIndex.update((index) => (index + 1) % this.images.length);
    }, 8000);
  }

  protected toggleCard(index: number): void {
    this.flippedStates.update((states) => {
      const newStates = Array(12).fill(false);
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
