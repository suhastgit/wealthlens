import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Asset } from '../../types';
import { WealthService } from '../../services/wealth.service';
import { APP_CONFIG } from '../../tokens';
import { formatAUD } from '../../utils';
import { Button, Card, Modal } from '../../components';
import { AssetForm } from './components/asset-form/asset-form';
import { AssetItem } from './components/asset-item/asset-item';

@Component({
  selector: 'app-assets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Modal, AssetForm, AssetItem],
  templateUrl: './assets.html',
  styleUrl: './assets.css',
})
export class Assets {
  private readonly wealth = inject(WealthService);
  private readonly config = inject(APP_CONFIG);

  readonly assets = this.wealth.assets;
  readonly totalAssets = computed(() => formatAUD(this.wealth.totalAssets(), this.config));

  readonly isModalOpen = signal<boolean>(false);
  readonly editingAsset = signal<Asset | null>(null);

  protected openAddModal(): void {
    this.editingAsset.set(null);
    this.isModalOpen.set(true);
  }

  protected openEditModal(asset: Asset): void {
    this.editingAsset.set(asset);
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
    this.editingAsset.set(null);
  }

  protected onSaved(data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): void {
    const now = new Date().toISOString();
    const existing = this.editingAsset();

    if (existing) {
      this.wealth.updateAsset({
        ...existing,
        ...data,
        updatedAt: now,
      });
    } else {
      this.wealth.addAsset({
        id: crypto.randomUUID(),
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    }
    this.closeModal();
  }

  protected onDeleted(id: string): void {
    this.wealth.removeAsset(id);
  }
}
