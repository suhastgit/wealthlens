import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { WealthService } from '../../services/wealth.service';
import { ThemeService } from '../../services/theme.service';
import { APP_CONFIG } from '../../tokens';
import { formatDate } from '../../utils';
import {
  exportAssetsCSV,
  exportLiabilitiesCSV,
  exportSnapshotsCSV,
  downloadCSV,
  parseAssetsCSV,
  parseLiabilitiesCSV,
} from '../../utils';
import { Button, Card, Modal } from '../../components';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Modal, DecimalPipe],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly wealth = inject(WealthService);
  private readonly config = inject(APP_CONFIG);

  readonly theme = inject(ThemeService);
  readonly snapshots = this.wealth.snapshots;
  readonly isClearModalOpen = signal<boolean>(false);
  readonly importError = signal<string>('');
  readonly importSuccess = signal<string>('');
  readonly snapshotTaken = signal<boolean>(false);

  protected formatDate = formatDate;

  // --- Export ---

  protected exportAssets(): void {
    const csv = exportAssetsCSV(this.wealth.assets());
    downloadCSV(csv, `wealthlens-assets-${this.today()}.csv`);
  }

  protected exportLiabilities(): void {
    const csv = exportLiabilitiesCSV(this.wealth.liabilities());
    downloadCSV(csv, `wealthlens-liabilities-${this.today()}.csv`);
  }

  protected exportSnapshots(): void {
    const csv = exportSnapshotsCSV(this.wealth.snapshots());
    downloadCSV(csv, `wealthlens-snapshots-${this.today()}.csv`);
  }

  // --- Import ---

  protected async onImportAssets(event: Event): Promise<void> {
    const file = this.getFile(event);
    if (!file) return;
    try {
      const assets = await parseAssetsCSV(file);
      assets.forEach((a) => this.wealth.addAsset(a));
      this.importSuccess.set(`${assets.length} assets imported successfully.`);
      this.importError.set('');
    } catch {
      this.importError.set('Failed to import assets. Please check the CSV format.');
      this.importSuccess.set('');
    }
  }

  protected async onImportLiabilities(event: Event): Promise<void> {
    const file = this.getFile(event);
    if (!file) return;
    try {
      const liabilities = await parseLiabilitiesCSV(file);
      liabilities.forEach((l) => this.wealth.addLiability(l));
      this.importSuccess.set(`${liabilities.length} liabilities imported successfully.`);
      this.importError.set('');
    } catch {
      this.importError.set('Failed to import liabilities. Please check the CSV format.');
      this.importSuccess.set('');
    }
  }

  // --- Snapshot ---

  protected takeSnapshot(): void {
    this.wealth.takeSnapshot();
    this.snapshotTaken.set(true);
    setTimeout(() => this.snapshotTaken.set(false), 3000);
  }

  // --- Clear ---

  protected confirmClear(): void {
    this.wealth.clearAll();
    this.isClearModalOpen.set(false);
  }

  // --- Helpers ---

  private getFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    return input.files?.[0] ?? null;
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }
}
