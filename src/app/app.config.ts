import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { StorageService } from './services/storage.service';
import { LocalStorageService } from './services/local-storage.service';
import { ThemeService } from './services/theme.service';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: StorageService,
      useClass: LocalStorageService,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (theme: ThemeService) => () => theme,
      deps: [ThemeService],
      multi: true,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
