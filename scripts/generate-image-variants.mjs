import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SOURCES = [
  { dir: 'public/img/projects/webp', widths: [480, 768, 1024, 1440] },
  { dir: 'public/img/hero', only: ['profile.webp'], widths: [640] },
];

const VARIANT = /-\d+\.webp$/;

async function build({ dir, widths, only }) {
  if (!existsSync(dir)) return [];

  const files = (await readdir(dir)).filter(
    (file) => file.endsWith('.webp') && !VARIANT.test(file) && (!only || only.includes(file))
  );

  const written = [];

  for (const file of files) {
    const source = join(dir, file);
    const { name } = parse(file);
    const { width: sourceWidth } = await sharp(source).metadata();

    for (const width of widths) {
      if (width >= sourceWidth) continue;

      const target = join(dir, `${name}-${width}.webp`);

      if (existsSync(target)) {
        const [a, b] = await Promise.all([stat(source), stat(target)]);
        if (b.mtimeMs >= a.mtimeMs) continue;
      }

      await sharp(source).resize({ width }).webp({ quality: 78 }).toFile(target);
      const { size } = await stat(target);
      written.push(`${name}-${width}.webp  ${(size / 1024).toFixed(1)} KiB`);
    }
  }

  return written;
}

const results = (await Promise.all(SOURCES.map(build))).flat();

console.log(
  results.length ? `image variants written:\n  ${results.join('\n  ')}` : 'image variants up to date'
);
