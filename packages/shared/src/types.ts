export type CarbonCategory = 'transport' | 'energy' | 'food' | 'waste' | 'flights';

export type FoodHabit = 'vegetarian' | 'vegan' | 'mixed' | 'meat-heavy';

export type CarbonScoreBand = 'excellent' | 'good' | 'needs-improvement';

export interface CarbonInput {
  transport: {
    carKmPerDay: number;
    bikeKmPerDay: number;
    publicTransportKmPerDay: number;
    evKmPerDay: number;
  };
  energy: {
    monthlyKwh: number;
    renewableSharePercent: number;
  };
  food: {
    habit: FoodHabit;
  };
  waste: {
    recyclingFrequencyPerWeek: number;
    plasticUsageScore: number;
  };
  flights: {
    domesticPerYear: number;
    internationalPerYear: number;
  };
}

export interface CarbonBreakdown {
  transport: number;
  energy: number;
  food: number;
  waste: number;
  flights: number;
  totalMonthly: number;
  totalAnnual: number;
  score: number;
  band: CarbonScoreBand;
}

export interface Recommendation {
  category: CarbonCategory | 'travel';
  title: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'moderate' | 'hard';
  estimatedCo2ReductionKg: number;
  detail: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  badge: string;
}

export interface ForecastPoint {
  month: string;
  emissions: number;
  projected: number;
}
