import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { SITE_CONFIG, telHref } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

interface NavLink {
  readonly label: string;
  readonly path: string;
  readonly fragment?: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class NavbarComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly phoneHref = telHref(SITE_CONFIG.contact.chiefPilotPhone);
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  protected readonly links: readonly NavLink[] = [
    { label: 'Portfólio', path: '/portfolio' },
    { label: 'Služby & Flotila', path: '/sluzby-a-flotila' },
    { label: 'Legislatíva & Bezpečnosť', path: '/legislativa-a-tim' },
    { label: 'Kalkulačka ceny', path: '/', fragment: 'kalkulacka' },
  ];

  private readonly document = inject(DOCUMENT);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.closeMenu());

    // Lock page scroll while the mobile drawer is open.
    effect(() => {
      this.document.body.classList.toggle('menu-open', this.menuOpen());
    });

    this.onScroll();
  }

  protected onScroll(): void {
    this.scrolled.set((this.document.defaultView?.scrollY ?? 0) > 24);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
