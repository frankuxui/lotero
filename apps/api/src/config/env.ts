import "dotenv/config";

interface AppEnv {
  port: number;
  host: string;
  databaseUrl: string;
  nodeEnv: "development" | "production" | "test";
  logLevel: string;
  corsOrigin: string[];
}

function readEnv(): AppEnv {
  return {
    port: Number(process.env.PORT ?? 4000),
    host: process.env.HOST ?? "0.0.0.0",
    databaseUrl: process.env.DATABASE_URL ?? "file:./data/lotero.db",
    nodeEnv: (process.env.NODE_ENV as AppEnv["nodeEnv"]) ?? "development",
    logLevel: process.env.LOG_LEVEL ?? "info",
    corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  };
}

export const env = readEnv();
