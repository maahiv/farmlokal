import redis from "../cache/redis";
import { getProducts } from "./product.repo";

export async function fetchProducts(cursor: number, limit: number) {
  const cacheKey = `products:${cursor}:${limit}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const products = await getProducts(cursor, limit);

  await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

  return products;
}
