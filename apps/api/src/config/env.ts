import "dotenv/config";

interface AppEnv {
  port: number;
  host: string;
  databaseUrl: string;
  nodeEnv: "development" | "production" | "test";
  logLevel: string;
  httpLogs: boolean;
  corsOrigin: string[];
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "1" || value.toLowerCase() === "true";
}

function readEnv(): AppEnv {
  const nodeEnv = (process.env.NODE_ENV as AppEnv["nodeEnv"]) ?? "development";

  return {
    port: Number(process.env.PORT ?? 4000),
    host: process.env.HOST ?? "0.0.0.0",
    databaseUrl: process.env.DATABASE_URL ?? "file:./data/lotero.db",
    nodeEnv,
    logLevel: process.env.LOG_LEVEL ?? "info",
    httpLogs: parseBoolean(process.env.HTTP_LOGS, nodeEnv !== "production"),
    corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  };
}

export const env = readEnv();
