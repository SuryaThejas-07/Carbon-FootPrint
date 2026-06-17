import { prisma } from '@carbonwise/database';
import { buildForecastSeries, calculateCarbonFootprint, defaultChallenges, getBadgeProgress, getLevel } from '@carbonwise/shared';
import type { CarbonInput } from '@carbonwise/shared';
import { profileToCarbonInput } from '../lib/carbon-mapping.js';

const demoInput: CarbonInput = {
  transport: { carKmPerDay: 12, bikeKmPerDay: 0, publicTransportKmPerDay: 2, evKmPerDay: 1 },
  energy: { monthlyKwh: 320, renewableSharePercent: 20 },
  food: { habit: 'mixed' },
  waste: { recyclingFrequencyPerWeek: 3, plasticUsageScore: 5 },
  flights: { domesticPerYear: 3, internationalPerYear: 1 },
};

export async function getDashboardSummary(userId?: string) {
  if (!userId) {
    const result = calculateCarbonFootprint(demoInput);
    return {
      totalCarbonEmissions: Math.round(result.totalAnnual),
      emissionTrend: -12,
      carbonSaved: 320,
      sustainabilityScore: result.score,
      level: getLevel(980),
      progress: getBadgeProgress(980),
      monthlySeries: [110, 104, 99, 94, 90, 86, 82, 79, 75, 72, 70, 68],
      categoryComparison: [
        { name: 'Transport', value: result.transport },
        { name: 'Energy', value: result.energy },
        { name: 'Food', value: result.food },
        { name: 'Waste', value: result.waste },
        { name: 'Flights', value: result.flights },
      ],
      yearlyReductionTrend: buildForecastSeries([1280, 1230, 1180, 1140, 1100, 1060, 1020, 990, 960, 940, 900, 860]),
    };
  }

  const profile = await prisma.carbonProfile.findUnique({ where: { userId } });
  const entries = await prisma.carbonEntry.findMany({
    where: { userId },
    orderBy: { occurredAt: 'asc' },
    take: 12,
  });

  const input = profile ? profileToCarbonInput(profile) : demoInput;
  const result = calculateCarbonFootprint(input);
  const monthlySeries =
    entries.length > 0
      ? entries.map((entry) => Math.round(entry.co2Kg))
      : Array.from({ length: 12 }, (_, index) => Math.round(result.totalMonthly * (1 - index * 0.02)));

  const previous = monthlySeries.at(-2) ?? result.totalMonthly;
  const latest = monthlySeries.at(-1) ?? result.totalMonthly;
  const emissionTrend = previous > 0 ? Math.round(((latest - previous) / previous) * 100) : 0;
  const points = Math.max(0, Math.round(1500 - result.totalAnnual));

  return {
    totalCarbonEmissions: Math.round(result.totalAnnual),
    emissionTrend,
    carbonSaved: Math.max(0, Math.round(1500 - result.totalAnnual)),
    sustainabilityScore: profile?.sustainabilityScore ?? result.score,
    level: getLevel(points),
    progress: getBadgeProgress(points),
    monthlySeries,
    categoryComparison: [
      { name: 'Transport', value: result.transport },
      { name: 'Energy', value: result.energy },
      { name: 'Food', value: result.food },
      { name: 'Waste', value: result.waste },
      { name: 'Flights', value: result.flights },
    ],
    yearlyReductionTrend: buildForecastSeries(monthlySeries.length > 1 ? monthlySeries : [result.totalAnnual]),
  };
}

export async function getChallenges(userId?: string) {
  const challenges = await prisma.challenge.findMany({ orderBy: { createdAt: 'asc' } });
  if (challenges.length === 0) {
    return defaultChallenges();
  }

  if (!userId) {
    return challenges.map((challenge) => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      points: challenge.points,
      badge: challenge.badge,
    }));
  }

  const progress = await prisma.userChallenge.findMany({ where: { userId } });
  const progressMap = new Map(progress.map((item) => [item.challengeId, item.progress]));

  return challenges.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    points: challenge.points,
    badge: challenge.badge,
    progress: progressMap.get(challenge.id) ?? 0,
  }));
}
