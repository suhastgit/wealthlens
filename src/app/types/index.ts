export type AssetCategory =
  | 'property'
  | 'savings'
  | 'superannuation'
  | 'vehicle'
  | 'investment'
  | 'other';

export type LiabilityCategory =
  | 'mortgage'
  | 'personal-loan'
  | 'car-loan'
  | 'credit-card'
  | 'hecs'
  | 'other';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Liability {
  id: string;
  name: string;
  category: LiabilityCategory;
  value: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Snapshot {
  id: string;
  date: string;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface StorageKeys {
  ASSETS: string;
  LIABILITIES: string;
  SNAPSHOTS: string;
}

export interface AppConfig {
  locale: string;
  currency: string;
}
