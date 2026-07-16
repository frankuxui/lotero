import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./client.js";

async function run(): Promise<void> {
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migraciones aplicadas correctamente.");
}

run().catch((error: unknown) => {
  console.error("Error aplicando migraciones:", error);
  process.exit(1);
});
