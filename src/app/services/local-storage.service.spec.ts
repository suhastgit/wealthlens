import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { StorageService } from './storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: LocalStorageService }, LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sets and gets a string value', () => {
    service.set('test-key', 'hello');
    expect(service.get('test-key')).toBe('hello');
  });

  it('sets and gets an object', () => {
    const obj = { name: 'WealthLens', value: 42 };
    service.set('test-obj', obj);
    expect(service.get('test-obj')).toEqual(obj);
  });

  it('sets and gets an array', () => {
    const arr = [1, 2, 3];
    service.set('test-arr', arr);
    expect(service.get('test-arr')).toEqual(arr);
  });

  it('returns null for missing key', () => {
    expect(service.get('nonexistent')).toBeNull();
  });

  it('removes a key', () => {
    service.set('to-remove', 'value');
    service.remove('to-remove');
    expect(service.get('to-remove')).toBeNull();
  });

  it('clears all keys', () => {
    service.set('key1', 'value1');
    service.set('key2', 'value2');
    service.clear();
    expect(service.get('key1')).toBeNull();
    expect(service.get('key2')).toBeNull();
  });
});
