import { effect, inject, Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '../tokens';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly keys = inject(STORAGE_KEYS);
  private readonly storageKey = 'wealthlens:theme';

  readonly theme = signal<Theme>(this.storage.get<Theme>(this.storageKey) ?? 'system');

  readonly isDark = signal<boolean>(this.resolveIsDark(this.theme()));

  constructor() {
    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.isDark.set(mediaQuery.matches);
        this.applyTheme(mediaQuery.matches);
      }
    });

    // Apply theme whenever it changes
    effect(() => {
      const resolved = this.resolveIsDark(this.theme());
      this.isDark.set(resolved);
      this.applyTheme(resolved);
      this.storage.set(this.storageKey, this.theme());
    });

    // Apply on init
    this.applyTheme(this.isDark());
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  toggleDark(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private resolveIsDark(theme: Theme): boolean {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
