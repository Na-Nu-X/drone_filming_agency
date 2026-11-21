import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_CONFIG } from '../../core/config/site.config';
import { ApiService } from '../../core/services/api.service';
import { remoteData } from '../../core/services/resource-state';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';

interface RegulationBlock {
  readonly icon: IconName;
  readonly code: string;
  readonly title: string;
  readonly text: string;
  readonly points: readonly string[];
}

interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

@Component({
  selector: 'app-compliance-team-page',
  imports: [RouterLink, IconComponent],
  templateUrl: './compliance-team.page.html',
  styleUrl: './compliance-team.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceTeamPage {
  private readonly api = inject(ApiService);

  protected readonly site = SITE_CONFIG;
  protected readonly pilots = remoteData(() => this.api.getPilots());
  protected readonly openFaq = signal<number | null>(0);

  protected readonly regulations: readonly RegulationBlock[] = [
    {
      icon: 'shield',
      code: 'EÚ 2019/947 · 2019/945',
      title: 'Európske pravidlá EASA',
      text: 'Lietame podľa jednotných pravidiel Európskej agentúry pre bezpečnosť letectva, ktoré rozdeľujú prevádzku dronov do kategórií podľa rizika.',
      points: [
        'Otvorená kategória A1, A2, A3 pre bežné zábery',
        'Špecifická kategória a scenár STS-01 pre lety v zastavaných oblastiach',
        'Drony s triednym označením C1 – C5 a Remote ID',
      ],
    },
    {
      icon: 'award',
      code: 'Dopravný úrad SR',
      title: 'Registrácia a povolenia na Slovensku',
      text: 'Sme registrovaný prevádzkovateľ UAS na Dopravnom úrade SR. Pre lety mimo štandardných podmienok žiadame o letové povolenie alebo prevádzkové oprávnenie.',
      points: [
        'ID prevádzkovateľa viditeľne umiestnené na každom drone',
        'Letové povolenia v obmedzených a zakázaných zónach',
        'Súhlasy vlastníkov pozemkov a samospráv',
      ],
    },
    {
      icon: 'radar',
      code: 'CTR · UAS zóny · NOTAM',
      title: 'Bezletové zóny a okolie letísk',
      text: 'Pred každým letom overujeme mapu UAS zón, riadené okrsky letísk (CTR), dočasné obmedzenia NOTAM aj chránené územia prírody.',
      points: [
        'Koordinácia s riadením letovej prevádzky (LPS SR)',
        'Lety v CTR Bratislava, Košice, Piešťany a ďalších',
        'Súhlasy správ národných parkov (TANAP, NAPANT …)',
      ],
    },
    {
      icon: 'fpv',
      code: 'Indoor FPV protokol',
      title: 'Bezpečnosť FPV letov v interiéri',
      text: 'Interiérové lety nespadajú pod letecké predpisy, no riadime sa vlastným bezpečnostným protokolom, ktorý odsúhlasíme s prevádzkou.',
      points: [
        'Obhliadka, rizikový plán a vymedzený letový koridor',
        'Cinewhoopy s krytmi vrtúľ a hmotnosťou do 250 g',
        'Inštruktáž personálu a pozorovateľ počas letu',
      ],
    },
  ];

  protected readonly safetySteps: readonly { code: string; title: string; text: string }[] = [
    { code: 'T-72h', title: 'Analýza lokality', text: 'Mapa UAS zón, CTR, chránené územia, vlastníci pozemkov.' },
    { code: 'T-48h', title: 'Povolenia', text: 'Žiadosti na Dopravný úrad SR, koordinácia s riadením letovej prevádzky.' },
    { code: 'T-24h', title: 'Meteo & NOTAM', text: 'Predpoveď vetra, zrážok a Kp indexu, kontrola dočasných obmedzení.' },
    { code: 'T-0', title: 'Predletová kontrola', text: 'Checklist techniky, vymedzenie priestoru, brífing posádky.' },
  ];

  protected readonly faq: readonly FaqItem[] = [
    {
      question: 'Môžete lietať aj v centre mesta alebo v blízkosti letiska?',
      answer:
        'Áno. Pre lety v husto zastavaných oblastiach využívame scenár STS-01 alebo letové povolenie Dopravného úradu SR. V riadenom okrsku letiska (CTR) koordinujeme let s riadením letovej prevádzky. Vybavenie povolení trvá spravidla 3 – 5 pracovných dní, preto odporúčame ozvať sa s predstihom. Všetku administratívu riešime za vás.',
    },
    {
      question: 'Čo ak bude v deň natáčania pršať alebo silno fúkať?',
      answer:
        'Bezpečnosť má prednosť. Naše cinema drony zvládajú vietor do cca 12 m/s, no pri daždi, búrke alebo nárazovom vetre let nepovolíme. Počasie sledujeme 72 hodín vopred a pri nepriaznivej predpovedi vám bezplatne ponúkneme náhradný termín. Storno z dôvodu počasia nič nestojí.',
    },
    {
      question: 'Dodávate aj surové zábery pre nášho strihača?',
      answer:
        'Samozrejme. Surové zábery dodávame v plnom rozlíšení – 8K CinemaDNG, Apple ProRes RAW alebo D-Log/D-Log M profil – cez zabezpečené úložisko alebo na SSD disku. Na požiadanie pripravíme aj LUT pre jednoduchší color grading.',
    },
    {
      question: 'Ste poistení pre prípad škody?',
      answer:
        'Áno, každý let kryje poistenie zodpovednosti za škodu spôsobenú prevádzkou UAS s limitom do 1 000 000 €. Poistný certifikát vám radi zašleme vopred – často ho vyžadujú správcovia objektov či organizátori podujatí.',
    },
    {
      question: 'Môže dron letieť nad ľuďmi na podujatí?',
      answer:
        'Lety priamo nad zhromaždením ľudí sú v otvorenej kategórii zakázané. Na eventoch plánujeme trasy mimo davu, využívame teleobjektívy a vymedzený bezpečnostný priestor. Pre špecifické scenáre vieme požiadať o prevádzkové oprávnenie.',
    },
    {
      question: 'Ako rýchlo dostaneme hotové video?',
      answer:
        'Surové dáta odovzdávame do 24 – 48 hodín po natáčaní. Hotový zostrih s color gradingom a hudbou zvyčajne do 3 – 7 pracovných dní podľa rozsahu. Pri urgentných projektoch vieme ponúknuť expresnú postprodukciu.',
    },
  ];

  protected toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
