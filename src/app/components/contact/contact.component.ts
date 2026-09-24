import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly openedAt = Date.now();

  protected readonly contactForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(5000)]],
    privacy: [false, Validators.requiredTrue],
    website: [''],
  });
  protected readonly status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  protected submit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    const { name, email, message, privacy, website } = this.contactForm.getRawValue();
    this.http.post('/send_mail.php', { name, email, message, privacy, website, elapsed: Date.now() - this.openedAt }).subscribe({
      next: () => {
        this.contactForm.reset({ name: '', email: '', message: '', privacy: false, website: '' });
        this.status.set('success');
      },
      error: () => this.status.set('error'),
    });
  }
}
