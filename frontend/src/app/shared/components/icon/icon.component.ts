import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'cinema'
  | 'fpv'
  | 'building'
  | 'event'
  | 'thermal'
  | 'map'
  | 'play'
  | 'arrow-right'
  | 'shield'
  | 'check'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'menu'
  | 'close'
  | 'drone'
  | 'clock'
  | 'battery'
  | 'aperture'
  | 'award'
  | 'wind'
  | 'chevron-down'
  | 'layers'
  | 'radar'
  | 'youtube'
  | 'vimeo'
  | 'instagram'
  | 'linkedin';

/**
 * Lightweight inline SVG icon set (24×24, 1.5px stroke) – no icon font or
 * external dependency. Decorative by default (`aria-hidden`).
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', 'aria-hidden': 'true' },
  styles: `
    :host {
      display: inline-flex;
      width: 1.25em;
      height: 1.25em;
      flex-shrink: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      @switch (name()) {
        @case ('cinema') {
          <rect x="2.5" y="6" width="13" height="12" rx="1.5" />
          <path d="m15.5 10 6-3.5v11l-6-3.5" />
          <circle cx="6.5" cy="10" r="1" />
        }
        @case ('fpv') {
          <path d="M3 12h4l2-5 3 10 2-5h7" />
        }
        @case ('building') {
          <path d="M4 21V5l8-3v19M12 8l8 3v10M2 21h20M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" />
        }
        @case ('event') {
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        }
        @case ('thermal') {
          <path d="M14 14.76V4a2 2 0 1 0-4 0v10.76a4 4 0 1 0 4 0Z" />
          <path d="M12 9v8" />
        }
        @case ('map') {
          <path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z" />
          <path d="M9 4v13.5M15 6.5V20" />
        }
        @case ('play') {
          <path d="M7 4.5v15l12.5-7.5L7 4.5Z" fill="currentColor" stroke="none" />
        }
        @case ('arrow-right') {
          <path d="M4 12h16M14 6l6 6-6 6" />
        }
        @case ('shield') {
          <path d="M12 2.5 4 5.5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10v-6l-8-3Z" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        }
        @case ('check') {
          <path d="m4.5 12.5 4.5 4.5 10.5-11" />
        }
        @case ('phone') {
          <path d="M5 3h3.5l1.5 5-2.2 1.4a12 12 0 0 0 6.8 6.8L16 14l5 1.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
        }
        @case ('mail') {
          <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
          <path d="m3 6 9 7 9-7" />
        }
        @case ('pin') {
          <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        }
        @case ('menu') {
          <path d="M3 7h18M3 12h18M3 17h12" />
        }
        @case ('close') {
          <path d="M6 6l12 12M18 6 6 18" />
        }
        @case ('drone') {
          <circle cx="5" cy="5" r="2.5" />
          <circle cx="19" cy="5" r="2.5" />
          <circle cx="5" cy="19" r="2.5" />
          <circle cx="19" cy="19" r="2.5" />
          <path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        }
        @case ('battery') {
          <rect x="2.5" y="7" width="17" height="10" rx="1.5" />
          <path d="M22 11v2M6 10v4M9.5 10v4M13 10v4" />
        }
        @case ('aperture') {
          <circle cx="12" cy="12" r="9" />
          <path d="m14.3 3.3-3.6 6.3M20.5 9h-7.2M17.7 18.7 14 12.3M9.7 20.7l3.6-6.3M3.5 15h7.2M6.3 5.3 10 11.7" />
        }
        @case ('award') {
          <circle cx="12" cy="9" r="6" />
          <path d="m8.5 14 -1.5 7.5 5-3 5 3-1.5-7.5" />
        }
        @case ('wind') {
          <path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7" />
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6" />
        }
        @case ('layers') {
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 13 9 5 9-5" />
        }
        @case ('radar') {
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <path d="M12 12 18.5 5.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        }
        @case ('youtube') {
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
        }
        @case ('vimeo') {
          <path d="M3 8.5c1.5-1 2.5-2 3.5-2 1.5 0 1.7 2.3 2.2 4.7.5 2.3.9 3.8 1.6 3.8 1.2 0 3.9-4.2 3.9-5.8 0-1.4-1.3-1.7-2.7-.9 1-3.3 3.2-4.7 5.5-4.6 1.8.1 2.6 1.4 2.4 3.6-.3 3.8-5.4 10.7-8.4 10.7-2.5 0-3-6.3-4.5-8.9-.5-.8-1.2-.3-2.5.5L3 8.5Z" />
        }
        @case ('instagram') {
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
        }
        @case ('linkedin') {
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
}

/** Maps backend `icon_name` values to available icons with a safe fallback. */
export function toIconName(value: string | null | undefined): IconName {
  const known: readonly IconName[] = ['cinema', 'fpv', 'building', 'event', 'thermal', 'map'];
  return (known as readonly string[]).includes(value ?? '') ? (value as IconName) : 'drone';
}
