import type { CarbonBreakdown, CarbonInput, CarbonScoreBand, Recommendation } from './types';

const FOOD_FACTORS = {
  vegetarian: 1.1,
  vegan: 0.8,
  mixed: 1.6,
  'meat-heavy': 2.4,
} as const;

export function calculateCarbonFootprint(input: CarbonInput): CarbonBreakdown {
  const transport = round2(
    input.transport.carKmPerDay * 0.21 * 365 +
      input.transport.publicTransportKmPerDay * 0.09 * 365 +
      input.transport.evKmPerDay * 0.05 * 365 +
      input.transport.bikeKmPerDay * 0.01 * 365,
  );

  const energy = round2(input.energy.monthlyKwh * 0.42 * 12 * (1 - input.energy.renewableSharePercent / 100));
  const food = round2(FOOD_FACTORS[input.food.habit] * 1000);
  const waste = round2((7 - Math.min(7, input.waste.recyclingFrequencyPerWeek)) * 42 + input.waste.plasticUsageScore * 22);
  const flights = round2(input.flights.domesticPerYear * 120 + input.flights.internationalPerYear * 550);

  const totalAnnual = round2(transport + energy + food + waste + flights);
  const totalMonthly = round2(totalAnnual / 12);
  const score = calculateScore(totalAnnual);

  return {
    transport,
    energy,
    food,
    waste,
    flights,
    totalMonthly,
    totalAnnual,
    score,
    band: getBand(score),
  };
}

export function calculateScore(totalAnnualKg: number): number {
  const normalized = 100 - Math.min(100, Math.max(0, totalAnnualKg / 80));
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

export function getBand(score: number): CarbonScoreBand {
  if (score <= 30) return 'excellent';
  if (score <= 60) return 'good';
  return 'needs-improvement';
}

export function generateRecommendations(input: CarbonInput): Recommendation[] {
  const recs: Recommendation[] = [];

  if (input.transport.carKmPerDay > 8) {
    recs.push({
      category: 'transport',
      title: 'Replace 3 weekly car trips with public transport',
      impact: 'high',
      difficulty: 'easy',
      estimatedCo2ReductionKg: 220,
      detail: 'This shift cuts short-distance emissions without changing your routine too much.',
    });
  }

  if (input.energy.monthlyKwh > 300) {
    recs.push({
      category: 'energy',
      title: 'Reduce standby usage and optimize cooling',
      impact: 'medium',
      difficulty: 'easy',
      estimatedCo2ReductionKg: 140,
      detail: 'Smart plugs and thermostat tuning can reduce electricity waste quickly.',
    });
  }

  if (input.food.habit === 'meat-heavy' || input.food.habit === 'mixed') {
    recs.push({
      category: 'food',
      title: 'Swap two meat meals per week for plant-based options',
      impact: 'high',
      difficulty: 'moderate',
      estimatedCo2ReductionKg: 180,
      detail: 'Food shifts usually create one of the highest annual carbon reductions.',
    });
  }

  if (input.waste.plasticUsageScore > 4) {
    recs.push({
      category: 'waste',
      title: 'Cut single-use plastic in daily purchases',
      impact: 'medium',
      difficulty: 'easy',
      estimatedCo2ReductionKg: 60,
      detail: 'Reusable containers and refill stations are low-friction changes.',
    });
  }

  if (input.flights.internationalPerYear > 0) {
    recs.push({
      category: 'travel',
      title: 'Offset long-haul flights with verified climate projects',
      impact: 'medium',
      difficulty: 'easy',
      estimatedCo2ReductionKg: 320,
      detail: 'Offsetting is best used alongside reduction habits and smarter travel planning.',
    });
  }

  return recs.slice(0, 5);
}

export function buildChallenges(): string[] {
  return ['Use bicycle 5 days', 'Recycle 20 items', 'Save 50 kWh electricity'];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
