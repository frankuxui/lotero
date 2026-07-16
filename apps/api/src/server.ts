import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const app = createApp();

app.listen(env.port, env.host, () => {
  logger.info(`API escuchando en http://${env.host}:${env.port}`);
});
