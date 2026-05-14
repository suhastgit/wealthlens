import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, DoughnutController } from 'chart.js';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { WealthService } from '../../../../services/wealth.service';
import { calcAssetsByCategory } from '../../../../utils';
import { Card } from '../../../../components';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-asset-breakdown-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseChartDirective, Card],
  templateUrl: './asset-breakdown-chart.html',
})
export class AssetBreakdownChart {
  private readonly wealth = inject(WealthService);

  readonly hasData = computed(() => this.wealth.assets().length > 0);

  readonly chartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const byCategory = calcAssetsByCategory(this.wealth.assets());
    const labels = Object.keys(byCategory);
    const data = Object.values(byCategory);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
          borderWidth: 2,
          borderColor: 'var(--color-surface)',
        },
      ],
    };
  });

  readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            new Intl.NumberFormat('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
            }).format(ctx.parsed),
        },
      },
    },
  };
}
