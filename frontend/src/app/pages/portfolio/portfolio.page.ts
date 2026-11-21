import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import { remoteData } from '../../core/services/resource-state';
import { AerialProjectCardComponent } from '../../shared/components/aerial-project-card/aerial-project-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

/** Short filter labels for known category slugs (falls back to the category name). */
const SHORT_LABELS: Readonly<Record<string, string>> = {
  'reklamne-a-tv-zabery': 'Reklamné spoty',
  'fpv-prelety': 'FPV prelety',
  'reality-a-architektura': 'Reality & Architektúra',
  'eventy-a-sport': 'Eventy',
  'inspekcie-a-termovizia': 'Inšpekcie',
  'fotogrametria-a-ortofotomapy': '3D mapovanie',
};

interface FilterTab {
  readonly slug: string | null;
  readonly label: string;
  readonly count: number;
}

@Component({
  selector: 'app-portfolio-page',
  imports: [AerialProjectCardComponent, IconComponent],
  templateUrl: './portfolio.page.html',
  styleUrl: './portfolio.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  /** Bound from the `?kategoria=` query param (router input binding). */
  readonly kategoria = input<string | undefined>();

  protected readonly projects = remoteData(() => this.api.getProjects());
  protected readonly categories = remoteData(() => this.api.getCategories());
  protected readonly search = signal('');

  protected readonly activeCategory = computed(() => this.kategoria() ?? null);

  protected readonly tabs = computed<FilterTab[]>(() => {
    const projects = this.projects.data() ?? [];
    const categories = (this.categories.data() ?? []).filter((c) => c.project_count > 0);
    return [
      { slug: null, label: 'Všetko', count: projects.length },
      ...categories.map((c) => ({ slug: c.slug, label: SHORT_LABELS[c.slug] ?? c.name, count: c.project_count })),
    ];
  });

  protected readonly filtered = computed(() => {
    const category = this.activeCategory();
    const term = normalize(this.search().trim());
    return (this.projects.data() ?? []).filter((p) => {
      if (category && p.category.slug !== category) {
        return false;
      }
      if (!term) {
        return true;
      }
      return normalize(`${p.title} ${p.location_name} ${p.drone_platform} ${p.client_name}`).includes(term);
    });
  });

  protected selectCategory(slug: string | null): void {
    void this.router.navigate([], {
      queryParams: { kategoria: slug },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected resetFilters(): void {
    this.search.set('');
    this.selectCategory(null);
  }
}

/** Case- and diacritics-insensitive comparison helper ("Žilina" ~ "zilina"). */
function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}
