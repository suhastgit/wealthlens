import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Liability } from '../../types';
import { WealthService } from '../../services/wealth.service';
import { APP_CONFIG } from '../../tokens';
import { formatAUD } from '../../utils';
import { Button, Card, Modal } from '../../components';
import { LiabilityForm } from './components/liability-form/liability-form';
import { LiabilityItem } from './components/liability-item/liability-item';

@Component({
  selector: 'app-liabilities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Modal, LiabilityForm, LiabilityItem],
  templateUrl: './liabilities.html',
  styleUrl: './liabilities.css',
})
export class Liabilities {
  private readonly wealth = inject(WealthService);
  private readonly config = inject(APP_CONFIG);

  readonly liabilities = this.wealth.liabilities;
  readonly totalLiabilities = computed(() =>
    formatAUD(this.wealth.totalLiabilities(), this.config),
  );

  readonly isModalOpen = signal<boolean>(false);
  readonly editingLiability = signal<Liability | null>(null);

  protected openAddModal(): void {
    this.editingLiability.set(null);
    this.isModalOpen.set(true);
  }

  protected openEditModal(liability: Liability): void {
    this.editingLiability.set(liability);
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
    this.editingLiability.set(null);
  }

  protected onSaved(data: Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>): void {
    const now = new Date().toISOString();
    const existing = this.editingLiability();

    if (existing) {
      this.wealth.updateLiability({
        ...existing,
        ...data,
        updatedAt: now,
      });
    } else {
      this.wealth.addLiability({
        id: crypto.randomUUID(),
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    }
    this.closeModal();
  }

  protected onDeleted(id: string): void {
    this.wealth.removeLiability(id);
  }
}
