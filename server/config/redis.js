import redis from "redis";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => {
  console.log("✅ Redis Client Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error:", err.message);
});

await redisClient.connect();

export default redisClient;
