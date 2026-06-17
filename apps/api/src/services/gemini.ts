import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT =
  'You are CarbonWise AI Coach, a concise sustainability advisor. Give practical, encouraging carbon-reduction advice in 2-4 sentences. Mention estimated CO2 impact when possible.';

export function getGeminiFallback(message: string): string {
  if (message.toLowerCase().includes('transport')) {
    return 'Switching 3 weekly car trips to public transport can reduce your annual emissions by about 220 kg CO₂. A good next step is to batch errands and combine trips.';
  }

  if (message.toLowerCase().includes('renewable')) {
    return 'Your best renewable options are rooftop solar, community solar, and green energy plans. Start by checking your local solar potential and utility incentives.';
  }

  return 'Focus on high-impact habits first: transport, electricity usage, and meals. I can turn your inputs into a personalized weekly plan with savings estimates and achievable micro-goals.';
}

export async function getCarbonCoachReply(message: string, context?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return getGeminiFallback(message);
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = context
      ? `${SYSTEM_PROMPT}\n\nUser footprint context:\n${context}\n\nUser question: ${message}`
      : `${SYSTEM_PROMPT}\n\nUser question: ${message}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || getGeminiFallback(message);
  } catch {
    return getGeminiFallback(message);
  }
}
