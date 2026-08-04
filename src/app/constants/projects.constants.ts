export interface Project {
  key: string;
  featured: boolean;
  tags: string[];
  image: string;
  github: string;
  live: string;
}

export const PROJECTS: readonly Project[] = [
  {
    key: 'dabubble',
    featured: true,
    tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    image: './img/projects/webp/dabubble_project.webp',
    github: 'https://github.com/JensBaumannDev/DABubble',
    live: 'https://jensbaumann.com/projects/dabubble',
  },
  {
    key: 'join',
    featured: true,
    tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
    image: './img/projects/webp/join_project.webp',
    github: 'https://github.com/JensBaumannDev/Join',
    live: 'https://jensbaumann.com/projects/join/',
  },
  {
    key: 'el_pollo_loco',
    featured: true,
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: './img/projects/webp/el_pollo_loco_project.webp',
    github: 'https://github.com/JensBaumannDev/El-Pollo-Loco',
    live: 'https://jensbaumann.com/projects/el_pollo_loco/',
  },
  {
    key: 'pokedex',
    featured: false,
    tags: ['HTML', 'CSS', 'JavaScript', 'API'],
    image: './img/projects/webp/pokedex_project.webp',
    github: 'https://github.com/JensBaumannDev/Pokedex',
    live: 'https://jensbaumann.com/projects/pokedex/',
  },
];
