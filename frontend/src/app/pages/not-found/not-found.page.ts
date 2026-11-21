import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero not-found">
      <div class="container">
        <p class="eyebrow">Chyba 404 · Signál stratený</p>
        <h1>Táto stránka je mimo letovej zóny</h1>
        <p class="lead">Adresa neexistuje alebo bola presunutá. Vráťte sa na úvod a pokračujte v lete.</p>
        <div class="actions">
          <a routerLink="/" class="btn btn--primary">Späť na úvod</a>
          <a routerLink="/portfolio" class="btn">Pozrieť portfólio</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      min-height: 70vh;
      display: flex;
      align-items: center;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 2rem;
    }
  `,
})
export class NotFoundPage {}
