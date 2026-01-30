import redisClient from "../config/redis.js";

export const getOrSetCache = async (key, ttl, fetchFn) => {
  const cached = await redisClient.get(key);

  if (cached) {
    console.log("🟢 CACHE HIT:", key);
    return JSON.parse(cached);
  }

  console.log("🔴 CACHE MISS:", key);
  const freshData = await fetchFn();
  await redisClient.setEx(key, ttl, JSON.stringify(freshData));

  return freshData;
};