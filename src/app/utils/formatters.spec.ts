import { describe, it, expect } from 'vitest';
import { formatAUD, formatDate, formatPercent } from './formatters';
import { AppConfig } from '../types';

const config: AppConfig = { locale: 'en-AU', currency: 'AUD' };

describe('formatAUD', () => {
  it('formats positive value as AUD currency', () => {
    const result = formatAUD(1000000, config);
    expect(result).toContain('1,000,000');
    expect(result).toContain('$');
  });

  it('formats zero correctly', () => {
    const result = formatAUD(0, config);
    expect(result).toContain('0');
    expect(result).toContain('$');
  });

  it('formats negative value correctly', () => {
    const result = formatAUD(-50000, config);
    expect(result).toContain('50,000');
  });
});

describe('formatDate', () => {
  it('formats ISO date string to readable date', () => {
    const result = formatDate('2024-01-15T00:00:00.000Z');
    expect(result).toContain('2024');
    expect(result).toContain('Jan');
  });
});

describe('formatPercent', () => {
  it('formats percentage correctly', () => {
    const result = formatPercent(250000, 1000000);
    expect(result).toContain('25');
    expect(result).toContain('%');
  });

  it('returns 0% when total is 0', () => {
    expect(formatPercent(0, 0)).toBe('0%');
  });

  it('handles 100%', () => {
    const result = formatPercent(1000000, 1000000);
    expect(result).toContain('100');
  });
});
