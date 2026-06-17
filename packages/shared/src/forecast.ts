import type { ForecastPoint } from './types';

export function buildForecastSeries(history: number[]): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const baseline = history.length ? history[history.length - 1] : 1200;
  const trend = history.length > 1 ? (history[history.length - 1] - history[0]) / (history.length - 1) : -18;

  for (let month = 0; month < 12; month += 1) {
    const monthLabel = new Date(2026, month, 1).toLocaleString('en', { month: 'short' });
    const emissions = Math.round((history[month] ?? baseline) ?? baseline);
    const projected = Math.max(0, Math.round(baseline + trend * (month + 1)));
    points.push({ month: monthLabel, emissions, projected });
  }

  return points;
}
