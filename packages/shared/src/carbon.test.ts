import { describe, it, expect } from 'vitest';
import {
  calculateCarbonFootprint,
  calculateScore,
  getBand,
  generateRecommendations,
  buildChallenges,
} from './carbon';
import type { CarbonInput } from './types';

describe('Carbon Calculation Engine', () => {
  describe('calculateScore', () => {
    it('should return 100 for zero emissions', () => {
      expect(calculateScore(0)).toBe(100);
    });

    it('should return 0 for extremely high emissions', () => {
      expect(calculateScore(10000)).toBe(0);
    });

    it('should calculate standard emission scores correctly', () => {
      expect(calculateScore(4000)).toBe(50);
      expect(calculateScore(2400)).toBe(70);
    });
  });

  describe('getBand', () => {
    it('should return excellent for scores <= 30', () => {
      expect(getBand(10)).toBe('excellent');
      expect(getBand(30)).toBe('excellent');
    });

    it('should return good for scores between 31 and 60', () => {
      expect(getBand(45)).toBe('good');
      expect(getBand(60)).toBe('good');
    });

    it('should return needs-improvement for scores > 60', () => {
      expect(getBand(61)).toBe('needs-improvement');
      expect(getBand(95)).toBe('needs-improvement');
    });
  });

  describe('calculateCarbonFootprint', () => {
    it('should compute zero or minimal emissions parameters accurately', () => {
      const emptyInput: CarbonInput = {
        transport: { carKmPerDay: 0, publicTransportKmPerDay: 0, evKmPerDay: 0, bikeKmPerDay: 0 },
        energy: { monthlyKwh: 0, renewableSharePercent: 100 },
        food: { habit: 'vegan' },
        waste: { recyclingFrequencyPerWeek: 7, plasticUsageScore: 0 },
        flights: { domesticPerYear: 0, internationalPerYear: 0 },
      };

      const result = calculateCarbonFootprint(emptyInput);
      expect(result.transport).toBe(0);
      expect(result.energy).toBe(0);
      expect(result.food).toBe(800);
      expect(result.waste).toBe(0);
      expect(result.flights).toBe(0);
      expect(result.totalAnnual).toBe(800);
      expect(result.score).toBe(90);
    });

    it('should compute heavy carbon emissions parameters accurately', () => {
      const heavyInput: CarbonInput = {
        transport: { carKmPerDay: 50, publicTransportKmPerDay: 20, evKmPerDay: 10, bikeKmPerDay: 5 },
        energy: { monthlyKwh: 500, renewableSharePercent: 10 },
        food: { habit: 'meat-heavy' },
        waste: { recyclingFrequencyPerWeek: 1, plasticUsageScore: 8 },
        flights: { domesticPerYear: 2, internationalPerYear: 2 },
      };

      const result = calculateCarbonFootprint(heavyInput);
      expect(result.transport).toBeCloseTo(4690.25, 1);
      expect(result.energy).toBeCloseTo(2268.0, 1);
      expect(result.food).toBe(2400);
      expect(result.flights).toBe(1340);
      expect(result.totalAnnual).toBeGreaterThan(10000);
      expect(result.score).toBe(0);
    });
  });

  describe('generateRecommendations', () => {
    it('should return transport recommendation for high car usage', () => {
      const input: CarbonInput = {
        transport: { carKmPerDay: 15, publicTransportKmPerDay: 0, evKmPerDay: 0, bikeKmPerDay: 0 },
        energy: { monthlyKwh: 100, renewableSharePercent: 0 },
        food: { habit: 'vegan' },
        waste: { recyclingFrequencyPerWeek: 7, plasticUsageScore: 1 },
        flights: { domesticPerYear: 0, internationalPerYear: 0 },
      };

      const recs = generateRecommendations(input);
      expect(recs.some((r) => r.category === 'transport')).toBe(true);
    });

    it('should return food recommendation for meat-heavy or mixed diets', () => {
      const input: CarbonInput = {
        transport: { carKmPerDay: 0, publicTransportKmPerDay: 0, evKmPerDay: 0, bikeKmPerDay: 0 },
        energy: { monthlyKwh: 100, renewableSharePercent: 0 },
        food: { habit: 'meat-heavy' },
        waste: { recyclingFrequencyPerWeek: 7, plasticUsageScore: 1 },
        flights: { domesticPerYear: 0, internationalPerYear: 0 },
      };

      const recs = generateRecommendations(input);
      expect(recs.some((r) => r.category === 'food')).toBe(true);
    });
  });

  describe('buildChallenges', () => {
    it('should return standard list of challenges', () => {
      const challenges = buildChallenges();
      expect(challenges).toContain('Use bicycle 5 days');
      expect(challenges).toContain('Recycle 20 items');
      expect(challenges).toContain('Save 50 kWh electricity');
    });
  });
});
