import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Get the directory of this file and traverse up to project root
const packageDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(packageDir, "../../");

// Try multiple paths to find .env
const envPaths = [
  path.join(projectRoot, ".env"),
  path.join(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
];

// Load from each path until one works
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log("Loaded .env from:", envPath);
    break;
  }
}

// If still not loaded, try default paths
if (!process.env.DATABASE_URL) {
  dotenv.config(); // Fallback to default
}

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debug log to verify env variable is loaded

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;