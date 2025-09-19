import { PrismaClient } from '@prisma/client';

declare global {
  var __globalPrisma__: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
export const prisma = globalThis.__globalPrisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__globalPrisma__ = prisma;
}
