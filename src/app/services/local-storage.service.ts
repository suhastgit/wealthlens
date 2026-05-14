import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService extends StorageService {
  override get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      console.error(`WealthLens: failed to read key "${key}" from localStorage`);
      return null;
    }
  }

  override set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`WealthLens: failed to write key "${key}" to localStorage`);
    }
  }

  override remove(key: string): void {
    localStorage.removeItem(key);
  }

  override clear(): void {
    localStorage.clear();
  }
}
