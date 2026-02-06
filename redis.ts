const cacheKey = `products:${cursor}:${limit}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const data = await getProducts(cursor, limit);
await redis.set(cacheKey, JSON.stringify(data), "EX", 60);
