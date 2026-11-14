export type ShowcaseProjectCategory = 'frontend' | 'backend';

export type ShowcaseProjectFact = 'role' | 'team' | 'duration';

export interface ShowcaseProject {
  readonly slug: string;
  readonly name: string;
  readonly category: ShowcaseProjectCategory;
  readonly railImage: string;
  readonly browserImage: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly frameInset?: string;
  readonly facts: readonly ShowcaseProjectFact[];
  readonly technologies: readonly string[];
  readonly features: readonly string[];
  readonly github: string;
  readonly demo: string;
}

export const SHOWCASE_PROJECTS: readonly ShowcaseProject[] = [
  {
    slug: 'videoflix',
    name: 'Videoflix',
    category: 'backend',
    railImage: '/img/projects/rail/videoflix.webp',
    browserImage: '/img/projects/browser/videoflix.webp',
    imageWidth: 1440,
    imageHeight: 900,
    frameInset: '0 0 3.75%',
    facts: ['role'],
    technologies: ['Python', 'Django REST', 'PostgreSQL', 'Redis', 'FFmpeg', 'Docker'],
    features: ['authentication', 'streaming', 'background_jobs', 'docker'],
    github: 'https://github.com/JensBaumannDev/Videoflix',
    demo: 'https://videoflix.jensbaumann.com',
  },
  {
    slug: 'dabubble',
    name: 'DABubble',
    category: 'frontend',
    railImage: '/img/projects/rail/dabubble.webp',
    browserImage: '/img/projects/browser/dabubble.webp',
    imageWidth: 1540,
    imageHeight: 1000,
    frameInset: '4% 3.246753% 6%',
    facts: ['role', 'team', 'duration'],
    technologies: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    features: ['authentication', 'updates', 'responsive'],
    github: 'https://github.com/JensBaumannDev/DABubble',
    demo: 'https://dabubble.jensbaumann.com',
  },
  {
    slug: 'join',
    name: 'Join',
    category: 'frontend',
    railImage: '/img/projects/rail/join.webp',
    browserImage: '/img/projects/browser/join.webp',
    imageWidth: 1540,
    imageHeight: 1000,
    frameInset: '4% 3.246753% 6%',
    facts: ['role', 'team', 'duration'],
    technologies: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    features: ['authentication', 'updates', 'drag_drop', 'responsive'],
    github: 'https://github.com/JensBaumannDev/Join',
    demo: 'https://join.jensbaumann.com',
  },
  {
    slug: 'coderr',
    name: 'Coderr',
    category: 'backend',
    railImage: '/img/projects/rail/coderr.webp',
    browserImage: '/img/projects/browser/coderr.webp',
    imageWidth: 1540,
    imageHeight: 1000,
    frameInset: '4% 3.246753% 6%',
    facts: ['role'],
    technologies: ['Python', 'Django REST', 'SQLite'],
    features: ['authentication', 'crud', 'database'],
    github: 'https://github.com/JensBaumannDev/Coderr_Backend',
    demo: 'https://coderr.jensbaumann.com',
  },
  {
    slug: 'kanmind',
    name: 'KanMind',
    category: 'backend',
    railImage: '/img/projects/rail/kanmind.webp',
    browserImage: '/img/projects/browser/kanmind.webp',
    imageWidth: 1540,
    imageHeight: 1000,
    frameInset: '4% 3.246753% 6%',
    facts: ['role'],
    technologies: ['Python', 'Django REST', 'SQLite'],
    features: ['authentication', 'crud', 'database'],
    github: 'https://github.com/JensBaumannDev/KanMind',
    demo: 'https://kanmind.jensbaumann.com',
  },
  {
    slug: 'el-pollo-loco',
    name: 'El Pollo Loco',
    category: 'frontend',
    railImage: '/img/projects/rail/el-pollo-loco.webp',
    browserImage: '/img/projects/browser/el-pollo-loco.webp',
    imageWidth: 1540,
    imageHeight: 1000,
    frameInset: '4% 3.246753% 6%',
    facts: ['role', 'duration'],
    technologies: ['JavaScript', 'HTML', 'CSS'],
    features: ['oop', 'game_loop', 'collision'],
    github: 'https://github.com/JensBaumannDev/El-Pollo-Loco',
    demo: 'https://el-pollo-loco.jensbaumann.com',
  },
  {
    slug: 'pokedex',
    name: 'Pokédex',
    category: 'frontend',
    railImage: '/img/projects/rail/pokedex.webp',
    browserImage: '/img/projects/browser/pokedex.webp',
    imageWidth: 1540,
    imageHeight: 1000,
    frameInset: '4% 3.246753% 6%',
    facts: ['role', 'duration'],
    technologies: ['JavaScript', 'Vite', 'HTML', 'CSS'],
    features: ['api', 'search', 'localization', 'responsive'],
    github: 'https://github.com/JensBaumannDev/Pokedex',
    demo: 'https://pokedex.jensbaumann.com',
  },
];
