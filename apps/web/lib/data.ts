import type { CarbonInput } from '@carbonwise/shared';

export const demoCarbonInput: CarbonInput = {
  transport: {
    carKmPerDay: 14,
    bikeKmPerDay: 2,
    publicTransportKmPerDay: 6,
    evKmPerDay: 1,
  },
  energy: {
    monthlyKwh: 340,
    renewableSharePercent: 28,
  },
  food: {
    habit: 'mixed',
  },
  waste: {
    recyclingFrequencyPerWeek: 4,
    plasticUsageScore: 5,
  },
  flights: {
    domesticPerYear: 4,
    internationalPerYear: 1,
  },
};
