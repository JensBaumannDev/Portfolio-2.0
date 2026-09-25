import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Hero } from '../../components/hero/hero.component';
import { About } from '../../components/about/about.component';
import { Colleagues } from '../../components/colleagues/colleagues.component';
import { Projects } from '../../components/projects/projects.component';
import { Contact } from '../../components/contact/contact.component';
import { Skills } from '../../components/skills/skills.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-landingpage',
  imports: [Hero, About, Colleagues, Projects, Skills, Contact],
  templateUrl: './landingpage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landingpage {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.apply({
      titleKey: 'seo.home_title',
      descriptionKey: 'seo.home_desc',
      path: '/',
    });
  }
}
