import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideX } from '@ng-icons/lucide';
import type { PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist';

const PDF_WORKER_URL = '/pdfjs/pdf.worker.min.mjs';

interface PdfPage {
  url: string;
  width: number;
  height: number;
  text: string;
}

@Component({
  selector: 'app-pdf-preview',
  imports: [TranslatePipe, NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideX })],
  templateUrl: './pdf-preview.html',
  styleUrl: './pdf-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfPreview {
  readonly src = input.required<string>();
  private readonly viewer = viewChild.required<ElementRef<HTMLDialogElement>>('viewer');
  private readonly track = viewChild<ElementRef<HTMLDivElement>>('track');
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly pages = signal<readonly PdfPage[]>([]);
  protected readonly active = signal(0);
  protected readonly current = computed(() => this.pages()[this.active()]);
  private readonly scrollTarget = signal<number | null>(null);
  private readonly retried = signal(false);

  constructor() {
    afterNextRender(() => {
      effect(
        (onCleanup) => {
          const src = this.src();
          let cancelled = false;
          let loading: PDFDocumentLoadingTask | undefined;
          let rendering: RenderTask | undefined;
          const urls: string[] = [];
          this.pages.set([]);
          this.active.set(0);
          this.status.set('loading');

          onCleanup(() => {
            cancelled = true;
            rendering?.cancel();
            void loading?.destroy().catch(() => undefined);
            urls.forEach((url) => URL.revokeObjectURL(url));
          });

          void (async () => {
            const pdfjs = await import('pdfjs-dist');
            if (cancelled) return;
            pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
            loading = pdfjs.getDocument({ url: src });
            const pdf = await loading.promise;
            for (let number = 1; number <= pdf.numPages; number++) {
              if (cancelled) return;
              const page = await pdf.getPage(number);
              if (cancelled) return;
              const viewport = page.getViewport({ scale: 2 });
              const canvas = this.document.createElement('canvas');
              canvas.width = Math.ceil(viewport.width);
              canvas.height = Math.ceil(viewport.height);
              rendering = page.render({ canvas, viewport });
              await rendering.promise;
              if (cancelled) return;
              const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, 'image/webp', 0.92),
              );
              const content = await page.getTextContent();
              if (cancelled || !blob) return;
              const url = URL.createObjectURL(blob);
              urls.push(url);
              const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
              this.pages.update((pages) => [
                ...pages,
                { url, width: canvas.width, height: canvas.height, text },
              ]);
            }
            this.status.set('ready');
          })().catch(() => {
            if (!cancelled) this.status.set('error');
          });
        },
        { injector: this.injector },
      );
    });
  }

  protected open(index: number): void {
    this.goTo(index);
    this.viewer().nativeElement.showModal();
  }

  protected close(): void {
    this.viewer().nativeElement.close();
  }

  protected step(direction: number): void {
    this.goTo(this.active() + direction);
  }

  protected goTo(index: number): void {
    const next = Math.min(Math.max(index, 0), this.pages().length - 1);
    this.active.set(next);
    const track = this.track()?.nativeElement;
    if (!track) return;
    const left = next * track.clientWidth;
    this.scrollTarget.set(null);
    if (Math.abs(track.scrollLeft - left) < 1) return;
    const reduce = this.document.defaultView?.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const instant = reduce || this.viewer().nativeElement.open;
    this.scrollTarget.set(instant ? null : next);
    this.retried.set(false);
    track.scrollTo({ left, behavior: instant ? 'auto' : 'smooth' });
  }

  protected syncToScroll(): void {
    const track = this.track()?.nativeElement;
    if (!track?.clientWidth) return;
    const target = this.scrollTarget();
    if (target !== null) {
      const arrived = Math.abs(track.scrollLeft - target * track.clientWidth) < 1;
      if (!arrived) return;
      this.scrollTarget.set(null);
    }
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== this.active()) this.active.set(index);
  }

  protected onScrollEnd(): void {
    const track = this.track()?.nativeElement;
    const target = this.scrollTarget();
    if (track && target !== null && !this.retried()) {
      const left = target * track.clientWidth;
      if (Math.abs(track.scrollLeft - left) >= 1) {
        this.retried.set(true);
        track.scrollTo({ left, behavior: 'smooth' });
        return;
      }
    }
    this.scrollTarget.set(null);
    this.syncToScroll();
  }

  protected releaseScroll(): void {
    this.scrollTarget.set(null);
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.step(-1);
    if (event.key === 'ArrowRight') this.step(1);
  }
}
