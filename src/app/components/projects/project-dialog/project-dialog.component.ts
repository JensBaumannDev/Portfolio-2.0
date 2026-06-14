import { Component, ChangeDetectionStrategy, input, output, inject, ElementRef, afterNextRender, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideExternalLink, lucideArrowRight, lucideArrowLeft } from '@ng-icons/lucide';
import { Navigation } from '../../navigation/navigation.component';
import type { Project } from '../projects.component';

@Component({
  selector: 'app-project-dialog',
  imports: [TranslatePipe, NgOptimizedImage, NgIcon, Navigation],
  providers: [
    provideIcons({
      lucideGithub,
      lucideExternalLink,
      lucideArrowRight,
      lucideArrowLeft,
    })
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'close.emit()',
  },
})
export class ProjectDialog implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  readonly project = input.required<Project>();
  readonly close = output<void>();
  readonly next = output<void>();

  constructor() {
    afterNextRender(() => {
      this.host.nativeElement.querySelector<HTMLElement>('.dialog')?.focus();
    });
  }

  ngOnInit(): void {
    if (this.document?.documentElement) {
      this.document.documentElement.classList.add('no-scroll');
    }
    if (this.document?.body) {
      this.document.body.classList.add('no-scroll');
    }
  }

  ngOnDestroy(): void {
    if (this.document?.documentElement) {
      this.document.documentElement.classList.remove('no-scroll');
    }
    if (this.document?.body) {
      this.document.body.classList.remove('no-scroll');
    }
  }

  protected onNavLinkClick(section: string): void {
    this.close.emit();
    setTimeout(() => {
      const element = this.document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }
}
