import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHero } from '../../components/page-hero/page-hero';
import { SeoService } from '../../services/seo.service';

type ContactField = 'name' | 'email' | 'message' | 'privacy';

const FIELDS: readonly ContactField[] = ['name', 'email', 'message', 'privacy'];

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage, PageHero, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly openedAt = Date.now();
  private readonly done = viewChild<ElementRef<HTMLElement>>('done');

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(5000)]],
    privacy: [false, Validators.requiredTrue],
    website: [''],
  });
  protected readonly status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  constructor() {
    inject(SeoService).apply({
      titleKey: 'seo.contact_title',
      descriptionKey: 'seo.contact_desc',
      path: '/contact',
    });
    effect(() => this.done()?.nativeElement.focus());
  }

  protected invalid(field: ContactField): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const first = FIELDS.find((field) => this.form.controls[field].invalid);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    this.status.set('sending');
    const { name, email, message, privacy, website } = this.form.getRawValue();
    this.http
      .post('/send_mail.php', {
        name,
        email,
        message,
        privacy,
        website,
        elapsed: Date.now() - this.openedAt,
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.status.set('success');
        },
        error: () => this.status.set('error'),
      });
  }
}
