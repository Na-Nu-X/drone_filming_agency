import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { SITE_CONFIG } from '../../core/config/site.config';
import { AerialProject, AerialProjectDetail, DroneStyle } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { AerialProjectCardComponent } from '../../shared/components/aerial-project-card/aerial-project-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { toSafeEmbedUrl } from '../../shared/components/video-lightbox-modal/video-embed';

type DetailState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error' }
  | { status: 'success'; project: AerialProjectDetail };

@Component({
  selector: 'app-project-detail-page',
  imports: [RouterLink, IconComponent, AerialProjectCardComponent],
  templateUrl: './project-detail.page.html',
  styleUrl: './project-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPage {
  private readonly api = inject(ApiService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly title = inject(Title);

  /** Bound from the `:slug` route param. */
  readonly slug = input.required<string>();

  private readonly reloadTick = signal(0);
  protected readonly state = signal<DetailState>({ status: 'loading' });
  protected readonly related = signal<AerialProject[]>([]);

  protected readonly project = computed(() => {
    const s = this.state();
    return s.status === 'success' ? s.project : null;
  });

  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const url = toSafeEmbedUrl(this.project()?.video_embed_url);
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  /** Query params that pre-fill the quote form with a similar configuration. */
  protected readonly similarQuery = computed(() => {
    const p = this.project();
    if (!p) {
      return {};
    }
    return { style: guessStyle(p), ref: p.title };
  });

  constructor() {
    const slug$ = toObservable(computed(() => ({ slug: this.slug(), tick: this.reloadTick() })));

    slug$
      .pipe(
        switchMap(({ slug }) =>
          this.api.getProject(slug).pipe(
            map((project): DetailState => ({ status: 'success', project })),
            catchError((err: unknown) =>
              of<DetailState>(err instanceof HttpErrorResponse && err.status === 404 ? { status: 'not-found' } : { status: 'error' }),
            ),
            startWith<DetailState>({ status: 'loading' }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((state) => this.state.set(state));

    // Related projects from the same category.
    toObservable(this.project)
      .pipe(
        switchMap((p) =>
          p
            ? this.api.getProjects({ category: p.category.slug }).pipe(
                map((list) => list.filter((item) => item.slug !== p.slug).slice(0, 3)),
                catchError(() => of([])),
              )
            : of([]),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((list) => this.related.set(list));

    effect(() => {
      const p = this.project();
      if (p) {
        this.title.setTitle(`${p.title} | ${SITE_CONFIG.agencyName}`);
      }
    });
  }

  protected retry(): void {
    this.reloadTick.update((n) => n + 1);
  }
}

function guessStyle(project: AerialProject): DroneStyle {
  const text = `${project.category.slug} ${project.drone_platform}`.toLowerCase();
  const fpv = /fpv|cinewhoop|cinelifter/.test(text);
  const cinema = /inspire|mavic|zenmuse x9/.test(text);
  if (/inspekc|termo|fotogrametr|matrice/.test(text)) {
    return 'inspection';
  }
  if (fpv && cinema) {
    return 'combo';
  }
  return fpv ? 'fpv' : 'cinema';
}
