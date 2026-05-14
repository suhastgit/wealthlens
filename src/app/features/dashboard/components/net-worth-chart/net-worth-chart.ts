import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { WealthService } from '../../../../services/wealth.service';
import { calcNetWorthTrend } from '../../../../utils';
import { formatDate } from '../../../../utils';
import { Card } from '../../../../components';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-net-worth-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseChartDirective, Card],
  templateUrl: './net-worth-chart.html',
})
export class NetWorthChart {
  private readonly wealth = inject(WealthService);

  readonly hasData = computed(() => this.wealth.snapshots().length > 0);

  readonly chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const trend = calcNetWorthTrend(this.wealth.snapshots());
    return {
      labels: trend.map((t) => formatDate(t.date)),
      datasets: [
        {
          label: 'Net Worth',
          data: trend.map((t) => t.netWorth),
          fill: true,
          tension: 0.4,
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          pointBackgroundColor: '#0ea5e9',
          pointRadius: 4,
        },
      ],
    };
  });

  readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            new Intl.NumberFormat('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
            }).format(ctx.parsed.y ?? 0),
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) =>
            new Intl.NumberFormat('en-AU', {
              style: 'currency',
              currency: 'AUD',
              notation: 'compact',
              minimumFractionDigits: 0,
            }).format(value as number),
        },
      },
    },
  };
}
