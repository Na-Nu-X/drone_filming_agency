const ALLOWED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
]);

/**
 * Validates that a URL is an HTTPS YouTube/Vimeo embed and returns a
 * normalised URL with the requested player params, or `null` if the URL is
 * not trusted. Only URLs returned from here may be passed to
 * `DomSanitizer.bypassSecurityTrustResourceUrl`.
 */
export function toSafeEmbedUrl(raw: string | null | undefined, options: { autoplay?: boolean } = {}): string | null {
  if (!raw) {
    return null;
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname)) {
    return null;
  }
  const isYoutube = url.hostname.includes('youtube');
  if (isYoutube && !url.pathname.startsWith('/embed/')) {
    return null;
  }
  if (!isYoutube && !url.pathname.startsWith('/video/')) {
    return null;
  }
  if (options.autoplay) {
    url.searchParams.set('autoplay', '1');
  }
  if (isYoutube) {
    url.searchParams.set('rel', '0');
    url.searchParams.set('modestbranding', '1');
  } else {
    url.searchParams.set('dnt', '1');
  }
  return url.toString();
}
