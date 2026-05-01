import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisEnabled =
  process.env.REDIS_ENABLED === "true" || Boolean(process.env.REDIS_URL);

const redisClient = redisEnabled
  ? createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: false
      }
    })
  : { isReady: false };

if (redisEnabled) {
  redisClient.on("error", (err) => {
    console.error("Redis unavailable:", err.message);
  });

  redisClient.connect().catch((err) => {
    console.warn("Redis cache disabled:", err.message);
  });
}

export default redisClient;
