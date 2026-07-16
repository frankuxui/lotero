import { db } from "../client.js";
import { draws, bets, betLines } from "../schema.js";
import { createId } from "../../utils/id.js";

async function seed(): Promise<void> {
  const now = new Date().toISOString();

  await db.insert(draws).values([
    {
      id: createId(),
      game: "BONOLOTO",
      drawDate: "2026-07-10",
      numbers: [7, 19, 23, 31, 44, 45],
      extras: { complementario: 1, reintegro: 3 },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      game: "PRIMITIVA",
      drawDate: "2026-07-11",
      numbers: [6, 35, 39, 45, 46, 47],
      extras: { complementario: 18, reintegro: 6, joker: "6240449" },
      createdAt: now,
      updatedAt: now,
    },
  ]);

  const betId = createId();
  await db.insert(bets).values({
    id: betId,
    game: "BONOLOTO",
    label: "Apuesta de ejemplo",
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(betLines).values([
    {
      id: createId(),
      betId,
      numbers: [2, 18, 23, 44, 45, 49],
      extras: { complementario: 5, reintegro: 2 },
      createdAt: now,
    },
  ]);

  console.log("Seed completado.");
}

seed().catch((error: unknown) => {
  console.error("Error al ejecutar el seed:", error);
  process.exit(1);
});
