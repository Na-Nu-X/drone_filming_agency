import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_CONFIG, telHref } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly phoneHref = telHref(SITE_CONFIG.contact.chiefPilotPhone);
  protected readonly year = new Date().getFullYear();

  protected readonly quickLinks = [
    { label: 'Portfólio', path: '/portfolio' },
    { label: 'Služby & Flotila dronov', path: '/sluzby-a-flotila' },
    { label: 'Legislatíva & Tím', path: '/legislativa-a-tim' },
    { label: 'Nezáväzná ponuka', path: '/dopyt' },
  ] as const;
}
