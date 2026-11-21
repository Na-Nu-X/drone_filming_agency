/**
 * White-label configuration.
 *
 * Every piece of agency branding and business information lives here, so the
 * whole site can be rebranded for a new client by editing this single file
 * (plus the colour tokens in `src/styles/_variables.scss` if needed).
 */

export interface SocialLink {
  readonly label: string;
  readonly url: string;
  readonly icon: 'youtube' | 'vimeo' | 'instagram' | 'linkedin';
}

export interface TrustMetric {
  readonly value: string;
  readonly label: string;
}

export interface Testimonial {
  readonly quote: string;
  readonly author: string;
  readonly role: string;
  readonly company: string;
}

export interface SiteConfig {
  readonly agencyName: string;
  /** Wordmark split into two parts – the second part is rendered in the accent colour. */
  readonly wordmark: { readonly primary: string; readonly accent: string };
  readonly tagline: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly heroImageUrl: string;
  readonly showreel: { readonly title: string; readonly embedUrl: string };
  readonly contact: {
    readonly chiefPilotName: string;
    readonly chiefPilotPhone: string;
    readonly bookingEmail: string;
    readonly studioAddress: { readonly street: string; readonly city: string; readonly country: string };
    readonly openingHours: string;
  };
  readonly company: {
    readonly legalName: string;
    readonly ico: string;
    readonly dic: string;
    readonly icDph?: string;
    readonly registryNote: string;
  };
  readonly compliance: {
    readonly operatorRegistration: string;
    readonly operatorId: string;
    readonly easaNote: string;
    readonly insurance: string;
    readonly insuranceCoverage: string;
  };
  readonly social: readonly SocialLink[];
  readonly trustMetrics: readonly TrustMetric[];
  readonly testimonials: readonly Testimonial[];
}

export const SITE_CONFIG: SiteConfig = {
  agencyName: 'Skyframe Aerial Studio',
  wordmark: { primary: 'SKYFRAME', accent: 'AERIAL' },
  tagline: 'Letecké natáčanie dronom, FPV kinematografia a technické inšpekcie',
  heroTitle: 'Kinematografické zábery z výšky, ktorá predáva.',
  heroSubtitle:
    'Certifikovaní piloti, 8K cinema drony a FPV prelety bez jediného strihu. Povolenia aj v mestách a CTR zónach vybavíme za vás – vy sa sústredíte na príbeh.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80',
  showreel: {
    title: 'Aerial Showreel 2026',
    embedUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ',
  },
  contact: {
    chiefPilotName: 'Ing. Martin Kráľ',
    chiefPilotPhone: '+421 905 123 456',
    bookingEmail: 'natacanie@skyframe.sk',
    studioAddress: {
      street: 'Mlynské nivy 16',
      city: '821 09 Bratislava',
      country: 'Slovensko',
    },
    openingHours: 'Po – Pi 8:00 – 18:00, natáčanie aj cez víkend',
  },
  company: {
    legalName: 'Skyframe Aerial s.r.o.',
    ico: '12 345 678',
    dic: '2023456789',
    icDph: 'SK2023456789',
    registryNote: 'Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka č. 123456/B',
  },
  compliance: {
    operatorRegistration: 'Registrovaný prevádzkovateľ UAS – Dopravný úrad SR',
    operatorId: 'SVK-RP-0000000000',
    easaNote: 'Prevádzka v súlade s nariadeniami (EÚ) 2019/947 a 2019/945 – kategórie Otvorená a Špecifická (STS-01).',
    insurance: 'Poistenie zodpovednosti za škodu pri prevádzke UAS',
    insuranceCoverage: 'do 1 000 000 €',
  },
  social: [
    { label: 'YouTube', url: 'https://www.youtube.com/', icon: 'youtube' },
    { label: 'Vimeo', url: 'https://vimeo.com/', icon: 'vimeo' },
    { label: 'Instagram', url: 'https://www.instagram.com/', icon: 'instagram' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'linkedin' },
  ],
  trustMetrics: [
    { value: '2 400+', label: 'letových hodín' },
    { value: '380+', label: 'zrealizovaných projektov' },
    { value: '0', label: 'bezpečnostných incidentov' },
    { value: '1 mil. €', label: 'poistné krytie' },
  ],
  testimonials: [
    {
      quote:
        'Jednozáberový FPV prelet našou halou mal na LinkedIn viac dosahu než celá kampaň za posledný rok. Tím pripravil bezpečnostný plán tak, že výroba nemusela stáť ani minútu.',
      author: 'Peter Hudec',
      role: 'Marketingový riaditeľ',
      company: 'Konštrukt Industries',
    },
    {
      quote:
        'Povolenie na let v CTR zóne nad Starým Mestom vybavili za päť dní. Zábery z 8K kamery používame na billboardoch aj v predajnom centre.',
      author: 'Zuzana Ondrejková',
      role: 'Head of Sales',
      company: 'Danube Living Development',
    },
    {
      quote:
        'Termovízny report s GPS polohami hotspotov nám ušetril týždne manuálnej kontroly. Presné, rýchle a s jasnými odporúčaniami.',
      author: 'Ing. Róbert Šimko',
      role: 'Technický manažér',
      company: 'SolarGrid Energy',
    },
  ],
};

/** Builds a `tel:` link from a human-formatted phone number. */
export const telHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`;
