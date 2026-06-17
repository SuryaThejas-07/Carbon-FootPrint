import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  buildForecastSeries,
  calculateCarbonFootprint,
  generateRecommendations,
} from '@carbonwise/shared';
import type { CarbonInput } from '@carbonwise/shared';
import { prisma, Prisma } from '@carbonwise/database';
import { optionalAuth, requireAuth } from './middleware/auth.js';
import { carbonInputToProfileData } from './lib/carbon-mapping.js';
import { getCarbonCoachReply } from './services/gemini.js';
import { getChallenges, getDashboardSummary } from './services/dashboard.js';
import { uploadWeeklyReport } from './services/storage.js';

const app = express();
const port = Number(process.env.PORT ?? 8080);

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(optionalAuth);

app.get('/health', async (_req, res) => {
  let database: 'ok' | 'unavailable' = 'unavailable';

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'ok';
  } catch {
    database = 'unavailable';
  }

  res.json({
    status: 'ok',
    service: 'carbonwise-api',
    database,
    timestamp: new Date().toISOString(),
  });
});

app.post('/v1/carbon/calculate', async (req, res) => {
  const result = calculateCarbonFootprint(req.body as CarbonInput);

  if (req.currentUser) {
    const input = req.body as CarbonInput;
    await prisma.carbonProfile.upsert({
      where: { userId: req.currentUser.id },
      update: {
        ...carbonInputToProfileData(input),
        sustainabilityScore: result.score,
      },
      create: {
        userId: req.currentUser.id,
        ...carbonInputToProfileData(input),
        sustainabilityScore: result.score,
      },
    });

    await prisma.carbonEntry.create({
      data: {
        userId: req.currentUser.id,
        category: 'total',
        value: result.totalMonthly,
        unit: 'kg',
        co2Kg: result.totalMonthly,
      },
    });
  }

  res.json({ data: result });
});

app.post('/v1/insights/chat', async (req, res) => {
  const question = String(req.body?.message ?? '');
  const context = req.body?.context ? String(req.body.context) : undefined;
  const suggestion = await getCarbonCoachReply(question, context);

  res.json({
    data: {
      assistant: 'CarbonWise AI Coach',
      message: suggestion,
      quickActions: [
        'Switch 3 weekly car trips to public transport',
        'Try 2 plant-based meals per week',
        'Reduce standby electricity losses',
      ],
    },
  });
});

app.get('/v1/dashboard/summary', async (req, res) => {
  const data = await getDashboardSummary(req.currentUser?.id);
  res.json({ data });
});

app.get('/v1/challenges', async (req, res) => {
  const data = await getChallenges(req.currentUser?.id);
  res.json({ data });
});

app.get('/v1/recommendations', (req, res) => {
  const carbonInput = (req.body as CarbonInput | undefined) ?? {
    transport: { carKmPerDay: 12, bikeKmPerDay: 0, publicTransportKmPerDay: 2, evKmPerDay: 1 },
    energy: { monthlyKwh: 320, renewableSharePercent: 20 },
    food: { habit: 'mixed' },
    waste: { recyclingFrequencyPerWeek: 3, plasticUsageScore: 5 },
    flights: { domesticPerYear: 3, internationalPerYear: 1 },
  };
  res.json({ data: generateRecommendations(carbonInput) });
});

app.post('/v1/forecast', async (req, res) => {
  const history = Array.isArray(req.body?.history)
    ? req.body.history.map(Number).filter((value: number) => Number.isFinite(value))
    : [1240, 1220, 1190, 1175];
  const series = buildForecastSeries(history);
  const expectedYearlyEmissions = Math.round(series.at(-1)?.projected ?? history.at(-1) ?? 0);
  const reductionPotential = Math.max(0, Math.round((history[0] ?? 0) - expectedYearlyEmissions));
  const futureSustainabilityScore = Math.min(100, Math.round(100 - expectedYearlyEmissions / 20));

  if (req.currentUser) {
    await prisma.carbonForecast.create({
      data: {
        userId: req.currentUser.id,
        expectedYearlyEmissions,
        reductionPotential,
        futureSustainabilityScore,
        data: series as unknown as Prisma.InputJsonValue,
      },
    });
  }

  res.json({
    data: {
      expectedYearlyEmissions,
      reductionPotential,
      futureSustainabilityScore,
      series,
    },
  });
});

app.post('/v1/reports/weekly', requireAuth, async (req, res) => {
  const summary =
    String(req.body?.summary ?? '') ||
    'Weekly report generated with footprint score, trends, achievements, and recommendations.';
  const reportUrl = await uploadWeeklyReport(req.currentUser!.id, summary);

  res.json({
    data: {
      reportUrl,
      summary,
    },
  });
});

app.listen(port, () => {
  console.log(`CarbonWise API listening on port ${port}`);
});
