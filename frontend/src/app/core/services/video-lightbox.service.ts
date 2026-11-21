import { Injectable, signal } from '@angular/core';

export interface LightboxVideo {
  readonly embedUrl: string;
  readonly title: string;
}

/** Global state for the single video lightbox rendered in the app shell. */
@Injectable({ providedIn: 'root' })
export class VideoLightboxService {
  private readonly _current = signal<LightboxVideo | null>(null);
  readonly current = this._current.asReadonly();

  open(video: LightboxVideo): void {
    if (video.embedUrl) {
      this._current.set(video);
    }
  }

  close(): void {
    this._current.set(null);
  }
}
