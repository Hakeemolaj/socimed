import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Function to create a prisma client with error handling
function createPrismaClient(): PrismaClient | undefined {
  try {
    const client = new PrismaClient();
    return client;
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    return undefined;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 