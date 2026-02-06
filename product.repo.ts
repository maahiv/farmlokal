// src/products/product.repo.ts
export async function getProducts(cursor: number, limit: number) {
  return db.query(`
    SELECT * FROM products
    WHERE id > ?
    ORDER BY id
    LIMIT ?
  `, [cursor, limit]);
}
