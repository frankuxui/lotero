import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

function ensureLocalDatabaseDir(databaseUrl: string): void {
  if (!databaseUrl.startsWith("file:")) {
    return;
  }

  const filePath = databaseUrl.includes("://")
    ? fileURLToPath(databaseUrl)
    : databaseUrl.slice("file:".length);

  const directory = dirname(filePath);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
}

ensureLocalDatabaseDir(env.databaseUrl);

const client = createClient({ url: env.databaseUrl });

export const db = drizzle(client, { schema });
export type Database = typeof db;
