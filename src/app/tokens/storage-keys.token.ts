import { InjectionToken } from '@angular/core';
import { StorageKeys } from '../types';

export const STORAGE_KEYS = new InjectionToken<StorageKeys>('STORAGE_KEYS', {
  providedIn: 'root',
  factory: () => ({
    ASSETS: 'wealthlens:assets',
    LIABILITIES: 'wealthlens:liabilities',
    SNAPSHOTS: 'wealthlens:snapshots',
  }),
});
