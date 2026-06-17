import { describe, it, expect } from 'vitest';
import { getLevel, getBadgeProgress, defaultChallenges } from './gamification';

describe('Gamification Engine', () => {
  describe('getLevel', () => {
    it('should assign Seedling for points below 400', () => {
      expect(getLevel(0)).toBe('Seedling');
      expect(getLevel(399)).toBe('Seedling');
    });

    it('should assign Tree for points between 400 and 899', () => {
      expect(getLevel(400)).toBe('Tree');
      expect(getLevel(899)).toBe('Tree');
    });

    it('should assign Forest Guardian for points between 900 and 1499', () => {
      expect(getLevel(900)).toBe('Forest Guardian');
      expect(getLevel(1499)).toBe('Forest Guardian');
    });

    it('should assign Planet Hero for points >= 1500', () => {
      expect(getLevel(1500)).toBe('Planet Hero');
      expect(getLevel(2000)).toBe('Planet Hero');
    });
  });

  describe('getBadgeProgress', () => {
    it('should calculate the progress relative to 1500 capped at 100', () => {
      expect(getBadgeProgress(0)).toBe(0);
      expect(getBadgeProgress(750)).toBe(50);
      expect(getBadgeProgress(1500)).toBe(100);
      expect(getBadgeProgress(2000)).toBe(100);
    });
  });

  describe('defaultChallenges', () => {
    it('should return default challenge definitions', () => {
      const challenges = defaultChallenges();
      expect(challenges).toHaveLength(3);
      expect(challenges[0].id).toBe('bike-5-days');
      expect(challenges[1].id).toBe('recycle-20-items');
      expect(challenges[2].id).toBe('save-50-kwh');
    });
  });
});
