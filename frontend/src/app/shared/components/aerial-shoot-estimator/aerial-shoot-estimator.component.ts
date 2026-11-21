import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  DEFAULT_ESTIMATOR_CONFIG,
  DURATION_OPTIONS,
  ENVIRONMENT_OPTIONS,
  EstimatorConfig,
  OUTPUT_OPTIONS,
  Option,
  OutputMode,
  STYLE_OPTIONS,
  computeEstimate,
  formatEur,
} from '../../../core/estimator/estimator';
import { DroneStyle, DurationTier, LocationEnvironment } from '../../../core/models/api.models';
import { IconComponent, IconName } from '../icon/icon.component';

interface OptionGroup<K extends keyof EstimatorConfig> {
  readonly key: K;
  readonly step: string;
  readonly legend: string;
  readonly options: readonly Option<EstimatorConfig[K]>[];
}

@Component({
  selector: 'app-aerial-shoot-estimator',
  imports: [IconComponent],
  templateUrl: './aerial-shoot-estimator.component.html',
  styleUrl: './aerial-shoot-estimator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerialShootEstimatorComponent {
  private readonly router = inject(Router);

  protected readonly style = signal<DroneStyle>(DEFAULT_ESTIMATOR_CONFIG.style);
  protected readonly duration = signal<DurationTier>(DEFAULT_ESTIMATOR_CONFIG.duration);
  protected readonly environment = signal<LocationEnvironment>(DEFAULT_ESTIMATOR_CONFIG.environment);
  protected readonly output = signal<OutputMode>(DEFAULT_ESTIMATOR_CONFIG.output);

  protected readonly config = computed<EstimatorConfig>(() => ({
    style: this.style(),
    duration: this.duration(),
    environment: this.environment(),
    output: this.output(),
  }));

  protected readonly estimate = computed(() => computeEstimate(this.config()));
  protected readonly formatEur = formatEur;

  protected readonly groups = [
    { key: 'style', step: '01', legend: 'Štýl záberov', options: STYLE_OPTIONS },
    { key: 'duration', step: '02', legend: 'Rozsah natáčania', options: DURATION_OPTIONS },
    { key: 'environment', step: '03', legend: 'Prostredie / Letová zóna', options: ENVIRONMENT_OPTIONS },
    { key: 'output', step: '04', legend: 'Výstup a postprodukcia', options: OUTPUT_OPTIONS },
  ] as const satisfies readonly [
    OptionGroup<'style'>,
    OptionGroup<'duration'>,
    OptionGroup<'environment'>,
    OptionGroup<'output'>,
  ];

  protected readonly readinessIcon = computed<IconName>(() => {
    switch (this.estimate().readiness) {
      case 'fast':
        return 'check';
      case 'coordination':
        return 'radar';
      case 'safety':
        return 'shield';
    }
  });

  protected isSelected(key: keyof EstimatorConfig, value: string): boolean {
    return this.config()[key] === value;
  }

  protected select(key: keyof EstimatorConfig, value: string): void {
    switch (key) {
      case 'style':
        this.style.set(value as DroneStyle);
        break;
      case 'duration':
        this.duration.set(value as DurationTier);
        break;
      case 'environment':
        this.environment.set(value as LocationEnvironment);
        break;
      case 'output':
        this.output.set(value as OutputMode);
        break;
    }
  }

  protected sendQuote(): void {
    const c = this.config();
    void this.router.navigate(['/dopyt'], {
      queryParams: { style: c.style, duration: c.duration, env: c.environment, post: c.output },
    });
  }
}
