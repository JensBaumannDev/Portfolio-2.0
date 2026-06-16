import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';

interface Skill {
  name: string;
  icon: string;
  learning?: boolean;
}

@Component({
  selector: 'app-skills',
  imports: [TranslatePipe, NgOptimizedImage, Reveal, RevealStagger],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly flippedStates = signal<boolean[]>(Array(9).fill(false));

  protected toggleCard(index: number): void {
    this.flippedStates.update((states) => {
      const newStates = Array(9).fill(false);
      newStates[index] = !states[index];
      return newStates;
    });
  }

  skills: Skill[] = [
    { name: 'Angular', icon: 'angular' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'HTML5', icon: 'html5' },
    { name: 'CSS3', icon: 'css3' },
    { name: 'Supabase', icon: 'supabase' },
    { name: 'Git', icon: 'git' },
    { name: 'Python', icon: 'python', learning: true },
    { name: 'Django', icon: 'django', learning: true },
  ];
}
