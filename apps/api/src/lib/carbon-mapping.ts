import type { CarbonInput, FoodHabit } from '@carbonwise/shared';
import type { CarbonProfile, FoodHabit as PrismaFoodHabit } from '@carbonwise/database';

export function toPrismaFoodHabit(habit: FoodHabit): PrismaFoodHabit {
  if (habit === 'meat-heavy') return 'meat_heavy';
  return habit;
}

export function fromPrismaFoodHabit(habit: PrismaFoodHabit): FoodHabit {
  if (habit === 'meat_heavy') return 'meat-heavy';
  return habit;
}

export function profileToCarbonInput(profile: CarbonProfile): CarbonInput {
  return {
    transport: {
      carKmPerDay: profile.transportKmPerDay,
      bikeKmPerDay: profile.bikeKmPerDay,
      publicTransportKmPerDay: profile.publicTransportKmPerDay,
      evKmPerDay: profile.evKmPerDay,
    },
    energy: {
      monthlyKwh: profile.monthlyKwh,
      renewableSharePercent: profile.renewableSharePercent,
    },
    food: {
      habit: fromPrismaFoodHabit(profile.foodHabit),
    },
    waste: {
      recyclingFrequencyPerWeek: profile.recyclingFrequency,
      plasticUsageScore: profile.plasticUsageScore,
    },
    flights: {
      domesticPerYear: profile.domesticFlightsPerYear,
      internationalPerYear: profile.internationalFlightsPerYear,
    },
  };
}

export function carbonInputToProfileData(input: CarbonInput) {
  return {
    transportKmPerDay: input.transport.carKmPerDay,
    bikeKmPerDay: input.transport.bikeKmPerDay,
    publicTransportKmPerDay: input.transport.publicTransportKmPerDay,
    evKmPerDay: input.transport.evKmPerDay,
    monthlyKwh: input.energy.monthlyKwh,
    renewableSharePercent: input.energy.renewableSharePercent,
    foodHabit: toPrismaFoodHabit(input.food.habit),
    recyclingFrequency: input.waste.recyclingFrequencyPerWeek,
    plasticUsageScore: input.waste.plasticUsageScore,
    domesticFlightsPerYear: input.flights.domesticPerYear,
    internationalFlightsPerYear: input.flights.internationalPerYear,
  };
}
