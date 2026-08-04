import { Component, ChangeDetectionStrategy, input, output, inject, ElementRef, afterNextRender, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideExternalLink, lucideArrowRight, lucideArrowLeft } from '@ng-icons/lucide';
import { Navigation } from '../../navigation/navigation.component';
import { ScrollLockService } from '../../../services/scroll-lock.service';
import type { Project } from '../../../constants/projects.constants';

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
})
export class ProjectDialog implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly scrollLock = inject(ScrollLockService);
  private readonly lockToken = Symbol('project-dialog');
  private readonly previouslyFocused = this.document.activeElement as HTMLElement | null;
  private dialogElement?: HTMLDialogElement;

  readonly project = input.required<Project>();
  readonly close = output<void>();
  readonly next = output<void>();

  constructor() {
    afterNextRender(() => {
      this.dialogElement = this.host.nativeElement.querySelector('dialog') ?? undefined;
      this.dialogElement?.showModal();
    });
  }

  ngOnInit(): void {
    this.scrollLock.lock(this.lockToken);
  }

  ngOnDestroy(): void {
    this.scrollLock.release(this.lockToken);
    this.dialogElement?.close();
    this.previouslyFocused?.focus();
  }

  protected onNavLinkClick(section: string): void {
    this.close.emit();
    setTimeout(() => {
      this.document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
}
