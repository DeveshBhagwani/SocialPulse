import redisClient from "../config/redis.js";

export const getOrSetCache = async (key, ttl, fetchFn) => {
  if (!redisClient.isReady) {
    return fetchFn();
  }

  try {
    const cached = await redisClient.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const freshData = await fetchFn();
    await redisClient.setEx(key, ttl, JSON.stringify(freshData));

    return freshData;
  } catch (error) {
    console.warn("Cache read/write skipped:", error.message);
    return fetchFn();
  }
};

export const deleteCacheKeys = async (keys) => {
  if (!redisClient.isReady || !keys.length) return;

  try {
    await redisClient.del(keys);
  } catch (error) {
    console.warn("Cache invalidation skipped:", error.message);
  }
};

export const clearAnalyticsCache = async (userId) => {
  const id = userId.toString();

  await deleteCacheKeys([
    `analytics:${id}:summary:7`,
    `analytics:${id}:summary:30`,
    `analytics:${id}:top-posts`,
    `analytics:${id}:engagement:7`,
    `analytics:${id}:engagement:30`,
    `analytics:${id}:audience-growth:7`,
    `analytics:${id}:audience-growth:30`
  ]);
};
