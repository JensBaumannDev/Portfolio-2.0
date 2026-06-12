import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, Renderer2 } from '@angular/core';
import { Hero } from '../../components/hero/hero.component';
import { About } from '../../components/about/about.component';
import { Skills } from '../../components/skills/skills.component';
import { Projects } from '../../components/projects/projects.component';
import { Contact } from '../../components/contact/contact.component';

@Component({
  selector: 'app-landingpage',
  imports: [Hero, About, Skills, Projects, Contact],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landingpage implements OnInit, OnDestroy {
  private readonly renderer = inject(Renderer2);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.renderer.removeClass(document.body, 'sync-animations');
      setTimeout(() => {
        this.renderer.addClass(document.body, 'sync-animations');
      }, 150);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      this.renderer.removeClass(document.body, 'sync-animations');
    }
  }
}
