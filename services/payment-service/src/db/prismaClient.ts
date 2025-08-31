// src/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { logger } from "../utils/logger";

// Global singleton for hot reloads
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Create Prisma client
const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: "query", emit: "event" } as Prisma.LogDefinition,
      { level: "info", emit: "event" } as Prisma.LogDefinition,
      { level: "warn", emit: "event" } as Prisma.LogDefinition,
      { level: "error", emit: "event" } as Prisma.LogDefinition,
    ],
    errorFormat: "pretty",
  });

// ✅ Event listeners
// query
(prisma.$on as any)("query", (e: Prisma.QueryEvent) => {
  console.log("\x1b[36m%s\x1b[0m", "[Prisma Query]");
  console.log("Query:", e.query);
  console.log("Params:", e.params);
  console.log("Duration:", e.duration, "ms");
});


// info/warn/error
(prisma.$on as any)("info", (e: Prisma.LogEvent) =>
  console.info("\x1b[32m%s\x1b[0m", "[Prisma Info]", e.message)
);
(prisma.$on as any)("warn", (e: Prisma.LogEvent) =>
  console.warn("\x1b[33m%s\x1b[0m", "[Prisma Warn]", e.message)
);
(prisma.$on as any)("error", (e: Prisma.LogEvent) =>
  console.error("\x1b[31m%s\x1b[0m", "[Prisma Error]", e.message)
);
 

// Hot reload singleton
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Handle disconnect on process beforeExit
process.once("beforeExit", async () => {
  try {
    logger.info("Disconnecting Prisma client...");
    await prisma.$disconnect();
  } catch (err:unknown) {
      const errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err);
      logger.error(`Error disconnecting Prisma client: ${errorMessage}`);

  }
});

export default prisma;

