import { Component } from '@angular/core';
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
})
export class Landingpage {}
