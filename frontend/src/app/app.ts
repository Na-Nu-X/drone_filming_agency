import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { VideoLightboxModalComponent } from './shared/components/video-lightbox-modal/video-lightbox-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, VideoLightboxModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
    }
  `,
  template: `
    <a class="skip-link" href="#obsah">Preskočiť na obsah</a>
    <app-navbar />
    <main id="obsah" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-video-lightbox-modal />
  `,
})
export class App {}
