import { describe, it, expect } from 'vitest';
import {
  toPrismaFoodHabit,
  fromPrismaFoodHabit,
  profileToCarbonInput,
  carbonInputToProfileData,
} from './carbon-mapping';
import type { CarbonProfile } from '@carbonwise/database';
import type { CarbonInput } from '@carbonwise/shared';

describe('Carbon Mapping Utilities', () => {
  describe('toPrismaFoodHabit', () => {
    it('should map meat-heavy diet to meat_heavy prisma format', () => {
      expect(toPrismaFoodHabit('meat-heavy')).toBe('meat_heavy');
    });

    it('should pass through vegetarian and vegan habits', () => {
      expect(toPrismaFoodHabit('vegetarian')).toBe('vegetarian');
      expect(toPrismaFoodHabit('vegan')).toBe('vegan');
    });
  });

  describe('fromPrismaFoodHabit', () => {
    it('should map meat_heavy prisma habit to meat-heavy standard format', () => {
      expect(fromPrismaFoodHabit('meat_heavy')).toBe('meat-heavy');
    });

    it('should pass through other prisma food habits', () => {
      expect(fromPrismaFoodHabit('vegan')).toBe('vegan');
    });
  });

  describe('profileToCarbonInput & carbonInputToProfileData bidirectional mapping', () => {
    it('should translate db schema profile to carbon input correctly', () => {
      const dbProfile: CarbonProfile = {
        id: '1',
        userId: 'user-123',
        transportKmPerDay: 10,
        bikeKmPerDay: 5,
        publicTransportKmPerDay: 15,
        evKmPerDay: 2,
        monthlyKwh: 200,
        renewableSharePercent: 50,
        foodHabit: 'meat_heavy',
        recyclingFrequency: 4,
        plasticUsageScore: 3,
        domesticFlightsPerYear: 2,
        internationalFlightsPerYear: 1,
        sustainabilityScore: 78,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = profileToCarbonInput(dbProfile);
      expect(result.transport.carKmPerDay).toBe(10);
      expect(result.food.habit).toBe('meat-heavy');
      expect(result.waste.plasticUsageScore).toBe(3);
    });

    it('should translate carbon input model back into db payload format', () => {
      const input: CarbonInput = {
        transport: { carKmPerDay: 8, bikeKmPerDay: 2, publicTransportKmPerDay: 12, evKmPerDay: 0 },
        energy: { monthlyKwh: 150, renewableSharePercent: 100 },
        food: { habit: 'vegan' },
        waste: { recyclingFrequencyPerWeek: 5, plasticUsageScore: 2 },
        flights: { domesticPerYear: 1, internationalPerYear: 0 },
      };

      const result = carbonInputToProfileData(input);
      expect(result.transportKmPerDay).toBe(8);
      expect(result.foodHabit).toBe('vegan');
      expect(result.recyclingFrequency).toBe(5);
    });
  });
});
