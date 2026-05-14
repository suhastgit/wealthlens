import Papa from 'papaparse';
import { Asset, Liability, Snapshot } from '../types';

// --- Export ---

export function exportAssetsCSV(assets: Asset[]): string {
  return Papa.unparse(
    assets.map((a) => ({
      id: a.id,
      name: a.name,
      category: a.category,
      value: a.value,
      notes: a.notes ?? '',
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    })),
  );
}

export function exportLiabilitiesCSV(liabilities: Liability[]): string {
  return Papa.unparse(
    liabilities.map((l) => ({
      id: l.id,
      name: l.name,
      category: l.category,
      value: l.value,
      notes: l.notes ?? '',
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    })),
  );
}

export function exportSnapshotsCSV(snapshots: Snapshot[]): string {
  return Papa.unparse(
    snapshots.map((s) => ({
      id: s.id,
      date: s.date,
      netWorth: s.netWorth,
      totalAssets: s.totalAssets,
      totalLiabilities: s.totalLiabilities,
    })),
  );
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// --- Import ---

export function parseAssetsCSV(file: File): Promise<Asset[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Asset>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

export function parseLiabilitiesCSV(file: File): Promise<Liability[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Liability>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}
