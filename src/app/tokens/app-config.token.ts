import { InjectionToken } from '@angular/core';
import { AppConfig } from '../types';

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    locale: 'en-AU',
    currency: 'AUD',
  }),
});
