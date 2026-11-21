import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SITE_CONFIG, telHref } from '../../core/config/site.config';
import {
  DEFAULT_ESTIMATOR_CONFIG,
  DURATION_OPTIONS,
  ENVIRONMENT_OPTIONS,
  STYLE_OPTIONS,
  computeEstimate,
  formatEur,
  isDroneStyle,
  isDuration,
  isEnvironment,
  isOutputMode,
} from '../../core/estimator/estimator';
import { DroneStyle, DurationTier, FlightQuotePayload, LocationEnvironment } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const PHONE_PATTERN = /^\+?[0-9 ()/-]{9,20}$/;

/** Field-level Slovak validation messages. */
const MESSAGES: Record<string, Record<string, string>> = {
  shoot_location: {
    required: 'Zadajte miesto natáčania – potrebujeme ho na overenie letovej zóny.',
    minlength: 'Uveďte presnejšiu lokalitu (adresa, obec alebo GPS).',
  },
  contact_name: { required: 'Zadajte meno kontaktnej osoby.', minlength: 'Meno je príliš krátke.' },
  email: { required: 'Zadajte e-mail.', email: 'Zadajte platnú e-mailovú adresu.' },
  phone: { required: 'Zadajte telefónne číslo.', pattern: 'Zadajte platné číslo, napr. +421 900 123 456.' },
  project_details: {
    required: 'Popíšte prosím projekt.',
    minlength: 'Popíšte projekt aspoň v pár vetách (min. 20 znakov).',
  },
  gdpr: { required: 'Pre odoslanie dopytu je potrebný súhlas so spracovaním údajov.' },
};

@Component({
  selector: 'app-quote-page',
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './quote.page.html',
  styleUrl: './quote.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotePage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly site = SITE_CONFIG;
  protected readonly phoneHref = telHref(SITE_CONFIG.contact.chiefPilotPhone);
  protected readonly styleOptions = STYLE_OPTIONS;
  protected readonly durationOptions = DURATION_OPTIONS;
  protected readonly environmentOptions = ENVIRONMENT_OPTIONS;
  protected readonly formatEur = formatEur;

  protected readonly submitState = signal<SubmitState>('idle');
  protected readonly serverErrors = signal<Record<string, string>>({});
  protected readonly prefilledFrom = signal<string | null>(null);
  protected readonly submittedName = signal('');

  protected readonly form = this.fb.group({
    drone_style: this.fb.control<DroneStyle>(DEFAULT_ESTIMATOR_CONFIG.style, Validators.required),
    shoot_location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    location_environment: this.fb.control<LocationEnvironment>(DEFAULT_ESTIMATOR_CONFIG.environment, Validators.required),
    duration_tier: this.fb.control<DurationTier>(DEFAULT_ESTIMATOR_CONFIG.duration, Validators.required),
    post_production_needed: [true],
    preferred_date: ['', Validators.maxLength(120)],
    company_name: ['', Validators.maxLength(160)],
    contact_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    project_details: ['', [Validators.required, Validators.minLength(20)]],
    website: [''],
    gdpr: [false, Validators.requiredTrue],
  });

  private readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly estimate = computed(() => {
    const v = this.formValue();
    return computeEstimate({
      style: v.drone_style ?? DEFAULT_ESTIMATOR_CONFIG.style,
      duration: v.duration_tier ?? DEFAULT_ESTIMATOR_CONFIG.duration,
      environment: v.location_environment ?? DEFAULT_ESTIMATOR_CONFIG.environment,
      output: v.post_production_needed === false ? 'raw' : 'edit',
    });
  });

  constructor() {
    this.applyQueryParams();
  }

  /** Pre-fill from `?style=&duration=&env=&post=&ref=` (estimator / project CTAs). */
  private applyQueryParams(): void {
    const params = inject(ActivatedRoute).snapshot.queryParamMap;
    const style = params.get('style');
    const duration = params.get('duration');
    const env = params.get('env');
    const post = params.get('post');
    const ref = params.get('ref');

    const patch: Partial<ReturnType<typeof this.form.getRawValue>> = {};
    if (isDroneStyle(style)) patch.drone_style = style;
    if (isDuration(duration)) patch.duration_tier = duration;
    if (isEnvironment(env)) patch.location_environment = env;
    if (isOutputMode(post)) patch.post_production_needed = post === 'edit';
    if (ref) {
      const reference = ref.slice(0, 200);
      patch.project_details = `Chceli by sme podobné zábery ako v projekte „${reference}“.\n\n`;
      this.prefilledFrom.set(reference);
    } else if (style || duration || env) {
      this.prefilledFrom.set('kalkulačky ceny');
    }
    this.form.patchValue(patch);
  }

  protected errorFor(field: string): string | null {
    const server = this.serverErrors()[field];
    if (server) {
      return server;
    }
    const control = this.form.get(field);
    if (!control || !control.invalid || !(control.touched || control.dirty)) {
      return null;
    }
    const key = Object.keys(control.errors ?? {})[0];
    return MESSAGES[field]?.[key] ?? 'Skontrolujte toto pole.';
  }

  protected clearServerError(field: string): void {
    if (this.serverErrors()[field]) {
      const { [field]: _removed, ...rest } = this.serverErrors();
      this.serverErrors.set(rest);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    const { gdpr: _consent, ...value } = this.form.getRawValue();
    const payload: FlightQuotePayload = value;

    this.submitState.set('submitting');
    this.serverErrors.set({});

    this.api
      .submitQuote(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submittedName.set(payload.contact_name.split(' ')[0]);
          this.submitState.set('success');
          this.form.reset();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 400 && err.error && typeof err.error === 'object') {
            const mapped: Record<string, string> = {};
            for (const [field, messages] of Object.entries(err.error as Record<string, unknown>)) {
              mapped[field] = Array.isArray(messages) ? String(messages[0]) : String(messages);
            }
            this.serverErrors.set(mapped);
            this.submitState.set('idle');
            this.focusFirstInvalid();
            return;
          }
          this.submitState.set('error');
        },
      });
  }

  protected newRequest(): void {
    this.submitState.set('idle');
    this.prefilledFrom.set(null);
  }

  private focusFirstInvalid(): void {
    queueMicrotask(() => {
      document.querySelector<HTMLElement>('.quote-form .is-invalid, .quote-form [aria-invalid="true"]')?.focus();
    });
  }
}
