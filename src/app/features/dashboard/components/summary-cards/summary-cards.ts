import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { WealthService } from '../../../../services/wealth.service';
import { APP_CONFIG } from '../../../../tokens';
import { formatAUD } from '../../../../utils';
import { Card } from '../../../../components';

@Component({
  selector: 'app-summary-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card],
  templateUrl: './summary-cards.html',
})
export class SummaryCards {
  private readonly wealth = inject(WealthService);
  private readonly config = inject(APP_CONFIG);

  readonly netWorth = computed(() => formatAUD(this.wealth.netWorth(), this.config));

  readonly totalAssets = computed(() => formatAUD(this.wealth.totalAssets(), this.config));

  readonly totalLiabilities = computed(() =>
    formatAUD(this.wealth.totalLiabilities(), this.config),
  );

  readonly isPositive = computed(() => this.wealth.netWorth() >= 0);
}
