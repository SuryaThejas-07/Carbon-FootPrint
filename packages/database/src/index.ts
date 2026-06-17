import { Prisma, PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { Prisma, PrismaClient };
export type {
  User,
  CarbonProfile,
  CarbonEntry,
  Challenge,
  UserChallenge,
  Badge,
  Community,
  Recommendation,
  CarbonForecast,
  FoodHabit,
} from '@prisma/client';
