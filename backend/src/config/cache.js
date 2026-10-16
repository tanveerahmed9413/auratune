// Token blacklist store. Uses Redis when configured (REDIS_URL or REDIS_HOST),
// otherwise falls back to an in-memory Map so the app still runs without Redis.
let client = null;

const hasRedis = process.env.REDIS_URL || process.env.REDIS_HOST;

if (hasRedis) {
  const Redis = require("ioredis");
  const RedisClient = Redis.default || Redis;
  client = process.env.REDIS_URL
    ? new RedisClient(process.env.REDIS_URL)
    : new RedisClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      });
  client.on("connect", () => console.log("Connected to Redis"));
  client.on("error", (err) => console.log("Redis error:", err.message));
} else {
  console.log("Redis not configured, using in-memory token blacklist");
}

const memory = new Map();

module.exports = {
  async get(key) {
    if (client) return client.get(key);
    const exp = memory.get(key);
    if (exp && exp > Date.now()) return "1";
    memory.delete(key);
    return null;
  },
  async set(key, value, mode, seconds) {
    if (client) return client.set(key, value, mode, seconds);
    memory.set(key, Date.now() + seconds * 1000);
  },
};
