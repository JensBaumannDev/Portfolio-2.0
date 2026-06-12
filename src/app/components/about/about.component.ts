import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly developerName = 'Jens Baumann';
  protected readonly passions = ['Angular', 'TypeScript', 'AI', 'Design'];
  protected readonly isExpanded = signal(false);

  protected toggleExpand(): void {
    this.isExpanded.update(val => !val);
  }
}

