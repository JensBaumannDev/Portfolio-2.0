export type ProjectCategory = 'frontend' | 'backend';

export interface Project {
  key: string;
  category: ProjectCategory;
  featured: boolean;
  tags: string[];
  image: string;
  hasDuration?: boolean;
  github: string;
  live?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    key: 'coderr',
    image: './img/projects/webp/coderr_project-normal.webp',
    category: 'backend',
    featured: false,
    hasDuration: false,
    tags: ['Python', 'Django', 'Django REST Framework', 'SQLite'],
    github: 'https://github.com/JensBaumannDev/Coderr_Backend',
    live: 'https://coderr.jensbaumann.com',
  },
  {
    key: 'kanmind',
    image: './img/projects/webp/kanmind_project-normal.webp',
    category: 'backend',
    featured: false,
    hasDuration: false,
    tags: ['Python', 'Django', 'Django REST Framework', 'SQLite'],
    github: 'https://github.com/JensBaumannDev/KanMind',
  },
  {
    key: 'dabubble',
    category: 'frontend',
    featured: true,
    tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    image: './img/projects/webp/dabubble_project.webp',
    github: 'https://github.com/JensBaumannDev/DABubble',
    live: 'https://dabubble.jensbaumann.com',
  },
  {
    key: 'join',
    category: 'frontend',
    featured: true,
    tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    image: './img/projects/webp/join_project.webp',
    github: 'https://github.com/JensBaumannDev/Join',
    live: 'https://join.jensbaumann.com',
  },
  {
    key: 'el_pollo_loco',
    category: 'frontend',
    featured: true,
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: './img/projects/webp/el_pollo_loco_project.webp',
    github: 'https://github.com/JensBaumannDev/El-Pollo-Loco',
    live: 'https://el-pollo-loco.jensbaumann.com',
  },
  {
    key: 'pokedex',
    category: 'frontend',
    featured: false,
    tags: ['HTML', 'CSS', 'JavaScript', 'API'],
    image: './img/projects/webp/pokedex_project.webp',
    github: 'https://github.com/JensBaumannDev/Pokedex',
    live: 'https://pokedex.jensbaumann.com',
  },
];
