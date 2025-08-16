#!/bin/bash

# Core services list
CORE_SERVICES=(
  "user-profile-service"
  "admin-service"
  "superadmin-service"
  "sellerservice"
  "buyer-service"
  "agent-service"
  "payment-service"
  "compliance-service"
  "exit-as-a-service"
)

# Non-Core services list
NON_CORE_SERVICES=(
  "ml-monitoring-service"
  "recommendation-service"
  "valuation-service"
  "matchmaking-service"
  "search-matchmaking-service"
  "transaction-matching-service"
)

# Base folders for each service
BASE_FOLDERS=("src/routes" "src/controllers" "src/services" "src/repositories" "src/middlewares" "src/utils" "src/tests" "src/config" "src/db" "prisma" "src/kafka")

function scaffold_core_service() {
  local service=$1
  echo "Scaffolding core service: $service"
  mkdir -p "$service"/{src/{routes,controllers,services,repositories,middlewares,utils,tests,config,db},prisma}
  
  # Create dummy schema.prisma symlink or copy
  ln -sf ../../../shared/db/schema.prisma "$service/prisma/schema.prisma"
  
  # Create config/env.ts
  cat > "$service/src/config/env.ts" <<EOF
import dotenv from "dotenv";
dotenv.config();

export const Config = {
  port: process.env.SERVICE_PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "changeme",
  dbUrl: process.env.DATABASE_URL!,
};
EOF

  # Create prismaClient.ts
  cat > "$service/src/db/prismaClient.ts" <<EOF
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
EOF

  # Create requireAuth middleware (shared auth)
  cat > "$service/src/middlewares/requireAuth.ts" <<EOF
import { jwtMw } from "@shared/auth";
import { Config } from "../config/env";
export default jwtMw(Config.jwtSecret);
EOF

  # Create basic logger util
  cat > "$service/src/utils/logger.ts" <<EOF
import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime
});
EOF

  # Create package.json template
  cat > "$service/package.json" <<EOF
{
  "name": "$service",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --runInBand"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "pino": "^8.0.0",
    "zod": "^3.20.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.15",
    "@types/jest": "^29.0.0",
    "@types/node": "^18.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "jest": "^29.0.0",
    "prisma": "^5.0.0",
    "supertest": "^6.3.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  }
}
EOF

  # Create tsconfig.json template
  cat > "$service/tsconfig.json" <<EOF
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowJs": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
EOF

  # Create src/index.ts scaffold with express + routes placeholder
  cat > "$service/src/index.ts" <<EOF
import express from "express";
import { Config } from "./config/env";
import { logger } from "./utils/logger";
import cors from "cors";

// import your routes here, e.g.:
// import apiRoutes from "./routes/api.routes";

const app = express();
app.use(express.json());
app.use(cors());

// app.use("/api", apiRoutes);

app.listen(Config.port, () => {
  logger.info("$service running on port " + Config.port);
});
EOF
}

function scaffold_non_core_service() {
  local service=$1
  echo "Scaffolding non-core service: $service"
  mkdir -p "$service"/{src/{routes,controllers,services,repositories,middlewares,kafka,utils,tests,config,db},prisma}
  
  ln -sf ../../../shared/db/schema.prisma "$service/prisma/schema.prisma"

  # env.ts includes kafka config
  cat > "$service/src/config/env.ts" <<EOF
import dotenv from "dotenv";
dotenv.config();

export const Config = {
  port: process.env.SERVICE_PORT || 8000,
  dbUrl: process.env.DATABASE_URL!,
  kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "$service-group",
  kafkaTopic: process.env.KAFKA_TOPIC || "default-topic"
};
EOF

  cat > "$service/src/db/prismaClient.ts" <<EOF
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
EOF

  cat > "$service/src/middlewares/requireAuth.ts" <<EOF
import { jwtMw } from "@shared/auth";
import { Config } from "../config/env";
export default jwtMw(Config.jwtSecret);
EOF

  cat > "$service/src/utils/logger.ts" <<EOF
import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime
});
EOF

  cat > "$service/package.json" <<EOF
{
  "name": "$service",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --runInBand"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "kafkajs": "^2.2.0",
    "pino": "^8.0.0",
    "zod": "^3.20.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.15",
    "@types/jest": "^29.0.0",
    "@types/node": "^18.0.0",
    "jest": "^29.0.0",
    "prisma": "^5.0.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  }
}
EOF

  cat > "$service/tsconfig.json" <<EOF
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowJs": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
EOF

  # Kafka consumer example stub
  cat > "$service/src/kafka/consumer.ts" <<EOF
import { Kafka } from "kafkajs";
import { Config } from "../config/env";
import { logger } from "../utils/logger";

const kafka = new Kafka({
  clientId: "$service",
  brokers: Config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: Config.kafkaGroupId });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: Config.kafkaTopic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value?.toString() || "{}");
        // TODO: Implement message processing logic
        logger.info({ msg: "Message consumed", payload });
      } catch (error) {
        logger.error({ msg: "Failed to process message", error });
      }
    },
  });
}
EOF

  # Express app stub with Kafka consumer start
  cat > "$service/src/index.ts" <<EOF
import express from "express";
import { Config } from "./config/env";
import { logger } from "./utils/logger";
import cors from "cors";
import { startConsumer } from "./kafka/consumer";

const app = express();
app.use(express.json());
app.use(cors());

// TODO: Add routes if HTTP API required

app.listen(Config.port, () => {
  logger.info("$service running on port " + Config.port);
  startConsumer().catch(err => logger.error("Kafka consumer failed:", err));
});
EOF
}

# Scaffold all core services
for service in "${CORE_SERVICES[@]}"; do
  scaffold_core_service "$service"
done

# Scaffold all non-core services
for service in "${NON_CORE_SERVICES[@]}"; do
  scaffold_non_core_service "$service"
done

echo "All services scaffolded. Remember to fill business logic and routing!"
