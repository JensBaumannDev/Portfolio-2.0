import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { LanguageService } from './services/language.service';
import { MotionService } from './services/motion.service';

const routePath = (route: ActivatedRouteSnapshot): string =>
  [route.url.join('/'), ...route.children.map(routePath)].filter(Boolean).join('/');

const isProject = (path: string): boolean => path.startsWith('projects/');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition, from, to }) => {
          const fromPath = routePath(from);
          const toPath = routePath(to);
          if (
            inject(MotionService).reduced() ||
            fromPath === toPath ||
            (isProject(fromPath) && isProject(toPath))
          ) {
            transition.skipTransition();
          }
        },
      }),
    ),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'de',
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
    }),
    provideAppInitializer(() => inject(LanguageService).initialize()),
  ],
};
