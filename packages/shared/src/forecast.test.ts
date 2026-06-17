import { describe, it, expect } from 'vitest';
import { buildForecastSeries } from './forecast';

describe('buildForecastSeries', () => {
  it('should build a forecast series when history is empty', () => {
    const result = buildForecastSeries([]);
    expect(result).toHaveLength(12);
    expect(result[0].month).toBe('Jan');
    expect(result[0].emissions).toBe(1200);
    expect(result[0].projected).toBe(1182); // 1200 - 18
  });

  it('should build a forecast series with a single history element', () => {
    const result = buildForecastSeries([1500]);
    expect(result).toHaveLength(12);
    expect(result[0].emissions).toBe(1500);
    expect(result[0].projected).toBe(1482); // 1500 - 18
  });

  it('should build a forecast series with multiple history elements', () => {
    const result = buildForecastSeries([1000, 1100, 1200]);
    expect(result).toHaveLength(12);
    expect(result[0].emissions).toBe(1000);
    expect(result[1].emissions).toBe(1100);
    expect(result[2].emissions).toBe(1200);
    expect(result[3].emissions).toBe(1200); // fallback to baseline

    // trend = (1200 - 1000) / (3 - 1) = 200 / 2 = 100
    // baseline = 1200
    // month 0 projected = Math.round(1200 + 100 * 1) = 1300
    expect(result[0].projected).toBe(1300);
    expect(result[11].projected).toBe(2400); // 1200 + 100 * 12
  });

  it('should handle zero floor for projections', () => {
    // trend = (500 - 1000) / 1 = -500
    // baseline = 500
    const result = buildForecastSeries([1000, 500]);
    expect(result[1].projected).toBe(0); // 500 - 500 * 2 = -500 -> capped at 0
  });
});
