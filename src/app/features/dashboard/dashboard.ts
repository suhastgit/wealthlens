import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SummaryCards } from './components/summary-cards/summary-cards';
import { NetWorthChart } from './components/net-worth-chart/net-worth-chart';
import { AssetBreakdownChart } from './components/asset-breakdown-chart/asset-breakdown-chart';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SummaryCards, NetWorthChart, AssetBreakdownChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
