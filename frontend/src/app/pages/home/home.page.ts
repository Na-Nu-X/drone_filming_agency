import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_CONFIG } from '../../core/config/site.config';
import { formatEur } from '../../core/estimator/estimator';
import { ApiService } from '../../core/services/api.service';
import { remoteData } from '../../core/services/resource-state';
import { VideoLightboxService } from '../../core/services/video-lightbox.service';
import { AerialProjectCardComponent } from '../../shared/components/aerial-project-card/aerial-project-card.component';
import { AerialShootEstimatorComponent } from '../../shared/components/aerial-shoot-estimator/aerial-shoot-estimator.component';
import { IconComponent, IconName, toIconName } from '../../shared/components/icon/icon.component';

interface TrustPillar {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
  readonly meta: string;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, IconComponent, AerialProjectCardComponent, AerialShootEstimatorComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly api = inject(ApiService);
  private readonly lightbox = inject(VideoLightboxService);

  protected readonly site = SITE_CONFIG;
  protected readonly projects = remoteData(() => this.api.getProjects({ featured: true }));
  protected readonly services = remoteData(() => this.api.getServices());
  protected readonly toIconName = toIconName;

  protected readonly pillars: readonly TrustPillar[] = [
    {
      icon: 'shield',
      title: 'Registrovaný prevádzkovateľ',
      text: 'Sme zapísaní v registri prevádzkovateľov UAS Dopravného úradu SR a lietame podľa nariadení EASA.',
      meta: 'Dopravný úrad SR',
    },
    {
      icon: 'award',
      title: 'Piloti s licenciami A1/A3, A2 a STS',
      text: 'Každý pilot má platné osvedčenia vrátane štandardného scenára STS-01 pre lety v zastavaných oblastiach.',
      meta: 'EASA A1/A3 · A2 · STS-01',
    },
    {
      icon: 'check',
      title: 'Poistenie zodpovednosti do 1 mil. €',
      text: 'Každý let kryje poistenie zodpovednosti za škodu. Poistný certifikát dodáme na vyžiadanie pred natáčaním.',
      meta: 'Krytie 1 000 000 €',
    },
    {
      icon: 'radar',
      title: 'Povolenia v meste aj v CTR zónach',
      text: 'Vybavíme letové povolenia, koordináciu s riadením letovej prevádzky aj súhlasy vlastníkov pozemkov.',
      meta: 'Mesto · CTR · Chránené územia',
    },
  ];

  protected formatPrice(value: string | null): string | null {
    return value === null ? null : formatEur(Number(value));
  }

  protected playShowreel(): void {
    this.lightbox.open({ embedUrl: this.site.showreel.embedUrl, title: this.site.showreel.title });
  }
}
