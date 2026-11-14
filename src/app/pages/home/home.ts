import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { ProjectRail } from '../../components/project-rail/project-rail';
import { IntroCards } from '../../components/intro-cards/intro-cards';
import { Story } from '../../components/story/story';
import { Skills } from '../../components/skills/skills';
import { Testimonials } from '../../components/testimonials/testimonials';
import { ContactCta } from '../../components/contact-cta/contact-cta';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [Hero, ProjectRail, IntroCards, Story, Skills, Testimonials, ContactCta],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  constructor() {
    inject(SeoService).apply({
      titleKey: 'seo.home_title',
      descriptionKey: 'seo.home_desc',
      path: '/',
    });
  }
}
