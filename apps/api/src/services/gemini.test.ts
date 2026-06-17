import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGeminiFallback, getCarbonCoachReply } from './gemini';

vi.mock('@google/generative-ai', () => {
  const generateContentMock = vi.fn().mockResolvedValue({
    response: {
      text: () => 'Mocked response from Gemini API',
    },
  });
  const getGenerativeModelMock = vi.fn().mockReturnValue({
    generateContent: generateContentMock,
  });
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock,
    })),
  };
});

import { GoogleGenerativeAI } from '@google/generative-ai';

describe('Gemini Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  describe('getGeminiFallback', () => {
    it('should return transport advice if message contains transport', () => {
      const response = getGeminiFallback('Tell me about transport');
      expect(response).toContain('public transport');
      expect(response).toContain('220 kg');
    });

    it('should return renewable advice if message contains renewable', () => {
      const response = getGeminiFallback('Should I use renewable energy?');
      expect(response).toContain('solar');
      expect(response).toContain('green energy');
    });

    it('should return default fallback advice for other inputs', () => {
      const response = getGeminiFallback('Hello world');
      expect(response).toContain('high-impact habits');
      expect(response).toContain('personalized weekly plan');
    });
  });

  describe('getCarbonCoachReply', () => {
    it('should fallback to local response if GEMINI_API_KEY is not defined', async () => {
      delete process.env.GEMINI_API_KEY;
      const response = await getCarbonCoachReply('transport');
      expect(response).toContain('public transport');
    });

    it('should call GoogleGenerativeAI and return response text if GEMINI_API_KEY is set', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      const response = await getCarbonCoachReply('transport');
      expect(response).toBe('Mocked response from Gemini API');
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
    });

    it('should recover using fallback if API call throws an error', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      
      const client = new GoogleGenerativeAI('test-api-key');
      const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
      vi.mocked(model.generateContent).mockRejectedValue(new Error('API Error'));

      const response = await getCarbonCoachReply('transport');
      expect(response).toContain('public transport');
    });
  });
});
