export interface TechnologyIcon {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

const icon = (file: string, width = 24, height = 24): TechnologyIcon => ({
  src: `/img/skills/${file}.svg`,
  width,
  height,
});

export const TECHNOLOGY_ICONS: Readonly<Record<string, TechnologyIcon>> = {
  Angular: icon('angular'),
  TypeScript: icon('typescript'),
  JavaScript: icon('javascript'),
  HTML: icon('html'),
  CSS: icon('css'),
  SCSS: icon('css'),
  Supabase: icon('supabase'),
  Vite: icon('vite'),
  Python: icon('python'),
  Django: icon('django'),
  'Django REST': icon('django'),
  PostgreSQL: icon('postgresql'),
  SQLite: icon('sqlite'),
  Redis: icon('redis'),
  Docker: icon('docker'),
  FFmpeg: icon('ffmpeg'),
  Git: icon('git'),
  'VS Code': icon('vscode'),
  Figma: icon('figma', 16, 24),
  Linux: icon('linux'),
  Nginx: icon('nginx'),
};
