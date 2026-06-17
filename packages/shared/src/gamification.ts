import type { Challenge } from './types';

export const LEVELS = ['Seedling', 'Tree', 'Forest Guardian', 'Planet Hero'] as const;

export function getLevel(points: number): (typeof LEVELS)[number] {
  if (points >= 1500) return 'Planet Hero';
  if (points >= 900) return 'Forest Guardian';
  if (points >= 400) return 'Tree';
  return 'Seedling';
}

export function getBadgeProgress(points: number): number {
  return Math.min(100, Math.round((points / 1500) * 100));
}

export function defaultChallenges(): Challenge[] {
  return [
    {
      id: 'bike-5-days',
      title: 'Use bicycle 5 days',
      description: 'Replace short motorized trips with cycling for a workweek.',
      points: 220,
      badge: 'Cycling Champion',
    },
    {
      id: 'recycle-20-items',
      title: 'Recycle 20 items',
      description: 'Track and log household recyclables across the week.',
      points: 180,
      badge: 'Recycling Ranger',
    },
    {
      id: 'save-50-kwh',
      title: 'Save 50 kWh electricity',
      description: 'Reduce consumption through mindful usage and efficient devices.',
      points: 260,
      badge: 'Energy Saver',
    },
  ];
}
