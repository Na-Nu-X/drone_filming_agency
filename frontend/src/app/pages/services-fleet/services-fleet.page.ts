import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, afterNextRender, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { formatEur } from '../../core/estimator/estimator';
import { DroneStyle } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { remoteData } from '../../core/services/resource-state';
import { IconComponent, toIconName } from '../../shared/components/icon/icon.component';

/** Maps a service category to the matching estimator / quote style. */
const STYLE_BY_CATEGORY: Readonly<Record<string, DroneStyle>> = {
  'fpv-prelety': 'fpv',
  'inspekcie-a-termovizia': 'inspection',
  'fotogrametria-a-ortofotomapy': 'inspection',
};

@Component({
  selector: 'app-services-fleet-page',
  imports: [RouterLink, IconComponent],
  templateUrl: './services-fleet.page.html',
  styleUrl: './services-fleet.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesFleetPage {
  private readonly api = inject(ApiService);

  protected readonly services = remoteData(() => this.api.getServices());
  protected readonly fleet = remoteData(() => this.api.getFleet());
  protected readonly toIconName = toIconName;

  private readonly fragment = toSignal(inject(ActivatedRoute).fragment);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);

  constructor() {
    // Content arrives asynchronously, so re-apply fragment scrolling once loaded.
    effect(() => {
      const fragment = this.fragment();
      if (!fragment || this.services.status() !== 'success' || this.fleet.status() !== 'success') {
        return;
      }
      untracked(() =>
        afterNextRender(() => this.document.getElementById(fragment)?.scrollIntoView({ block: 'start' }), {
          injector: this.injector,
        }),
      );
    });
  }

  protected formatPrice(value: string | null): string | null {
    return value === null ? null : formatEur(Number(value));
  }

  protected quoteParams(categorySlug: string): Record<string, string> {
    return { style: STYLE_BY_CATEGORY[categorySlug] ?? 'cinema' };
  }
}
