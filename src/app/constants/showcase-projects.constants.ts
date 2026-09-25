export type ShowcaseProjectCategory = 'frontend' | 'backend';

export interface ShowcaseProject {
  readonly slug: string;
  readonly name: string;
  readonly category: ShowcaseProjectCategory;
  readonly image: string;
  readonly technologies: readonly string[];
  readonly features: readonly string[];
  readonly github?: string;
  readonly demo?: string;
}

export const TECHNOLOGY_ICONS: Readonly<Record<string, string>> = {
  Angular: '/img/skills/angular.svg',
  TypeScript: '/img/skills/typescript.svg',
  SCSS: '/img/skills/css.svg',
  Supabase: '/img/skills/supabase.svg',
  HTML: '/img/skills/html.svg',
  CSS: '/img/skills/css.svg',
  JavaScript: '/img/skills/javascript.svg',
  PokeAPI: '/img/skills/javascript.svg',
  Python: '/img/skills/python.svg',
  Django: '/img/skills/django.svg',
  'Django REST Framework': '/img/skills/django.svg',
  SQLite: '/img/skills/sqlite.svg',
};

export const SHOWCASE_PROJECTS: readonly ShowcaseProject[] = [
  {
    slug: 'coderr', name: 'Coderr', category: 'backend', image: '/img/projects/webp/coderr_project-normal.webp',
    technologies: ['Python', 'Django', 'Django REST Framework', 'SQLite'], features: ['authentication', 'crud', 'database'],
    github: 'https://github.com/JensBaumannDev/Coderr_Backend', demo: 'https://coderr.jensbaumann.com',
  },
  {
    slug: 'kanmind', name: 'KanMind', category: 'backend', image: '/img/projects/webp/kanmind_project-normal.webp',
    technologies: ['Python', 'Django', 'Django REST Framework', 'SQLite'], features: ['authentication', 'crud', 'database'],
    github: 'https://github.com/JensBaumannDev/KanMind', demo: 'https://kanmind.jensbaumann.com',
  },
  {
    slug: 'dabubble', name: 'DABubble', category: 'frontend', image: '/img/projects/webp/dabubble_project.webp',
    technologies: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    features: ['authentication', 'updates', 'responsive'],
    github: 'https://github.com/JensBaumannDev/DABubble', demo: 'https://dabubble.jensbaumann.com',
  },
  {
    slug: 'join', name: 'JOIN', category: 'frontend', image: '/img/projects/webp/join_project.webp',
    technologies: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    features: ['authentication', 'updates', 'drag_drop', 'responsive'],
    github: 'https://github.com/JensBaumannDev/Join', demo: 'https://join.jensbaumann.com',
  },
  {
    slug: 'el-pollo-loco', name: 'El Pollo Loco', category: 'frontend', image: '/img/projects/webp/el_pollo_loco_project.webp',
    technologies: ['HTML', 'CSS', 'JavaScript'], features: ['oop', 'game_loop', 'collision'],
    github: 'https://github.com/JensBaumannDev/El-Pollo-Loco', demo: 'https://el-pollo-loco.jensbaumann.com',
  },
  {
    slug: 'pokedex', name: 'Pokedex', category: 'frontend', image: '/img/projects/webp/pokedex_project.webp',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PokeAPI'], features: ['api', 'search', 'responsive'],
    github: 'https://github.com/JensBaumannDev/Pokedex', demo: 'https://pokedex.jensbaumann.com',
  },
];
