import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { WealthService } from './wealth.service';
import { StorageService } from './storage.service';
import { LocalStorageService } from './local-storage.service';
import { Asset, Liability } from '../types';

const mockAsset: Asset = {
  id: '1',
  name: 'Family Home',
  category: 'property',
  value: 850000,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockLiability: Liability = {
  id: '1',
  name: 'Home Mortgage',
  category: 'mortgage',
  value: 600000,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('WealthService', () => {
  let service: WealthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: LocalStorageService }, WealthService],
    });
    service = TestBed.inject(WealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assets', () => {
    it('starts with empty assets', () => {
      expect(service.assets()).toEqual([]);
    });

    it('adds an asset', () => {
      service.addAsset(mockAsset);
      expect(service.assets()).toHaveLength(1);
      expect(service.assets()[0].name).toBe('Family Home');
    });

    it('updates an asset', () => {
      service.addAsset(mockAsset);
      service.updateAsset({ ...mockAsset, value: 900000 });
      expect(service.assets()[0].value).toBe(900000);
    });

    it('removes an asset', () => {
      service.addAsset(mockAsset);
      service.removeAsset('1');
      expect(service.assets()).toHaveLength(0);
    });
  });

  describe('liabilities', () => {
    it('starts with empty liabilities', () => {
      expect(service.liabilities()).toEqual([]);
    });

    it('adds a liability', () => {
      service.addLiability(mockLiability);
      expect(service.liabilities()).toHaveLength(1);
      expect(service.liabilities()[0].name).toBe('Home Mortgage');
    });

    it('updates a liability', () => {
      service.addLiability(mockLiability);
      service.updateLiability({ ...mockLiability, value: 550000 });
      expect(service.liabilities()[0].value).toBe(550000);
    });

    it('removes a liability', () => {
      service.addLiability(mockLiability);
      service.removeLiability('1');
      expect(service.liabilities()).toHaveLength(0);
    });
  });

  describe('computed signals', () => {
    it('calculates totalAssets correctly', () => {
      service.addAsset(mockAsset);
      service.addAsset({ ...mockAsset, id: '2', value: 50000 });
      expect(service.totalAssets()).toBe(900000);
    });

    it('calculates totalLiabilities correctly', () => {
      service.addLiability(mockLiability);
      service.addLiability({ ...mockLiability, id: '2', value: 15000 });
      expect(service.totalLiabilities()).toBe(615000);
    });

    it('calculates netWorth correctly', () => {
      service.addAsset(mockAsset);
      service.addLiability(mockLiability);
      expect(service.netWorth()).toBe(250000);
    });

    it('netWorth is 0 with no data', () => {
      expect(service.netWorth()).toBe(0);
    });
  });

  describe('snapshots', () => {
    it('takes a snapshot with current values', () => {
      service.addAsset(mockAsset);
      service.addLiability(mockLiability);
      service.takeSnapshot();
      expect(service.snapshots()).toHaveLength(1);
      expect(service.snapshots()[0].netWorth).toBe(250000);
      expect(service.snapshots()[0].totalAssets).toBe(850000);
      expect(service.snapshots()[0].totalLiabilities).toBe(600000);
    });
  });

  describe('clearAll', () => {
    it('clears all data', () => {
      service.addAsset(mockAsset);
      service.addLiability(mockLiability);
      service.takeSnapshot();
      service.clearAll();
      expect(service.assets()).toHaveLength(0);
      expect(service.liabilities()).toHaveLength(0);
      expect(service.snapshots()).toHaveLength(0);
    });
  });
});
