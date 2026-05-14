import { Asset, Liability, Snapshot } from '../types';

export function calcTotalAssets(assets: Asset[]): number {
  return assets.reduce((sum, a) => sum + a.value, 0);
}

export function calcTotalLiabilities(liabilities: Liability[]): number {
  return liabilities.reduce((sum, l) => sum + l.value, 0);
}

export function calcNetWorth(assets: Asset[], liabilities: Liability[]): number {
  return calcTotalAssets(assets) - calcTotalLiabilities(liabilities);
}

export function calcAssetsByCategory(assets: Asset[]): Record<string, number> {
  return assets.reduce(
    (acc, asset) => ({
      ...acc,
      [asset.category]: (acc[asset.category] ?? 0) + asset.value,
    }),
    {} as Record<string, number>,
  );
}

export function calcNetWorthTrend(snapshots: Snapshot[]): {
  date: string;
  netWorth: number;
}[] {
  return [...snapshots]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((s) => ({ date: s.date, netWorth: s.netWorth }));
}
