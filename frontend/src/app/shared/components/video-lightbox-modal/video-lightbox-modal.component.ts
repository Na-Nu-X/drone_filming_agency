import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { VideoLightboxService } from '../../../core/services/video-lightbox.service';
import { IconComponent } from '../icon/icon.component';
import { toSafeEmbedUrl } from './video-embed';

/**
 * Accessible video modal built on the native `<dialog>` element, which
 * provides focus trapping, `Esc` to close and focus restoration out of the box.
 */
@Component({
  selector: 'app-video-lightbox-modal',
  imports: [IconComponent],
  templateUrl: './video-lightbox-modal.component.html',
  styleUrl: './video-lightbox-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoLightboxModalComponent {
  protected readonly lightbox = inject(VideoLightboxService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly safeUrl = computed<SafeResourceUrl | null>(() => {
    const url = toSafeEmbedUrl(this.lightbox.current()?.embedUrl, { autoplay: true });
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  constructor() {
    effect(() => {
      const dialog = this.dialogRef().nativeElement;
      const isOpen = this.lightbox.current() !== null;
      if (isOpen && !dialog.open) {
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
      this.document.body.classList.toggle('lightbox-open', isOpen);
    });
  }

  protected close(): void {
    this.lightbox.close();
  }

  /** Close when clicking the backdrop (the dialog element itself, outside the frame). */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialogRef().nativeElement) {
      this.close();
    }
  }
}
