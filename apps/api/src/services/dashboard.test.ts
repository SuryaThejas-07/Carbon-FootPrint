import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardSummary, getChallenges } from './dashboard';
import { prisma } from '@carbonwise/database';

// Mock the database package
vi.mock('@carbonwise/database', () => {
  return {
    prisma: {
      carbonProfile: {
        findUnique: vi.fn(),
      },
      carbonEntry: {
        findMany: vi.fn(),
      },
      challenge: {
        findMany: vi.fn(),
      },
      userChallenge: {
        findMany: vi.fn(),
      },
    },
  };
});

describe('Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDashboardSummary', () => {
    it('should return demo summary when userId is not provided', async () => {
      const summary = await getDashboardSummary();
      expect(summary.totalCarbonEmissions).toBeDefined();
      expect(summary.sustainabilityScore).toBeDefined();
      expect(summary.level).toBeDefined();
      expect(summary.progress).toBeDefined();
      expect(summary.monthlySeries).toHaveLength(12);
      expect(prisma.carbonProfile.findUnique).not.toHaveBeenCalled();
    });

    it('should query profile and entries and construct response when userId is provided', async () => {
      const mockProfile = {
        id: 'prof-1',
        userId: 'user-1',
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
        sustainabilityScore: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockEntries = [
        { id: 'e-1', userId: 'user-1', category: 'total', value: 100, unit: 'kg', co2Kg: 100, occurredAt: new Date() },
        { id: 'e-2', userId: 'user-1', category: 'total', value: 90, unit: 'kg', co2Kg: 90, occurredAt: new Date() },
      ];

      vi.mocked(prisma.carbonProfile.findUnique).mockResolvedValue(mockProfile as any);
      vi.mocked(prisma.carbonEntry.findMany).mockResolvedValue(mockEntries as any);

      const summary = await getDashboardSummary('user-1');

      expect(prisma.carbonProfile.findUnique).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(prisma.carbonEntry.findMany).toHaveBeenCalled();
      expect(summary.sustainabilityScore).toBe(75);
      expect(summary.monthlySeries).toEqual([100, 90]);
      expect(summary.emissionTrend).toBe(-10); // ((90 - 100) / 100) * 100 = -10%
    });

    it('should fallback to demo input calculations when user has no profile', async () => {
      vi.mocked(prisma.carbonProfile.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.carbonEntry.findMany).mockResolvedValue([]);

      const summary = await getDashboardSummary('user-1');
      expect(summary.sustainabilityScore).toBeDefined();
      expect(summary.monthlySeries).toHaveLength(12);
    });
  });

  describe('getChallenges', () => {
    it('should return default challenges if no challenges in DB', async () => {
      vi.mocked(prisma.challenge.findMany).mockResolvedValue([]);
      const challenges = await getChallenges('user-1');
      expect(challenges).toHaveLength(3);
      expect(challenges[0].id).toBe('bike-5-days');
    });

    it('should return challenges without progress when userId is not provided', async () => {
      const dbChallenges = [
        { id: 'c-1', title: 'C1', description: 'Desc 1', points: 100, badge: 'B1', createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.mocked(prisma.challenge.findMany).mockResolvedValue(dbChallenges as any);

      const challenges = await getChallenges();
      expect(challenges).toHaveLength(1);
      expect(challenges[0]).toEqual({
        id: 'c-1',
        title: 'C1',
        description: 'Desc 1',
        points: 100,
        badge: 'B1',
      });
      expect(prisma.userChallenge.findMany).not.toHaveBeenCalled();
    });

    it('should return challenges with progress map when userId is provided', async () => {
      const dbChallenges = [
        { id: 'c-1', title: 'C1', description: 'Desc 1', points: 100, badge: 'B1', createdAt: new Date(), updatedAt: new Date() },
        { id: 'c-2', title: 'C2', description: 'Desc 2', points: 200, badge: 'B2', createdAt: new Date(), updatedAt: new Date() },
      ];
      const dbUserChallenges = [
        { id: 'uc-1', userId: 'user-1', challengeId: 'c-1', progress: 50, completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      vi.mocked(prisma.challenge.findMany).mockResolvedValue(dbChallenges as any);
      vi.mocked(prisma.userChallenge.findMany).mockResolvedValue(dbUserChallenges as any);

      const challenges = await getChallenges('user-1');
      expect(challenges).toHaveLength(2);
      expect(challenges[0].progress).toBe(50);
      expect(challenges[1].progress).toBe(0);
    });
  });
});
