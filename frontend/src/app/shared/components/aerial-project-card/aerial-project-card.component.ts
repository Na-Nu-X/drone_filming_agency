import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerialProject } from '../../../core/models/api.models';
import { VideoLightboxService } from '../../../core/services/video-lightbox.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-aerial-project-card',
  imports: [RouterLink, IconComponent],
  templateUrl: './aerial-project-card.component.html',
  styleUrl: './aerial-project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerialProjectCardComponent {
  readonly project = input.required<AerialProject>();
  /** Use `eager` for above-the-fold cards. */
  readonly loading = input<'lazy' | 'eager'>('lazy');

  private readonly lightbox = inject(VideoLightboxService);

  protected readonly isFpv = computed(() => {
    const p = this.project();
    return /fpv|cinewhoop|cinelifter/i.test(p.drone_platform) || p.category.slug.includes('fpv');
  });

  /** Short badge such as "DJI Inspire 3" or "FPV". */
  protected readonly droneBadge = computed(() => {
    const platform = this.project().drone_platform;
    if (this.isFpv()) {
      return 'FPV';
    }
    return platform.split(/[•+]/)[0].trim();
  });

  protected playVideo(): void {
    const p = this.project();
    this.lightbox.open({ embedUrl: p.video_embed_url, title: p.title });
  }
}
