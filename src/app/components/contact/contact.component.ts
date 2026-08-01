import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideCheck } from '@ng-icons/lucide';
import { faBrandGithub, faBrandLinkedinIn, faBrandYoutube } from '@ng-icons/font-awesome/brands';
import { RevealStagger } from '../../directives/reveal-stagger.directive';
import { Reveal } from '../../directives/reveal.directive';
import { HttpClient } from '@angular/common/http';

const FIELD_ORDER = ['name', 'email', 'message', 'privacy'] as const;

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, NgIcon, RevealStagger, Reveal],
  providers: [provideIcons({ lucideMail, lucideCheck, faBrandGithub, faBrandLinkedinIn, faBrandYoutube })],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderedAt = Date.now();

  protected readonly sent = signal(false);
  protected readonly sending = signal(false);
  protected readonly failed = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(4)]],
    privacy: [false, [Validators.requiredTrue]],
    website: [''],
  });

  protected onSubmit(): void {
    if (this.sending()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    this.sending.set(true);
    this.failed.set(false);

    const payload = { ...this.form.getRawValue(), elapsed: Date.now() - this.renderedAt };

    this.http.post('send_mail.php', payload).subscribe({
      next: () => {
        this.sent.set(true);
        this.sending.set(false);
        this.form.reset();
        setTimeout(() => this.sent.set(false), 4000);
      },
      error: () => {
        this.sending.set(false);
        this.failed.set(true);
      },
    });
  }

  protected invalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  private focusFirstInvalid(): void {
    const name = FIELD_ORDER.find((field) => this.form.get(field)?.invalid);
    if (!name) return;

    const element = this.host.nativeElement.querySelector<HTMLElement>(`#contact-${name}`);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
