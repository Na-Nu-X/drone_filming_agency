import { DestroyRef, Signal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export type LoadStatus = 'loading' | 'success' | 'error';

export interface RemoteData<T> {
  readonly data: Signal<T | null>;
  readonly status: Signal<LoadStatus>;
  /** Re-run the request (e.g. from a "Skúsiť znova" button). */
  reload(): void;
}

/**
 * Tiny signal-based wrapper around an HTTP observable that exposes
 * `data` and `status` signals and cleans up with the calling component.
 * Must be called in an injection context.
 */
export function remoteData<T>(factory: () => Observable<T>): RemoteData<T> {
  const destroyRef = inject(DestroyRef);
  const data = signal<T | null>(null);
  const status = signal<LoadStatus>('loading');

  const load = (): void => {
    status.set('loading');
    factory()
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (value) => {
          data.set(value);
          status.set('success');
        },
        error: () => status.set('error'),
      });
  };

  load();
  return { data: data.asReadonly(), status: status.asReadonly(), reload: load };
}
