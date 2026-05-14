import { inject, Injectable, signal, computed } from '@angular/core';
import { Asset, Liability, Snapshot } from '../types';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../tokens';

@Injectable({ providedIn: 'root' })
export class WealthService {
  private readonly storage = inject(StorageService);
  private readonly keys = inject(STORAGE_KEYS);

  // --- State signals ---
  readonly assets = signal<Asset[]>(this.storage.get<Asset[]>(this.keys.ASSETS) ?? []);

  readonly liabilities = signal<Liability[]>(
    this.storage.get<Liability[]>(this.keys.LIABILITIES) ?? [],
  );

  readonly snapshots = signal<Snapshot[]>(this.storage.get<Snapshot[]>(this.keys.SNAPSHOTS) ?? []);

  // --- Derived computed signals ---
  readonly totalAssets = computed(() => this.assets().reduce((sum, a) => sum + a.value, 0));

  readonly totalLiabilities = computed(() =>
    this.liabilities().reduce((sum, l) => sum + l.value, 0),
  );

  readonly netWorth = computed(() => this.totalAssets() - this.totalLiabilities());

  // --- Asset mutations ---
  addAsset(asset: Asset): void {
    this.assets.update((current) => {
      const updated = [...current, asset];
      this.storage.set(this.keys.ASSETS, updated);
      return updated;
    });
  }

  updateAsset(asset: Asset): void {
    this.assets.update((current) => {
      const updated = current.map((a) => (a.id === asset.id ? asset : a));
      this.storage.set(this.keys.ASSETS, updated);
      return updated;
    });
  }

  removeAsset(id: string): void {
    this.assets.update((current) => {
      const updated = current.filter((a) => a.id !== id);
      this.storage.set(this.keys.ASSETS, updated);
      return updated;
    });
  }

  // --- Liability mutations ---
  addLiability(liability: Liability): void {
    this.liabilities.update((current) => {
      const updated = [...current, liability];
      this.storage.set(this.keys.LIABILITIES, updated);
      return updated;
    });
  }

  updateLiability(liability: Liability): void {
    this.liabilities.update((current) => {
      const updated = current.map((l) => (l.id === liability.id ? liability : l));
      this.storage.set(this.keys.LIABILITIES, updated);
      return updated;
    });
  }

  removeLiability(id: string): void {
    this.liabilities.update((current) => {
      const updated = current.filter((l) => l.id !== id);
      this.storage.set(this.keys.LIABILITIES, updated);
      return updated;
    });
  }

  // --- Snapshots ---
  takeSnapshot(): void {
    const snapshot: Snapshot = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      netWorth: this.netWorth(),
      totalAssets: this.totalAssets(),
      totalLiabilities: this.totalLiabilities(),
    };
    this.snapshots.update((current) => {
      const updated = [...current, snapshot];
      this.storage.set(this.keys.SNAPSHOTS, updated);
      return updated;
    });
  }

  // --- Clear all ---
  clearAll(): void {
    this.assets.set([]);
    this.liabilities.set([]);
    this.snapshots.set([]);
    this.storage.clear();
  }
}
