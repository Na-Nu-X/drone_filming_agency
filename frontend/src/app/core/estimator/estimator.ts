import { DroneStyle, DurationTier, LocationEnvironment } from '../models/api.models';

/**
 * Pure pricing & airspace-readiness logic shared by the estimator widget
 * and the quote request page. All prices are orientational, in EUR, excl. VAT.
 * Adjust the numbers below to match the client's real price list.
 */

export type OutputMode = 'raw' | 'edit';

export interface EstimatorConfig {
  style: DroneStyle;
  duration: DurationTier;
  environment: LocationEnvironment;
  output: OutputMode;
}

export interface Option<T extends string> {
  value: T;
  label: string;
  hint: string;
}

export const STYLE_OPTIONS: readonly Option<DroneStyle>[] = [
  { value: 'cinema', label: 'Klasické Cinema 4K/8K', hint: 'Plynulé stabilizované zábery' },
  { value: 'fpv', label: 'Dynamický FPV dron', hint: 'Prelety a chasing bez strihu' },
  { value: 'combo', label: 'Kombinácia Cinema + FPV', hint: 'Dve platformy, jedna posádka' },
  { value: 'inspection', label: 'Technická inšpekcia / 3D mapa', hint: 'Termovízia, RTK, ortofoto' },
];

export const DURATION_OPTIONS: readonly Option<DurationTier>[] = [
  { value: 'short', label: 'Krátky výjazd do 2 hod.', hint: '1 lokalita, 2–3 batérie' },
  { value: 'half_day', label: 'Poldenné natáčanie (4 hod.)', hint: 'Viac záberov a svetiel' },
  { value: 'full_day', label: 'Celý natáčací deň (8 hod.)', hint: 'Plná produkcia' },
];

export const ENVIRONMENT_OPTIONS: readonly Option<LocationEnvironment>[] = [
  { value: 'priroda', label: 'Voľná príroda', hint: 'Mimo zástavby' },
  { value: 'mesto', label: 'Mestská zástavba / CTR zóna', hint: 'Vyžaduje povolenia' },
  { value: 'interier', label: 'Interiér haly / budovy', hint: 'Bezpečnostný protokol' },
];

export const OUTPUT_OPTIONS: readonly Option<OutputMode>[] = [
  { value: 'raw', label: 'Surové zábery (RAW / D-Log)', hint: 'Pre vášho strihača' },
  { value: 'edit', label: 'Kompletný zostrih, color grading a hudba', hint: 'Hotové video na kľúč' },
];

const BASE_PRICE: Record<DroneStyle, number> = {
  cinema: 450,
  fpv: 520,
  combo: 890,
  inspection: 490,
};

const DURATION_MULTIPLIER: Record<DurationTier, number> = {
  short: 1,
  half_day: 1.65,
  full_day: 2.7,
};

/** Fixed surcharge for permits, airspace coordination or safety prep. */
const ENVIRONMENT_SURCHARGE: Record<LocationEnvironment, number> = {
  priroda: 0,
  mesto: 180,
  interier: 120,
};

const POST_PRODUCTION: Record<DurationTier, number> = {
  short: 320,
  half_day: 520,
  full_day: 840,
};

export type Readiness = 'fast' | 'coordination' | 'safety';

export interface EstimateResult {
  priceFrom: number;
  priceTo: number;
  platform: string;
  platformNote: string;
  readiness: Readiness;
  leadTime: string;
  leadTimeNote: string;
  crew: string;
  breakdown: { label: string; amount: number }[];
}

const roundTo = (value: number, step: number): number => Math.round(value / step) * step;

