import { ImageLoaderConfig } from '@angular/common';

const VARIANT_WIDTHS: Record<string, number[]> = {
  '/img/projects/webp/': [480, 768, 1024, 1440],
  '/img/hero/profile.webp': [640],
};

export const IMAGE_BREAKPOINTS = [480, 768, 1024, 1440];

export function portfolioImageLoader({ src, width }: ImageLoaderConfig): string {
  if (!width) return src;

  const key = Object.keys(VARIANT_WIDTHS).find((prefix) => src.startsWith(prefix));
  if (!key) return src;

  const match = VARIANT_WIDTHS[key].find((candidate) => candidate >= width);
  if (!match) return src;

  return src.replace(/\.webp$/, `-${match}.webp`);
}