function recommendPlatform(config: EstimatorConfig): { platform: string; note: string } {
  const { style, environment, duration } = config;
  switch (style) {
    case 'cinema':
      if (environment === 'interier') {
        return { platform: 'DJI Mavic 3 Pro Cine', note: 'Kompaktný 4/3 senzor, bezpečný pre veľké interiéry.' };
      }
      if (environment === 'mesto' && duration === 'short') {
        return { platform: 'DJI Mavic 3 Pro Cine', note: 'Ľahká trieda pre rýchle mestské lety s plnými povoleniami.' };
      }
      return { platform: 'DJI Inspire 3 • Zenmuse X9-8K Air', note: 'Full-frame 8K pre reklamy a TV.' };
    case 'fpv':
      return environment === 'interier'
        ? { platform: 'Indoor Cinewhoop 2.5" Pro', note: 'Chránené vrtule, lety pomedzi ľudí a stroje.' }
        : { platform: 'Custom CineLifter FPV 7" + RED Komodo', note: 'Chasing áut a dynamické prelety v 6K RAW.' };
    case 'combo':
      return environment === 'interier'
        ? { platform: 'Cinewhoop 2.5" + DJI Mavic 3 Pro Cine', note: 'Interiérový FPV doplnený stabilnými celkami.' }
        : { platform: 'DJI Inspire 3 + CineLifter FPV 7"', note: 'Cinema celky a FPV akcia v jednom dni.' };
    case 'inspection':
      return { platform: 'DJI Matrice 350 RTK + Zenmuse H20T', note: 'Radiometrická termovízia a RTK presnosť do 3 cm.' };
  }
}

function readinessFor(environment: LocationEnvironment): Pick<EstimateResult, 'readiness' | 'leadTime' | 'leadTimeNote'> {
  switch (environment) {
    case 'mesto':
      return {
        readiness: 'coordination',
        leadTime: '3–5 dní na koordináciu letovej zóny',
        leadTimeNote: 'Žiadosť na Dopravný úrad SR, prípadne koordinácia CTR s riadením letovej prevádzky.',
      };
    case 'interier':
      return {
        readiness: 'safety',
        leadTime: 'Výjazd možný do 48–72 hodín',
        leadTimeNote: 'Po krátkej obhliadke a odsúhlasení bezpečnostného protokolu s prevádzkou.',
      };
    case 'priroda':
      return {
        readiness: 'fast',
        leadTime: 'Výjazd možný do 24–48 hodín',
        leadTimeNote: 'Overíme mapu UAS zón a chránené územia – bežne bez ďalších povolení.',
      };
  }
}

export function computeEstimate(config: EstimatorConfig): EstimateResult {
  const flight = BASE_PRICE[config.style] * DURATION_MULTIPLIER[config.duration];
  const airspace = ENVIRONMENT_SURCHARGE[config.environment];
  const post =
    config.output === 'edit'
      ? POST_PRODUCTION[config.duration] * (config.style === 'combo' ? 1.25 : 1)
      : 0;

  const breakdown = [
    { label: 'Letová prevádzka a posádka', amount: roundTo(flight, 10) },
    { label: 'Povolenia a príprava lokality', amount: roundTo(airspace, 10) },
    { label: config.output === 'edit' ? 'Postprodukcia na kľúč' : 'Export surových dát', amount: roundTo(post, 10) },
  ];

  const total = flight + airspace + post;
  const { platform, note } = recommendPlatform(config);

  return {
    priceFrom: roundTo(total * 0.92, 10),
    priceTo: roundTo(total * 1.15, 10),
    platform,
    platformNote: note,
    crew: config.style === 'combo' ? '3-členná posádka' : config.style === 'cinema' && config.duration !== 'short' ? 'Pilot + kameraman' : 'Pilot + pozorovateľ',
    breakdown,
    ...readinessFor(config.environment),
  };
}

export const DEFAULT_ESTIMATOR_CONFIG: EstimatorConfig = {
  style: 'cinema',
  duration: 'half_day',
  environment: 'priroda',
  output: 'edit',
};

/** Type guards for parsing URL query params safely. */
export const isDroneStyle = (v: unknown): v is DroneStyle => STYLE_OPTIONS.some((o) => o.value === v);
export const isDuration = (v: unknown): v is DurationTier => DURATION_OPTIONS.some((o) => o.value === v);
export const isEnvironment = (v: unknown): v is LocationEnvironment => ENVIRONMENT_OPTIONS.some((o) => o.value === v);
export const isOutputMode = (v: unknown): v is OutputMode => v === 'raw' || v === 'edit';

export const labelOf = <T extends string>(options: readonly Option<T>[], value: T): string =>
  options.find((o) => o.value === value)?.label ?? value;

export const formatEur = (value: number): string =>
  new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
